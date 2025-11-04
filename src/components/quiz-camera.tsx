"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Camera, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "./ui/label";

type QuizCameraProps = {
  onCapture: (dataUri: string, language: string) => void;
  isLoading: boolean;
};

export default function QuizCamera({ onCapture, isLoading }: QuizCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [language, setLanguage] = useState("english");
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          variant: "destructive",
          title: "Camera Not Supported",
          description: "Your browser does not support camera access.",
        });
        setHasCameraPermission(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please enable camera permissions in your browser settings to use this feature.",
        });
      }
    };

    getCameraPermission();

    return () => {
      // Cleanup: stop video stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUri = canvas.toDataURL("image/jpeg");
      setCapturedImage(dataUri);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleGenerateQuiz = () => {
    if (capturedImage) {
      onCapture(capturedImage, language);
    }
  };

  if (hasCameraPermission === null) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!hasCameraPermission) {
    return (
      <Alert variant="destructive">
        <Camera className="h-4 w-4" />
        <AlertTitle>Camera Access Required</AlertTitle>
        <AlertDescription>
          Please allow camera access in your browser to use this feature. You might need to refresh the page after granting permissions.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="relative aspect-video">
          {capturedImage ? (
            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
          ) : (
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
          )}
        </div>
      </Card>

      <canvas ref={canvasRef} className="hidden" />

      <div className="space-y-2">
        <Label htmlFor="language-camera">Quiz Language</Label>
        <Select value={language} onValueChange={setLanguage} disabled={isLoading}>
          <SelectTrigger id="language-camera">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="hindi">Hindi</SelectItem>
            <SelectItem value="spanish">Spanish</SelectItem>
            <SelectItem value="french">French</SelectItem>
            <SelectItem value="german">German</SelectItem>
            <SelectItem value="chinese">Chinese</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {capturedImage ? (
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={handleRetake} variant="outline" disabled={isLoading}>
            <RefreshCw className="mr-2" />
            Retake
          </Button>
          <Button onClick={handleGenerateQuiz} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Quiz"
            )}
          </Button>
        </div>
      ) : (
        <Button onClick={handleCapture} className="w-full" size="lg" disabled={isLoading}>
          <Camera className="mr-2" />
          Capture Photo
        </Button>
      )}
    </div>
  );
}

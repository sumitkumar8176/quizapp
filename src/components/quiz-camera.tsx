
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Camera, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { translations } from "@/lib/translations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type QuizCameraProps = {
  onCapture: (dataUri: string, numberOfQuestions: number, difficulty: string) => void;
  isLoading: boolean;
  language: "english" | "hindi";
};

export default function QuizCamera({ onCapture, isLoading, language }: QuizCameraProps) {
  const t = translations[language];
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("Medium");
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
      onCapture(capturedImage, numberOfQuestions, difficulty);
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
        <Label htmlFor="questions-camera">{t.numQuestions}</Label>
        <Input 
          id="questions-camera" 
          type="number" 
          value={numberOfQuestions}
          onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
          min="1"
          disabled={isLoading}
          placeholder="e.g., 10" 
        />
      </div>

      <div className="space-y-2 text-left">
        <Label htmlFor="difficulty-camera">{t.difficulty}</Label>
        <Select value={difficulty} onValueChange={setDifficulty} disabled={isLoading}>
            <SelectTrigger id="difficulty-camera">
                <SelectValue placeholder={t.selectDifficulty} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Easy">{t.easy}</SelectItem>
                <SelectItem value="Medium">{t.medium}</SelectItem>
                <SelectItem value="Hard">{t.hard}</SelectItem>
            </SelectContent>
        </Select>
      </div>

      {capturedImage ? (
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={handleRetake} variant="outline" disabled={isLoading}>
            <RefreshCw className="mr-2" />
            {t.retake}
          </Button>
          <Button onClick={handleGenerateQuiz} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t.generating}...
              </>
            ) : (
              t.generateQuiz
            )}
          </Button>
        </div>
      ) : (
        <Button onClick={handleCapture} className="w-full" size="lg" disabled={isLoading}>
          <Camera className="mr-2" />
          {t.capturePhoto}
        </Button>
      )}
    </div>
  );
}

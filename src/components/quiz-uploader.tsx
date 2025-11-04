"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, ImageUp, Loader2, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuizCamera from "./quiz-camera";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type QuizUploaderProps = {
  onUpload: (dataUri: string, language: string) => void;
  isLoading: boolean;
};

export default function QuizUploader({ onUpload, isLoading }: QuizUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [language, setLanguage] = useState("english");
  const { toast } = useToast();

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e.target?.result as string;
      if (dataUri) {
        onUpload(dataUri, language);
      } else {
        toast({
          variant: "destructive",
          title: "File Read Error",
          description: "Could not read the selected file. Please try again.",
        });
      }
    };
    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "File Read Error",
        description: "An error occurred while reading the file.",
      });
    };
    reader.readAsDataURL(file);
    
    // Reset file input value to allow re-uploading the same file
    event.target.value = "";
  };

  return (
    <div className="space-y-6 text-center">
       <div>
        <h2 className="text-2xl font-bold">📤 Create Your Own Quiz</h2>
        <p className="text-muted-foreground mt-2">
          Choose how you want to create your quiz.
        </p>
      </div>
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">
            <FileUp className="mr-2" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="camera">
            <Camera className="mr-2" />
            Camera
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="pt-6">
          <div className="space-y-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="rounded-lg border bg-card p-4 space-y-2">
                <h3 className="font-semibold flex items-center gap-2"><FileUp className="h-5 w-5 text-primary" />Upload a File</h3>
                <p className="text-sm text-muted-foreground">
                  PDF, DOC, or TXT files. We'll automatically extract questions.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-4 space-y-2">
                <h3 className="font-semibold flex items-center gap-2"><ImageUp className="h-5 w-5 text-primary" />Upload an Image</h3>
                <p className="text-sm text-muted-foreground">
                  Photos or screenshots. Our AI will read the text and generate a quiz.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language-upload">Quiz Language</Label>
              <Select value={language} onValueChange={setLanguage} disabled={isLoading}>
                <SelectTrigger id="language-upload">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                  <SelectItem value="chinese">Chinese</SelectItem>
                  <SelectItem value="bengali">Bengali</SelectItem>
                  <SelectItem value="marathi">Marathi</SelectItem>
                  <SelectItem value="telugu">Telugu</SelectItem>
                  <SelectItem value="tamil">Tamil</SelectItem>
                  <SelectItem value="gujarati">Gujarati</SelectItem>
                  <SelectItem value="urdu">Urdu</SelectItem>
                  <SelectItem value="kannada">Kannada</SelectItem>
                  <SelectItem value="odia">Odia</SelectItem>
                  <SelectItem value="malayalam">Malayalam</SelectItem>
                  <SelectItem value="punjabi">Punjabi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                🧠 After uploading, you can review, edit, delete, or add your own questions.
              </p>
              <Button onClick={handleButtonClick} className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Select File or Photo'
                )}
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="camera" className="pt-6">
          <QuizCamera onCapture={onUpload} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

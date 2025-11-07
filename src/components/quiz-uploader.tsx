
"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, ImageUp, Loader2, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuizCamera from "./quiz-camera";
import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";
import { translations } from "@/lib/translations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { indianLanguages } from "@/lib/languages";

type QuizUploaderProps = {
  onUpload: (values: { dataUri: string; numberOfQuestions: number; language: string; difficulty: string; }) => void;
  isLoading: boolean;
  language: "english" | "hindi";
};

export default function QuizUploader({ onUpload, isLoading, language }: QuizUploaderProps) {
  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [quizLanguage, setQuizLanguage] = useState("English");
  const [difficulty, setDifficulty] = useState("Medium");
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
        onUpload({dataUri, numberOfQuestions, language: quizLanguage, difficulty});
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
  
  const handleCapture = (dataUri: string, numQuestions: number, captureDifficulty: string, captureLanguage: string) => {
    onUpload({ dataUri, numberOfQuestions: numQuestions, language: captureLanguage, difficulty: captureDifficulty });
  };


  return (
    <div className="space-y-6 text-center">
       <div>
        <h2 className="text-2xl font-bold">{t.createYourQuiz}</h2>
        <p className="text-muted-foreground mt-2">
          {t.chooseHow}
        </p>
      </div>
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">
            <FileUp className="mr-2" />
            {t.upload}
          </TabsTrigger>
          <TabsTrigger value="camera">
            <Camera className="mr-2" />
            {t.camera}
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
              disabled={isLoading}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="rounded-lg border bg-card p-4 space-y-2">
                <h3 className="font-semibold flex items-center gap-2"><FileUp className="h-5 w-5 text-primary" />{t.uploadFile}</h3>
                <p className="text-sm text-muted-foreground">
                  {t.uploadFileDesc}
                </p>
              </div>
              <div className="rounded-lg border bg-card p-4 space-y-2">
                <h3 className="font-semibold flex items-center gap-2"><ImageUp className="h-5 w-5 text-primary" />{t.uploadImage}</h3>
                <p className="text-sm text-muted-foreground">
                  {t.uploadImageDesc}
                </p>
              </div>
            </div>
            
            <div className="space-y-2 text-left">
              <Label htmlFor="questions-upload">{t.numQuestions}</Label>
              <Input
                id="questions-upload"
                type="number"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                min="1"
                disabled={isLoading}
                placeholder="e.g., 10"
              />
            </div>
            
            <div className="space-y-2 text-left">
              <Label htmlFor="language-upload">{t.quizLanguage}</Label>
              <Select value={quizLanguage} onValueChange={setQuizLanguage} disabled={isLoading}>
                <SelectTrigger id="language-upload">
                  <SelectValue placeholder={t.selectLanguage} />
                </SelectTrigger>
                <SelectContent>
                  {indianLanguages.map((lang) => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="difficulty-upload">{t.selectDifficulty}</Label>
              <Select value={difficulty} onValueChange={setDifficulty} disabled={isLoading}>
                <SelectTrigger id="difficulty-upload">
                  <SelectValue placeholder={t.selectDifficulty} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">{t.easy}</SelectItem>
                  <SelectItem value="Medium">{t.medium}</SelectItem>
                  <SelectItem value="Hard">{t.hard}</SelectItem>
                </SelectContent>
              </Select>
            </div>


            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {t.uploaderTip}
              </p>
              <Button onClick={handleButtonClick} className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t.generating}...
                  </>
                ) : (
                  t.selectFile
                )}
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="camera" className="pt-6">
          <QuizCamera 
            onCapture={handleCapture}
            isLoading={isLoading} 
            language={language} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

    


"use client";

import { Button } from "@/components/ui/button";
import { FileUp, ImageUp } from "lucide-react";

type QuizUploaderProps = {
  onUpload: (file: File) => void;
};

export default function QuizUploader({ onUpload }: QuizUploaderProps) {
  const handleFileSelect = () => {
    // This is a placeholder. A real implementation would open a file dialog.
    // For now, we'll just call the onUpload prop.
    onUpload(new File([], ""));
  };
  
  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="text-2xl font-bold">📤 Create Your Own Quiz</h2>
        <p className="text-muted-foreground mt-2">
          Choose how you want to create your quiz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
        <div className="rounded-lg border bg-card p-4 space-y-2">
            <h3 className="font-semibold flex items-center gap-2"><FileUp className="h-5 w-5 text-primary"/>Upload a File</h3>
            <p className="text-sm text-muted-foreground">
              PDF, DOC, or TXT files. We'll automatically extract questions.
            </p>
        </div>
        <div className="rounded-lg border bg-card p-4 space-y-2">
            <h3 className="font-semibold flex items-center gap-2"><ImageUp className="h-5 w-5 text-primary"/>Upload an Image</h3>
            <p className="text-sm text-muted-foreground">
              Photos or screenshots. Our AI will read the text and generate a quiz.
            </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          🧠 After uploading, you can review, edit, delete, or add your own questions.
        </p>
        <Button onClick={handleFileSelect} className="w-full" size="lg">
          Select File or Photo
        </Button>
      </div>

    </div>
  );
}

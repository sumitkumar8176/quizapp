"use client";

import { useState } from "react";
import type { Quiz } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, PartyPopper } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type QuizSessionProps = {
  quiz: Quiz;
  onFinish: (answers: string[]) => void;
};

export default function QuizSession({ quiz, onFinish }: QuizSessionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(new Array(quiz.length).fill(""));
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentQuestion = quiz[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.length - 1;

  const handleNext = () => {
    if (selectedOption === null) return;
    
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = selectedOption;
    
    if (isLastQuestion) {
      onFinish(newAnswers);
    } else {
      setUserAnswers(newAnswers);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    }
  };
  
  const progressValue = ((currentQuestionIndex) / quiz.length) * 100;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {quiz.length}</p>
        <Progress value={progressValue} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl leading-snug">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedOption ?? ""}
                onValueChange={setSelectedOption}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, index) => (
                  <Label
                    key={index}
                    htmlFor={`option-${index}`}
                    className="flex items-center space-x-3 rounded-md border p-4 cursor-pointer transition-colors hover:bg-accent/10 has-[[data-state=checked]]:bg-accent has-[[data-state=checked]]:text-accent-foreground has-[[data-state=checked]]:border-accent-foreground/50"
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <span>{option}</span>
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={selectedOption === null} size="lg">
          {isLastQuestion ? "Finish Quiz" : "Next Question"}
          {isLastQuestion ? <PartyPopper className="ml-2 h-5 w-5" /> : <ChevronRight className="ml-2 h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}

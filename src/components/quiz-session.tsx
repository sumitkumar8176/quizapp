"use client";

import { useState } from "react";
import type { Quiz } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, PartyPopper } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

type QuizSessionProps = {
  quiz: Quiz;
  onFinish: (answers: string[]) => void;
};

export default function QuizSession({ quiz, onFinish }: QuizSessionProps) {
  const [userAnswers, setUserAnswers] = useState<string[]>(new Array(quiz.length).fill(""));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleAnswerChange = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    onFinish(userAnswers);
  };

  const currentQuestion = quiz[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.length - 1;

  return (
    <div className="space-y-6">
       <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {quiz.length}</p>
        <Progress value={((currentQuestionIndex + 1) / quiz.length) * 100} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl leading-snug">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={userAnswers[currentQuestionIndex]}
                onValueChange={handleAnswerChange}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, optionIndex) => (
                  <Label
                    key={optionIndex}
                    htmlFor={`option-${currentQuestionIndex}-${optionIndex}`}
                    className="flex items-center space-x-3 rounded-md border p-4 cursor-pointer transition-colors hover:bg-accent/10 has-[[data-state=checked]]:bg-accent has-[[data-state=checked]]:text-accent-foreground has-[[data-state=checked]]:border-accent-foreground/50"
                  >
                    <RadioGroupItem value={option} id={`option-${currentQuestionIndex}-${optionIndex}`} />
                    <span>{option}</span>
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center pt-4">
        <Button onClick={handleSubmit} variant="outline">
          Submit Quiz
        </Button>
        
        <div className="flex items-center gap-2">
          <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0} variant="outline">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Previous
          </Button>

          {!isLastQuestion && (
            <Button onClick={handleNext} disabled={!userAnswers[currentQuestionIndex]}>
              Next
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}

          {isLastQuestion && (
             <Button onClick={handleSubmit}>
              Submit Quiz
              <PartyPopper className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

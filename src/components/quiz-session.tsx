
"use client";

import { useState } from "react";
import type { Quiz } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, PartyPopper, SkipForward } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { translations } from "@/lib/translations";


type QuizSessionProps = {
  quiz: Quiz;
  onFinish: (answers: string[]) => void;
  language: "english" | "hindi";
};

export default function QuizSession({ quiz, onFinish, language }: QuizSessionProps) {
  const t = translations[language];
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
  const unansweredQuestions = userAnswers.filter(answer => answer === "").length;

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <div className="space-y-2 w-full">
          <p className="text-sm text-muted-foreground">{t.questionLabel(currentQuestionIndex + 1)} of {quiz.length}</p>
          <Progress value={((currentQuestionIndex + 1) / quiz.length) * 100} />
        </div>
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

      <div className="flex flex-wrap justify-between items-center pt-4 gap-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="md:size-lg">
              <PartyPopper className="mr-2 h-5 w-5" />
              {t.submitQuiz}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t.areYouSure}</AlertDialogTitle>
              <AlertDialogDescription>
                {unansweredQuestions > 0 
                  ? t.unansweredQuestions(unansweredQuestions)
                  : t.allAnswered
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t.reviewAnswers}</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit}>{t.finishQuiz}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <div className="flex items-center gap-2">
          <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0} variant="outline">
            <ArrowLeft className="mr-2 h-5 w-5" />
            {t.previous}
          </Button>

          <Button onClick={handleNext} disabled={isLastQuestion} variant="outline">
            <SkipForward className="mr-2 h-5 w-5" />
            {t.skip}
          </Button>
          
          <Button onClick={handleNext} disabled={isLastQuestion}>
            {t.next}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

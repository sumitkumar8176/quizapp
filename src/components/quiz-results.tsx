"use client";

import type { Quiz } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, XCircle, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

type QuizResultsProps = {
  quiz: Quiz;
  userAnswers: string[];
  score: number;
  onPlayAgain: () => void;
};

export default function QuizResults({ quiz, userAnswers, score, onPlayAgain }: QuizResultsProps) {
  const totalQuestions = quiz.length;
  const scorePercentage = Math.round((score / totalQuestions) * 100);

  const getScoreMessage = () => {
    if (scorePercentage === 100) return "Perfect Score! You're a true QuizWhiz!";
    if (scorePercentage >= 80) return "Excellent work! You really know your stuff.";
    if (scorePercentage >= 50) return "Good job! A little more study and you'll be an expert.";
    return "Keep trying! Every quiz is a learning opportunity.";
  };

  return (
    <div className="space-y-8">
      <Card className="text-center border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg text-muted-foreground">Your Score</p>
          <div className="text-6xl font-bold text-primary">{score} / {totalQuestions}</div>
          <p className="text-xl font-semibold text-accent">{scorePercentage}%</p>
          <p className="text-muted-foreground">{getScoreMessage()}</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Review Your Answers</h3>
        <Accordion type="single" collapsible className="w-full">
          {quiz.map((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            return (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-left hover:no-underline">
                  <div className="flex items-center gap-3 flex-1">
                    {isCorrect ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-destructive" />}
                    <span className="flex-1">Question {index + 1}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <p className="font-semibold">{question.question}</p>
                  <ul className="space-y-2">
                    {question.options.map(option => {
                      const isUserAnswer = option === userAnswer;
                      const isCorrectAnswer = option === question.correctAnswer;
                      return (
                        <li key={option} className={cn(
                          "flex items-center gap-2 p-2 rounded-md text-sm border",
                          isCorrectAnswer && "bg-green-500/10 border-green-500/20 text-foreground",
                          isUserAnswer && !isCorrectAnswer && "bg-destructive/10 border-destructive/20 text-foreground",
                          !isUserAnswer && !isCorrectAnswer && "border-transparent"
                        )}>
                          {isCorrectAnswer ? <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" /> : 
                           (isUserAnswer ? <XCircle className="h-4 w-4 text-destructive flex-shrink-0" /> : <div className="w-4 h-4 flex-shrink-0"></div>)}
                          <span className="flex-1">{option}</span>
                          {isUserAnswer && !isCorrectAnswer && <span className="text-xs text-destructive/80 font-semibold">(Your answer)</span>}
                          {isCorrectAnswer && <span className="text-xs text-green-500/80 font-semibold">(Correct)</span>}
                        </li>
                      );
                    })}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      <Button onClick={onPlayAgain} className="w-full" size="lg">
        <RotateCw className="mr-2 h-5 w-5" />
        Play Again
      </Button>
    </div>
  );
}

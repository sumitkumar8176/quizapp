
"use client";

import type { Quiz } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, XCircle, RotateCw, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import QuizRating from "./quiz-rating";
import { useToast } from "@/hooks/use-toast";

type QuizResultsProps = {
  quiz: Quiz;
  userAnswers: string[];
  score: number;
  onPlayAgain: () => void;
};

export default function QuizResults({ quiz, userAnswers, score, onPlayAgain }: QuizResultsProps) {
  const totalQuestions = quiz.length;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Score Copied!",
        description: "Your quiz score and a link have been copied to the clipboard.",
      });
    } catch (err) {
      console.error('Failed to copy score:', err);
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Could not copy your score to the clipboard.",
      });
    }
  };

  const handleShare = async () => {
    const shareText = `🎉 Congratulations! You scored ${score}/${totalQuestions} in QuizWhiz!\nThink you can do better? 💪\nChallenge your friends and see who’s the real quiz master!`;
    const shareData = {
      title: 'My QuizWhiz Score!',
      text: shareText,
      url: window.location.href,
    };
    const clipboardText = `${shareData.text}\n\nTake the quiz here: ${shareData.url}`;

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // If sharing fails (e.g., user cancels), fall back to clipboard
        await copyToClipboard(clipboardText);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      await copyToClipboard(clipboardText);
    }
  };


  return (
    <div className="space-y-8">
      
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Quiz Complete!</CardTitle>
          <CardDescription>Here's how you did.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="relative mx-auto h-24 w-24">
                <svg className="h-full w-full" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-muted" strokeWidth="2"></circle>
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-primary" strokeWidth="2" strokeDasharray={`${percentage}, 100`} strokeLinecap="round" transform="rotate(-90 18 18)"></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-foreground">{percentage}%</span>
                </div>
            </div>
            <p className="text-lg font-medium text-foreground">You scored <span className="text-primary">{score}</span> out of {totalQuestions}</p>
        </CardContent>
      </Card>

      <QuizRating />

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
                    <span className="flex-1">Question {index + 1}: Scored {isCorrect ? 1 : 0}/{1}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
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
                  <div className="p-4 bg-muted/50 rounded-md space-y-3">
                    <h4 className="font-semibold text-accent">Explanation</h4>
                    <p className="text-sm text-muted-foreground">{question.explanation}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={onPlayAgain} className="w-full" size="lg">
          <RotateCw className="mr-2 h-5 w-5" />
          Play Again
        </Button>
        <Button onClick={handleShare} variant="outline" className="w-full" size="lg">
          <Share2 className="mr-2 h-5 w-5" />
           Share Score
        </Button>
      </div>

    </div>
  );
}

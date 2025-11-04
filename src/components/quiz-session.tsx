"use client";

import { useState } from "react";
import type { Quiz } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { PartyPopper } from "lucide-react";
import { motion } from "framer-motion";

type QuizSessionProps = {
  quiz: Quiz;
  onFinish: (answers: string[]) => void;
};

export default function QuizSession({ quiz, onFinish }: QuizSessionProps) {
  const [userAnswers, setUserAnswers] = useState<string[]>(new Array(quiz.length).fill(""));

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    onFinish(userAnswers);
  };

  const answeredQuestions = userAnswers.filter(answer => answer !== "").length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Quiz</h2>
          <p className="text-sm text-muted-foreground">{answeredQuestions} / {quiz.length} answered</p>
        </div>
        <Accordion type="multiple" className="w-full space-y-2">
          {quiz.map((question, index) => (
            <AccordionItem value={`item-${index}`} key={index} className="border-b-0 rounded-lg border bg-card/50">
              <AccordionTrigger className="p-4 text-left hover:no-underline [&[data-state=open]]:border-b">
                <div className="flex items-center gap-3 flex-1">
                  <span className="flex-1 font-semibold">Question {index + 1}</span>
                  {userAnswers[index] && <span className="text-xs font-semibold text-green-500">Answered</span>}
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-2">
                <div className="space-y-4">
                  <p className="font-medium">{question.question}</p>
                  <RadioGroup
                    value={userAnswers[index]}
                    onValueChange={(value) => handleAnswerChange(index, value)}
                    className="space-y-3"
                  >
                    {question.options.map((option, optionIndex) => (
                      <Label
                        key={optionIndex}
                        htmlFor={`option-${index}-${optionIndex}`}
                        className="flex items-center space-x-3 rounded-md border p-4 cursor-pointer transition-colors hover:bg-accent/10 has-[[data-state=checked]]:bg-accent has-[[data-state=checked]]:text-accent-foreground has-[[data-state=checked]]:border-accent-foreground/50"
                      >
                        <RadioGroupItem value={option} id={`option-${index}-${optionIndex}`} />
                        <span>{option}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSubmit} size="lg">
          Submit Quiz
          <PartyPopper className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

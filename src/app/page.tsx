"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Quiz } from "@/lib/types";
import { createQuiz } from "@/app/actions";
import QuizForm from "@/components/quiz-form";
import QuizSession from "@/components/quiz-session";
import QuizResults from "@/components/quiz-results";
import { Logo } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "@/app/loading";

type GameState = "idle" | "loading" | "playing" | "finished";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStartQuiz = async (values: { topic: string }) => {
    setIsLoading(true);
    setGameState("loading");
    setTopic(values.topic);

    const formData = new FormData();
    formData.append("topic", values.topic);

    const result = await createQuiz(formData);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error Generating Quiz",
        description: result.error,
      });
      setGameState("idle");
    } else if (result.data) {
      setQuiz(result.data);
      setUserAnswers(new Array(result.data.length).fill(""));
      setGameState("playing");
    }
    setIsLoading(false);
  };

  const handleFinishQuiz = (answers: string[]) => {
    if (!quiz) return;
    let correctAnswers = 0;
    quiz.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setUserAnswers(answers);
    setGameState("finished");
  };

  const handlePlayAgain = () => {
    setGameState("idle");
    setQuiz(null);
    setUserAnswers([]);
    setScore(0);
    setTopic("");
  };

  const renderGameState = () => {
    switch (gameState) {
      case "idle":
        return <QuizForm onSubmit={handleStartQuiz} isLoading={isLoading} />;
      case "loading":
        return <Loading />;
      case "playing":
        return quiz ? (
          <QuizSession quiz={quiz} onFinish={handleFinishQuiz} />
        ) : null;
      case "finished":
        return quiz ? (
          <QuizResults
            quiz={quiz}
            userAnswers={userAnswers}
            score={score}
            onPlayAgain={handlePlayAgain}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <header className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-3">
            <Logo className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary font-headline">
              QuizWhiz
            </h1>
          </div>
          <p className="max-w-md text-muted-foreground">
            Enter a topic and let our AI create a fun quiz for you. Test your knowledge and challenge yourself!
          </p>
        </header>
        <Card className="w-full shadow-lg overflow-hidden">
          <CardContent className="p-6 md:p-8 min-h-[250px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={gameState}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {renderGameState()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

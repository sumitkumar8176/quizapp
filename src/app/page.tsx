"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Quiz } from "@/lib/types";
import { createQuiz, createQuizFromContent } from "@/app/actions";
import QuizForm from "@/components/quiz-form";
import QuizSession from "@/components/quiz-session";
import QuizResults from "@/components/quiz-results";
import { Logo } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "@/app/loading";
import QuizUploader from "@/components/quiz-uploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type GameState = "idle" | "loading" | "playing" | "finished";
type QuizFormValues = { topic: string; numberOfQuestions: number };

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  const handleStartQuiz = async (values: QuizFormValues) => {
    setGameState("loading");

    const formData = new FormData();
    formData.append("topic", values.topic);
    formData.append("numberOfQuestions", values.numberOfQuestions.toString());

    const result = await createQuiz(formData);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error Generating Quiz",
        description: result.error,
      });
      setGameState("idle");
    } else if (result.data) {
      const newQuiz = result.data;
      setQuiz(newQuiz);
      setUserAnswers(new Array(newQuiz.length).fill(""));
      setGameState("playing");
    }
  };

  const handleUploadQuiz = async (dataUri: string) => {
    setGameState("loading");

    const formData = new FormData();
    formData.append("contentDataUri", dataUri);
    // For now, we'll hardcode the number of questions for uploads.
    // This could be a user input field in QuizUploader in the future.
    formData.append("numberOfQuestions", "10");

    const result = await createQuizFromContent(formData);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error Generating Quiz",
        description: result.error,
      });
      setGameState("idle");
    } else if (result.data) {
      const newQuiz = result.data;
      setQuiz(newQuiz);
      setUserAnswers(new Array(newQuiz.length).fill(""));
      setGameState("playing");
    }
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
  };
  
  const renderIdleState = () => (
    <Tabs defaultValue="topic" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="topic">From Topic</TabsTrigger>
        <TabsTrigger value="upload">From File/Image</TabsTrigger>
      </TabsList>
      <TabsContent value="topic" className="pt-6">
        <QuizForm onSubmit={handleStartQuiz} isLoading={gameState === 'loading'} />
      </TabsContent>
      <TabsContent value="upload" className="pt-6">
        <QuizUploader onUpload={handleUploadQuiz} isLoading={gameState === 'loading'} />
      </TabsContent>
    </Tabs>
  );

  const renderGameState = () => {
    switch (gameState) {
      case "loading":
        return <Loading />;
      case "idle":
        return renderIdleState();
      case "playing":
        return quiz ? (
          <QuizSession quiz={quiz} onFinish={handleFinishQuiz} />
        ) : renderIdleState();
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
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <header className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-3">
            <Logo className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary font-headline">
              QuizWhiz
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <p className="max-w-md text-muted-foreground">
              Enter a topic and let our AI create a fun quiz for you. Test your knowledge and challenge yourself!
            </p>
          </div>
        </header>
        <Card className="w-full shadow-lg overflow-hidden">
          <CardContent className="p-6 md:p-8 min-h-[350px] flex items-center justify-center">
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
      <footer className="absolute bottom-4 right-4 text-sm text-muted-foreground">
        -by sumit kumar
      </footer>
    </main>
  );
}

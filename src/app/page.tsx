"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Quiz } from "@/lib/types";
import { createQuiz, createQuizFromContent, createQuizFromPyq } from "@/app/actions";
import QuizForm from "@/components/quiz-form";
import QuizSession from "@/components/quiz-session";
import QuizResults from "@/components/quiz-results";
import { Logo } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "@/app/loading";
import QuizUploader from "@/components/quiz-uploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuizPayment from "@/components/quiz-payment";
import QuizPyqForm from "@/components/quiz-pyq-form";
import Sidebar from "@/components/sidebar";

type GameState = "idle" | "loading" | "payment" | "playing" | "finished";
type QuizFormValues = { topic: string; numberOfQuestions: number; language: string; timerDuration: number | null; };
type QuizPyqFormValues = { exam: string; subject: string; topic: string; numberOfQuestions: number; language: string; timerDuration: number | null; };

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timerDuration, setTimerDuration] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("topic");
  const [selectedExamFromSidebar, setSelectedExamFromSidebar] = useState<string | null>(null);
  const { toast } = useToast();

  const handleStartQuiz = async (values: QuizFormValues) => {
    setGameState("loading");

    const formData = new FormData();
    formData.append("topic", values.topic);
    formData.append("numberOfQuestions", values.numberOfQuestions.toString());
    formData.append("language", values.language);

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
      setTimerDuration(values.timerDuration);
      setGameState("payment");
    }
  };

  const handleStartPyqQuiz = async (values: QuizPyqFormValues) => {
    setGameState("loading");

    const formData = new FormData();
    formData.append("exam", values.exam);
    formData.append("subject", values.subject);
    formData.append("topic", values.topic);
    formData.append("numberOfQuestions", values.numberOfQuestions.toString());
    formData.append("language", values.language);

    const result = await createQuizFromPyq(formData);

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
      setTimerDuration(values.timerDuration);
      setGameState("payment");
    }
  };

  const handleUploadQuiz = async (dataUri: string, language: string, numberOfQuestions: number) => {
    setGameState("loading");

    const formData = new FormData();
    formData.append("contentDataUri", dataUri);
    formData.append("numberOfQuestions", numberOfQuestions.toString());
    formData.append("language", language);

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
      setTimerDuration(null); // No timer for uploaded quizzes for now
      setGameState("payment");
    }
  };

  const handlePaymentSuccess = () => {
    setGameState("playing");
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
    setTimerDuration(null);
    setSelectedExamFromSidebar(null);
    setActiveTab("topic");
  };

  const handleExamSelectFromSidebar = (exam: string) => {
    setSelectedExamFromSidebar(exam);
    setActiveTab("pyq");
  };
  
  const renderIdleState = () => (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="topic">From Topic</TabsTrigger>
        <TabsTrigger value="pyq">From PYQ</TabsTrigger>
        <TabsTrigger value="upload">From File/Image</TabsTrigger>
      </TabsList>
      <TabsContent value="topic" className="pt-6">
        <QuizForm onSubmit={handleStartQuiz} isLoading={gameState === 'loading'} />
      </TabsContent>
       <TabsContent value="pyq" className="pt-6">
        <QuizPyqForm 
          onSubmit={handleStartPyqQuiz} 
          isLoading={gameState === 'loading'}
          selectedExam={selectedExamFromSidebar}
        />
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
      case "payment":
        return <QuizPayment onPaymentSuccess={handlePaymentSuccess} />;
      case "playing":
        return quiz ? (
          <QuizSession quiz={quiz} onFinish={handleFinishQuiz} timerDuration={timerDuration} />
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
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar onExamSelect={handleExamSelectFromSidebar} />
      <main className="relative flex flex-1 flex-col items-center justify-center p-4">
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
    </div>
  );
}

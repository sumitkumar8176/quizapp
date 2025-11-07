
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
import QuizPyqForm from "@/components/quiz-pyq-form";
import Sidebar from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { translations } from "@/lib/translations";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

type GameState = "idle" | "loading" | "playing" | "finished";
type QuizFormValues = { topic: string; numberOfQuestions: number; language: string; };
type QuizPyqFormValues = { exam: string; subject: string; topic: string; numberOfQuestions: number; language: string; };
type QuizUploadValues = { dataUri: string, numberOfQuestions: number, language: string };

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [activeTab, setActiveTab] = useState("topic");
  const [selectedExamFromSidebar, setSelectedExamFromSidebar] = useState<string | null>(null);
  const [uiLanguage, setUiLanguage] = useState<"english" | "hindi">("english");
  const { toast } = useToast();

  const t = translations[uiLanguage];
  
  const handleStartQuiz = async (values: QuizFormValues) => {
    setGameState("loading");
    const formData = new FormData();
    formData.append("topic", values.topic);
    formData.append("numberOfQuestions", values.numberOfQuestions.toString());
    formData.append("language", values.language);
    const result = await createQuiz(formData);
    if (result.error) {
      toast({ variant: "destructive", title: t.errorGeneratingQuiz, description: result.error });
      setGameState("idle");
    } else if (result.data) {
      const newQuiz = result.data;
      setQuiz(newQuiz);
      setUserAnswers(new Array(newQuiz.length).fill(""));
      setGameState("playing");
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
      toast({ variant: "destructive", title: t.errorGeneratingQuiz, description: result.error });
      setGameState("idle");
    } else if (result.data) {
      const newQuiz = result.data;
      setQuiz(newQuiz);
      setUserAnswers(new Array(newQuiz.length).fill(""));
      setGameState("playing");
    }
  };

  const handleUploadQuiz = async (values: QuizUploadValues) => {
    setGameState("loading");
    const formData = new FormData();
    formData.append("contentDataUri", values.dataUri);
    formData.append("numberOfQuestions", values.numberOfQuestions.toString());
    formData.append("language", values.language);
    const result = await createQuizFromContent(formData);
    if (result.error) {
      toast({ variant: "destructive", title: t.errorGeneratingQuiz, description: result.error });
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
    setSelectedExamFromSidebar(null);
    setActiveTab("topic");
  };

  const handleExamSelectFromSidebar = (exam: string) => {
    setSelectedExamFromSidebar(exam);
    setActiveTab("pyq");
  };
  
  const handleLanguageSelect = (lang: "english" | "hindi") => {
    setUiLanguage(lang);
  };
  
  const renderIdleState = () => (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-12 bg-transparent rounded-lg p-1 gap-2">
          <TabsTrigger
            value="topic"
            className="bg-pink-200 text-pink-800 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-md rounded-md py-2"
          >
            {t.fromAnyTopics}
          </TabsTrigger>
          <TabsTrigger
            value="pyq"
            className="bg-blue-200 text-blue-800 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-md rounded-md py-2"
          >
            {t.previousYearQuestion}
          </TabsTrigger>
          <TabsTrigger
            value="upload"
            className="bg-orange-200 text-orange-800 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-md rounded-md py-2"
          >
            {t.fromFileImage}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="topic" className="pt-6">
          <QuizForm onSubmit={handleStartQuiz} isLoading={gameState === 'loading'} language={uiLanguage} />
        </TabsContent>
        <TabsContent value="pyq" className="pt-6">
          <QuizPyqForm 
            onSubmit={handleStartPyqQuiz} 
            isLoading={gameState === 'loading'}
            selectedExam={selectedExamFromSidebar}
            language={uiLanguage}
          />
        </TabsContent>
        <TabsContent value="upload" className="pt-6">
          <QuizUploader onUpload={handleUploadQuiz} isLoading={gameState === 'loading'} language={uiLanguage}/>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderGameState = () => {
    switch (gameState) {
      case "loading":
        return <Loading />;
      case "idle":
        return renderIdleState();
      case "playing":
        return quiz ? (
          <QuizSession quiz={quiz} onFinish={handleFinishQuiz} language={uiLanguage} />
        ) : renderIdleState();
      case "finished":
        return quiz ? (
          <QuizResults
            quiz={quiz}
            userAnswers={userAnswers}
            score={score}
            onPlayAgain={handlePlayAgain}
            language={uiLanguage}
          />
        ) : null;
      default:
        return null;
    }
  };

  if (showWelcome) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div>
            <div className="mb-4 flex items-center justify-center gap-3">
              <Logo className="h-12 w-12 text-primary" />
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary font-headline">
                QuizWhiz
              </h1>
            </div>
            <p className="text-2xl md:text-3xl font-semibold text-foreground">
              Welcome to my quiz app
            </p>
          </div>
          
          <div className="space-y-4">
            <Button size="lg" onClick={() => setShowWelcome(false)} className="w-full">
                Create your quiz here
            </Button>

            <div className="flex justify-center items-center gap-4">
                <div className="flex-grow border-t border-border"></div>
                <span className="text-muted-foreground text-sm">OR CHOOSE LANGUAGE</span>
                <div className="flex-grow border-t border-border"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button size="lg" variant="outline" onClick={() => handleLanguageSelect("english")}>
                    English
                </Button>
                <Button size="lg" variant="outline" onClick={() => handleLanguageSelect("hindi")}>
                    Hindi
                </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar onExamSelect={handleExamSelectFromSidebar} language={uiLanguage} />
        <main className="relative flex flex-1 flex-col items-center">
          <Navbar language={uiLanguage} />
          <div className="w-full p-2 bg-yellow-400">
            <div className="flex gap-2 items-center justify-center">
                <Button
                    onClick={() => handleLanguageSelect("english")}
                    size="sm"
                    className={cn(
                        "text-black bg-yellow-300 hover:bg-yellow-200",
                        uiLanguage === "english" && "bg-white hover:bg-white/90"
                    )}
                >
                    English
                </Button>
                <Button
                    onClick={() => handleLanguageSelect("hindi")}
                    size="sm"
                    className={cn(
                        "text-black bg-yellow-300 hover:bg-yellow-200",
                        uiLanguage === "hindi" && "bg-white hover:bg-white/90"
                    )}
                >
                    Hindi
                </Button>
            </div>
          </div>
          <div className="flex flex-1 flex-col items-center p-4 w-full">
            <div className="w-full max-w-2xl flex justify-between items-center mb-4 gap-2">
                <div className="md:hidden">
                    <SidebarTrigger />
                </div>
            </div>
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
                    {t.appDescription}
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
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

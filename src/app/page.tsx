"use client";

import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import QRCode from "react-qr-code";
import { Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";

type GameState = "idle" | "loading" | "playing" | "finished";
type QuizFormValues = { topic: string; numberOfQuestions: number };

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [shareableUrl, setShareableUrl] = useState("");

  const loadQuizFromHash = () => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash.substring(1);
    const urlParams = new URLSearchParams(hash);
    const quizData = urlParams.get('quiz');

    if (quizData) {
      try {
        const decompressed = decompressFromEncodedURIComponent(quizData);
        if (decompressed) {
          const parsedQuiz: Quiz = JSON.parse(decompressed);
          setQuiz(parsedQuiz);
          setUserAnswers(new Array(parsedQuiz.length).fill(""));
          setGameState("playing");
          const newUrl = `${window.location.origin}${window.location.pathname}#quiz=${quizData}`;
          setShareableUrl(newUrl);
        }
      } catch (error) {
        console.error("Failed to parse quiz data from URL hash", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load the shared quiz. It might be invalid.",
        });
        window.location.hash = '';
      }
    } else {
      setGameState("idle");
      setQuiz(null);
      setUserAnswers([]);
      setScore(0);
      setShareableUrl(`${window.location.origin}${window.location.pathname}`);
    }
    setIsLoading(false);
  };
  
  useEffect(() => {
    loadQuizFromHash();

    window.addEventListener('hashchange', loadQuizFromHash);
    return () => {
      window.removeEventListener('hashchange', loadQuizFromHash);
    };
  }, []);


  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareableUrl);
    toast({
      title: "Copied!",
      description: "The link has been copied to your clipboard.",
    });
  };

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
      const compressedQuiz = compressToEncodedURIComponent(JSON.stringify(newQuiz));
      // This will trigger the 'hashchange' event listener, which re-runs the logic
      // to load the quiz from the hash, ensuring a consistent state.
      window.location.hash = `quiz=${compressedQuiz}`;
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
    // Setting the hash to empty will trigger the hashchange listener, resetting the app state.
    window.location.hash = '';
  };

  const renderGameState = () => {
    if (isLoading) return <Loading />;
    switch (gameState) {
      case "idle":
        return <QuizForm onSubmit={handleStartQuiz} isLoading={gameState === 'loading'} />;
      case "loading":
        return <Loading />;
      case "playing":
        return quiz ? (
          <QuizSession quiz={quiz} onFinish={handleFinishQuiz} />
        ) : <Loading />; // Show loading if quiz is expected but not ready
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
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share Quiz</DialogTitle>
                  <DialogDescription>
                    Just click the shared link or scan the QR code, and your quiz will open instantly in your browser or app!
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center p-4 bg-white rounded-lg">
                  {shareableUrl && <QRCode value={shareableUrl} size={200} />}
                </div>
                <div className="flex items-center space-x-2">
                  <Input value={shareableUrl} readOnly />
                  <Button type="submit" size="sm" onClick={handleCopyUrl}>
                    <span className="sr-only">Copy</span>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
      <footer className="absolute bottom-4 right-4 text-sm text-muted-foreground">
        -by sumit kumar
      </footer>
    </main>
  );
}


"use client";

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { translations } from '@/lib/translations';

type QuizPaymentProps = {
  onPaymentSuccess: () => void;
  language: "english" | "hindi";
};

export default function QuizPayment({ onPaymentSuccess, language }: QuizPaymentProps) {
  const t = translations[language];
  const onPaymentSuccessRef = useRef(onPaymentSuccess);
  onPaymentSuccessRef.current = onPaymentSuccess;

  useEffect(() => {
    // Automatically proceed to the quiz after a short delay
    const timer = setTimeout(() => {
      onPaymentSuccessRef.current();
    }, 1500); 

    return () => clearTimeout(timer);
  }, []);


  const handleStart = () => {
    onPaymentSuccessRef.current();
  };
  
  return (
    <Card className="w-full max-w-md mx-auto text-center border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">
          {t.unlockQuiz}
        </CardTitle>
        <CardDescription>
          {t.quizStarting}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 min-h-[250px] flex items-center justify-center">
        <motion.div
          key="confirmation"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="flex flex-col items-center justify-center space-y-4 py-12"
        >
          <CheckCircle className="h-16 w-16 text-green-500" />
          <h3 className="text-2xl font-bold">{t.success}</h3>
          <p className="text-muted-foreground">{t.quizStarting}</p>
          <Button onClick={handleStart} className="mt-4">Start Now</Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}

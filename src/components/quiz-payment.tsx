"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type QuizPaymentProps = {
  onPaymentSuccess: () => void;
};

type PaymentStatus = 'pending' | 'confirmed';

const FREE_TRIAL_LIMIT = 2;

export default function QuizPayment({ onPaymentSuccess }: QuizPaymentProps) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [freeTrialsUsed, setFreeTrialsUsed] = useState(0);
  const onPaymentSuccessRef = useRef(onPaymentSuccess);
  onPaymentSuccessRef.current = onPaymentSuccess;

  useEffect(() => {
    const trials = parseInt(localStorage.getItem('freeTrialsUsed') || '0', 10);
    setFreeTrialsUsed(trials);
  }, []);

  const handleFreeTrial = () => {
    const newTrialCount = freeTrialsUsed + 1;
    localStorage.setItem('freeTrialsUsed', newTrialCount.toString());
    setFreeTrialsUsed(newTrialCount);
    setPaymentStatus('confirmed');
    setTimeout(() => {
      onPaymentSuccessRef.current();
    }, 1500);
  };

  const trialsLeft = FREE_TRIAL_LIMIT - freeTrialsUsed;
  const isTrialDisabled = trialsLeft <= 0;

  return (
    <Card className="w-full max-w-md mx-auto text-center border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">
          Unlock Your Quiz
        </CardTitle>
        <CardDescription>
         {isTrialDisabled 
            ? "You have used all your free trials."
            : `You have ${trialsLeft} free trial${trialsLeft !== 1 ? 's' : ''} remaining.`
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 min-h-[150px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {paymentStatus !== 'confirmed' ? (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 w-full"
            >
              <Button onClick={handleFreeTrial} size="lg" className="w-full" disabled={isTrialDisabled}>
                 Click here for free trial
              </Button>
              {isTrialDisabled && <p className="text-sm text-destructive">You have no free trials left.</p>}
            </motion.div>
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="flex flex-col items-center justify-center space-y-4 py-12"
            >
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h3 className="text-2xl font-bold">Confirmed!</h3>
              <p className="text-muted-foreground">Your quiz is starting now...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

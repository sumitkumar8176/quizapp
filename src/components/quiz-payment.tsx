
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import QRCode from '@/components/qr-code';

type QuizPaymentProps = {
  onPaymentSuccess: () => void;
};

type PaymentStatus = 'pending' | 'verifying' | 'confirmed';

const FREE_TRIAL_LIMIT = 2;
const UPI_ID = "your-upi-id@okhdfcbank";
const PAYMENT_AMOUNT = 2;

export default function QuizPayment({ onPaymentSuccess }: QuizPaymentProps) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [freeTrialsUsed, setFreeTrialsUsed] = useState(0);
  const onPaymentSuccessRef = useRef(onPaymentSuccess);
  onPaymentSuccessRef.current = onPaymentSuccess;

  const trialsLeft = FREE_TRIAL_LIMIT - freeTrialsUsed;
  const showPaymentSection = trialsLeft <= 0;

  useEffect(() => {
    // Load the number of trials used from local storage
    const trials = parseInt(localStorage.getItem('freeTrialsUsed') || '0', 10);
    setFreeTrialsUsed(trials);

    // If no free trials are left, immediately start the payment verification process.
    if (trials >= FREE_TRIAL_LIMIT) {
      setPaymentStatus('verifying');
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    // When status is 'verifying', simulate a 5-second payment check.
    if (paymentStatus === 'verifying') {
      timer = setTimeout(() => {
        setPaymentStatus('confirmed');
      }, 5000); 
    } 
    // When status is 'confirmed', wait 1.5s for the animation, then start the quiz.
    else if (paymentStatus === 'confirmed') {
      timer = setTimeout(() => {
        onPaymentSuccessRef.current();
      }, 1500);
    }
    // Cleanup the timer if the component unmounts or status changes.
    return () => clearTimeout(timer);
  }, [paymentStatus]);


  const handleFreeTrial = () => {
    const newTrialCount = freeTrialsUsed + 1;
    localStorage.setItem('freeTrialsUsed', newTrialCount.toString());
    setFreeTrialsUsed(newTrialCount);
    setPaymentStatus('confirmed');
  };
  
  const renderContent = () => {
    if (paymentStatus === 'confirmed') {
      return (
        <motion.div
          key="confirmation"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="flex flex-col items-center justify-center space-y-4 py-12"
        >
          <CheckCircle className="h-16 w-16 text-green-500" />
          <h3 className="text-2xl font-bold">Success!</h3>
          <p className="text-muted-foreground">Your quiz is starting now...</p>
        </motion.div>
      );
    }
    
    if (showPaymentSection) {
        return (
             <motion.div
                key="verifying"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 text-center w-full"
            >
                <div className="flex justify-center">
                    <QRCode upiId={UPI_ID} amount={PAYMENT_AMOUNT} />
                </div>
                <div>
                    <p className="font-semibold">UPI ID: {UPI_ID}</p>
                    <p className="text-muted-foreground text-sm">Pay ₹{PAYMENT_AMOUNT} to start the quiz.</p>
                </div>
                <div className="flex items-center justify-center space-y-4 pt-4">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <p className="text-muted-foreground">Waiting for payment confirmation...</p>
                </div>
            </motion.div>
        );
    }

    return (
       <motion.div
          key="free-trial"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 w-full"
        >
          <Button onClick={handleFreeTrial} size="lg" className="w-full">
            Click here for free trial
          </Button>
        </motion.div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto text-center border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">
          Unlock Your Quiz
        </CardTitle>
        <CardDescription>
         {showPaymentSection 
            ? "You have used all your free trials. Please pay to continue."
            : `You have ${trialsLeft} free trial${trialsLeft !== 1 ? 's' : ''} remaining.`
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 min-h-[250px] flex items-center justify-center">
        <AnimatePresence mode="wait">
            {renderContent()}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

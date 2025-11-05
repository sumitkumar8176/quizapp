"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import QRCode from 'qrcode';

type QuizPaymentProps = {
  onPaymentSuccess: () => void;
};

type PaymentStatus = 'pending' | 'verifying' | 'successful' | 'failed' | 'confirmed';

const UPI_ID = 'sumit.gusknp2022@okhdfcbank';
const PAYMENT_AMOUNT = '2';
const UPI_URL = `upi://pay?pa=${UPI_ID}&pn=Sumit%20Kumar&am=${PAYMENT_AMOUNT}&cu=INR`;
const FREE_TRIAL_LIMIT = 2;

export default function QuizPayment({ onPaymentSuccess }: QuizPaymentProps) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [freeTrialsUsed, setFreeTrialsUsed] = useState(0);
  const [isTrialDisabled, setIsTrialDisabled] = useState(false);
  const onPaymentSuccessRef = useRef(onPaymentSuccess);
  onPaymentSuccessRef.current = onPaymentSuccess;

  useEffect(() => {
    QRCode.toDataURL(UPI_URL, { width: 256, margin: 2 })
      .then(setQrCodeDataUrl)
      .catch(console.error);
    
    const trials = parseInt(localStorage.getItem('freeTrialsUsed') || '0', 10);
    setFreeTrialsUsed(trials);
    if (trials >= FREE_TRIAL_LIMIT) {
      setIsTrialDisabled(true);
      setPaymentStatus('verifying');
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (paymentStatus === 'verifying') {
      timer = setTimeout(() => {
        // Simulate a 70% chance of success
        if (Math.random() < 0.7) {
          setPaymentStatus('successful');
        } else {
          setPaymentStatus('failed');
        }
      }, 5000); // Simulate 5-second verification
    }
    return () => clearTimeout(timer);
  }, [paymentStatus]);

  const handleFreeTrial = () => {
    const newTrialCount = freeTrialsUsed + 1;
    localStorage.setItem('freeTrialsUsed', newTrialCount.toString());
    setFreeTrialsUsed(newTrialCount);
    if (newTrialCount >= FREE_TRIAL_LIMIT) {
      setIsTrialDisabled(true);
    }
    setPaymentStatus('confirmed');
    setTimeout(() => {
      onPaymentSuccess();
    }, 1500);
  };

  const handleConfirmPayment = () => {
    setPaymentStatus('confirmed');
    setTimeout(() => {
      onPaymentSuccessRef.current();
    }, 1500);
  }

  const handleTryAgain = () => {
    setPaymentStatus('verifying');
  }

  const trialsLeft = FREE_TRIAL_LIMIT - freeTrialsUsed;

  const renderPaymentState = () => {
    if (!isTrialDisabled) {
      return (
        <div className="space-y-4">
          <Button onClick={handleFreeTrial} size="lg" className="w-full">
             Use a free trial
          </Button>
          <p className="text-xs text-muted-foreground">{trialsLeft} free trial{trialsLeft !== 1 ? 's' : ''} left.</p>
        </div>
      );
    }

    return (
       <div className="space-y-4">
        <div className="flex justify-center items-center bg-white rounded-lg border p-2 w-64 h-64 mx-auto">
          {qrCodeDataUrl ? (
            <img src={qrCodeDataUrl} alt="UPI QR Code" className="w-full h-full" />
          ) : (
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          )}
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-sm text-muted-foreground">Pay to UPI ID:</p>
          <p className="font-mono text-lg tracking-wider bg-muted p-2 rounded-md">{UPI_ID}</p>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={paymentStatus}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="pt-4 space-y-3"
          >
            {paymentStatus === 'verifying' && (
              <div className="flex flex-col items-center justify-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Verifying payment...</p>
              </div>
            )}
            {paymentStatus === 'successful' && (
               <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle className="h-5 w-5" />
                    <p className="font-semibold">Payment Successful!</p>
                  </div>
                  <Button onClick={handleConfirmPayment} className="w-full" size="lg">Confirm Payment</Button>
              </div>
            )}
            {paymentStatus === 'failed' && (
              <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="flex items-center gap-2 text-destructive">
                    <XCircle className="h-5 w-5" />
                    <p className="font-semibold">Payment Failed</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Please try the payment again.</p>
                  <Button onClick={handleTryAgain} className="w-full" variant="destructive" size="lg">Try Again</Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto text-center border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">
          {isTrialDisabled ? `Pay ₹${PAYMENT_AMOUNT} to Start Your Quiz` : "Unlock Your Quiz"}
        </CardTitle>
        <CardDescription>
         {isTrialDisabled 
            ? (
              <ul className="space-y-1 text-sm text-muted-foreground text-left list-disc list-inside pt-2">
                <li>🔒 The quiz will not start until payment is completed.</li>
                <li>💳 After a successful payment, the "Confirm Payment" button will automatically become active.</li>
                <li>✅ Once you confirm the payment, the quiz will start immediately.</li>
                <li>❌ If the payment fails, a "Payment Failed" message will appear, and you’ll be asked to try the payment again.</li>
              </ul>
            )
            : `You have ${trialsLeft} free trial${trialsLeft !== 1 ? 's' : ''} remaining.`
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 min-h-[300px] flex items-center justify-center">
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
             {renderPaymentState()}
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

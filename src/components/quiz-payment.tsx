"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import QRCode from 'qrcode';

type QuizPaymentProps = {
  onPaymentSuccess: () => void;
};

const UPI_ID = 'sumit.gusknp2022@okhdfcbank';
const PAYMENT_AMOUNT = '5';
const UPI_URL = `upi://pay?pa=${UPI_ID}&pn=Sumit%20Kumar&am=${PAYMENT_AMOUNT}&cu=INR`;

export default function QuizPayment({ onPaymentSuccess }: QuizPaymentProps) {
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  useEffect(() => {
    QRCode.toDataURL(UPI_URL, { width: 256, margin: 2 })
      .then(url => {
        setQrCodeDataUrl(url);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);


  const handleConfirmation = () => {
    setPaymentConfirmed(true);
    setTimeout(() => {
      onPaymentSuccess();
    }, 1500); // Wait for animation
  };

  return (
    <Card className="w-full max-w-md mx-auto text-center border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Pay ₹{PAYMENT_AMOUNT} to Start Your Quiz</CardTitle>
        <CardDescription>
          Scan the QR code with any UPI app or pay directly to the UPI ID below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          {!paymentConfirmed ? (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
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

              <p className="text-xs text-muted-foreground">
                After completing the payment, click the button below to start your quiz.
              </p>

              <Button onClick={handleConfirmation} size="lg" className="w-full">
                I Have Paid
              </Button>
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
              <h3 className="text-2xl font-bold">Payment Confirmed!</h3>
              <p className="text-muted-foreground">Your quiz is starting now...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

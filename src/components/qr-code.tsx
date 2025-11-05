
"use client";

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

type QRCodeProps = {
  upiId: string;
  amount: number;
  name?: string;
};

export default function QRCodeComponent({ upiId, amount, name = 'QuizWhiz' }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, upiString, { width: 200 }, (error) => {
        if (error) console.error(error);
      });
    }
  }, [upiString]);

  return (
    <div className="p-4 bg-white rounded-lg inline-block">
        <canvas ref={canvasRef} />
    </div>
  );
}

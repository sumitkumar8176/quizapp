
"use client";

import { useState, useRef, useEffect } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { useAuth, useUser } from "@/firebase/provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type LoginDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onLoginSuccess?: () => void;
};

export default function LoginDialog({ isOpen, onOpenChange, onLoginSuccess }: LoginDialogProps) {
  const auth = useAuth();
  const { user } = useUser();
  const { toast } = useToast();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If the dialog is open and we have the container, initialize reCAPTCHA
    if (isOpen && auth && recaptchaContainerRef.current && !recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      });
      // Render it once it's created
      recaptchaVerifierRef.current.render();
    }
  }, [isOpen, auth]);

  useEffect(() => {
    // When the user successfully logs in, call the success callback
    if (user && isOpen) {
      onLoginSuccess?.();
    }
  }, [user, isOpen, onLoginSuccess]);
  
  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Successfully signed in with Google!" });
      // The useEffect hook will handle the success callback
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      toast({
        variant: "destructive",
        title: "Google Sign-In Failed",
        description: error.message,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handlePhoneSignIn = async () => {
    if (!auth || !recaptchaVerifierRef.current) return;
    setIsSendingOtp(true);
    try {
      const result = await signInWithPhoneNumber(auth, `+${phoneNumber}`, recaptchaVerifierRef.current);
      setConfirmationResult(result);
      toast({ title: "OTP Sent!", description: "Please check your phone for the verification code." });
    } catch (error: any) {
      console.error("Phone Sign-In Error:", error);
      toast({
        variant: "destructive",
        title: "Failed to Send OTP",
        description: error.message,
      });
      // Reset reCAPTCHA
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.render().then((widgetId) => {
            // @ts-ignore
            if (window.grecaptcha) {
              window.grecaptcha.reset(widgetId);
            }
        });
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) return;
    setIsVerifyingOtp(true);
    try {
      await confirmationResult.confirm(otp);
      toast({ title: "Successfully signed in with Phone!" });
      // The useEffect hook will handle the success callback
    } catch (error: any) {
      console.error("OTP Verification Error:", error);
      toast({
        variant: "destructive",
        title: "OTP Verification Failed",
        description: "The code you entered is invalid. Please try again.",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };
  
  const handleOpenChange = (open: boolean) => {
      if (!open) {
          // Reset state when dialog is closed
          setConfirmationResult(null);
          setPhoneNumber("");
          setOtp("");
      }
      onOpenChange(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <div ref={recaptchaContainerRef}></div>
        <DialogHeader>
          <DialogTitle>Login / Sign Up</DialogTitle>
          <DialogDescription>
            Choose your preferred method to create a quiz.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Button onClick={handleGoogleSignIn} className="w-full" variant="outline" disabled={isGoogleLoading || isSendingOtp || isVerifyingOtp}>
            {isGoogleLoading ? <Loader2 className="animate-spin" /> : "Sign in with Google"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {!confirmationResult ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone-dialog">Phone Number</Label>
                <Input
                  id="phone-dialog"
                  type="tel"
                  placeholder="e.g., 919876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isSendingOtp}
                />
              </div>
              <Button onClick={handlePhoneSignIn} className="w-full" disabled={isSendingOtp || !phoneNumber}>
                {isSendingOtp ? <Loader2 className="animate-spin" /> : "Send OTP"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp-dialog">Enter OTP</Label>
                <Input
                  id="otp-dialog"
                  type="text"
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={isVerifyingOtp}
                />
              </div>
              <Button onClick={handleVerifyOtp} className="w-full" disabled={isVerifyingOtp || !otp}>
                {isVerifyingOtp ? <Loader2 className="animate-spin" /> : "Verify OTP & Sign In"}
              </Button>
              <Button variant="link" size="sm" onClick={() => setConfirmationResult(null)}>
                Back to phone number entry
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

    
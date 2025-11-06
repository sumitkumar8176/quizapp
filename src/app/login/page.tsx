
"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/icons";

declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier;
    }
}

export default function LoginPage() {
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const { toast } = useToast();
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push(redirectUrl);
    }
  }, [user, router, redirectUrl]);


  const setupRecaptcha = () => {
    if (!auth) return;
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'normal',
      'callback': (response: any) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // ...
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
        // ...
      }
    });
  };

  const handlePhoneSignIn = async () => {
    if (!auth || !window.recaptchaVerifier) return;
    setIsSendingOtp(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, `+${phoneNumber}`, appVerifier);
      setConfirmationResult(result);
      toast({ title: "OTP Sent!", description: "Please check your phone for the verification code." });
    } catch (error: any) {
      console.error("Phone Sign-In Error:", error);
      toast({
        variant: "destructive",
        title: "Failed to Send OTP",
        description: error.message,
      });
      setupRecaptcha(); // Reset reCAPTCHA on error
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Successfully signed in with Google!" });
      router.push(redirectUrl);
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

  const handleVerifyOtp = async () => {
    if (!confirmationResult) return;
    setIsVerifyingOtp(true);
    try {
      await confirmationResult.confirm(otp);
      toast({ title: "Successfully signed in with Phone!" });
      router.push(redirectUrl);
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
       <header className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex items-center gap-3">
                <Logo className="h-12 w-12 text-primary" />
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary font-headline">
                QuizWhiz
                </h1>
            </div>
            <p className="max-w-md text-muted-foreground">
                Sign in to create and take AI-powered quizzes!
            </p>
        </header>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login / Sign Up</CardTitle>
          <CardDescription>
            Choose your preferred method to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGoogleSignIn} className="w-full" variant="outline" disabled={isGoogleLoading}>
            {isGoogleLoading ? <Loader2 className="animate-spin" /> : "Sign in with Google"}
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
            {!confirmationResult ? (
                 <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number (with country code)</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="e.g., 919876543210"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            disabled={isSendingOtp}
                        />
                    </div>
                    <div id="recaptcha-container" className="flex justify-center"></div>
                    <Button onClick={handlePhoneSignIn} className="w-full" disabled={isSendingOtp || !phoneNumber}>
                        {isSendingOtp ? <Loader2 className="animate-spin" /> : "Send OTP"}
                    </Button>
                 </div>
            ) : (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="otp">Enter OTP</Label>
                        <Input
                            id="otp"
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
        </CardContent>
      </Card>
    </main>
  );
}


"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
        confirmationResult?: ConfirmationResult;
    }
}

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
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
    // This is the key change. We only redirect AFTER the user object is confirmed by the hook.
    if (!isUserLoading && user) {
      router.push(redirectUrl);
    }
  }, [user, isUserLoading, router, redirectUrl]);

  const setupRecaptcha = () => {
    if (!auth) return;
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved.
        },
        'expired-callback': () => {
            toast({
                variant: "destructive",
                title: "reCAPTCHA Expired",
                description: "Please try sending the OTP again.",
            });
        }
      });
    } catch(e) {
      console.error("Error setting up reCAPTCHA", e);
      toast({
        variant: "destructive",
        title: "reCAPTCHA Setup Error",
        description: "Could not initialize reCAPTCHA. Please refresh the page.",
      });
    }
  };

  useEffect(() => {
    // Setup reCAPTCHA once the auth service is available.
    if (auth) {
      setupRecaptcha();
    }
  }, [auth]);


  const handlePhoneSignIn = async () => {
    if (!auth || !phoneNumber) {
        toast({
            variant: "destructive",
            title: "Phone number is missing",
        });
        return;
    }
    
    if (!window.recaptchaVerifier) {
      setupRecaptcha();
    }
    
    const appVerifier = window.recaptchaVerifier;
    if (!appVerifier) {
        toast({
            variant: "destructive",
            title: "reCAPTCHA Error",
            description: "Could not initialize app verifier. Please refresh and try again.",
        });
        return;
    }

    setIsSendingOtp(true);

    try {
      const fullPhoneNumber = `+91${phoneNumber}`;
      const result = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
      setConfirmationResult(result);
      window.confirmationResult = result;
      toast({ title: "OTP Sent!", description: `An OTP has been sent to ${fullPhoneNumber}` });
    } catch (error: any) {
      console.error("Phone Sign-In Error:", error);
      toast({
        variant: "destructive",
        title: "Failed to Send OTP",
        description: error.message || "Please make sure you have entered a valid 10-digit number.",
      });
      // Reset reCAPTCHA on error
      setupRecaptcha();
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      // The onAuthStateChanged listener (via useUser) will handle the redirect.
      await signInWithPopup(auth, provider);
      toast({ title: "Successfully signed in with Google!" });
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      if (error.code !== 'auth/popup-closed-by-user') {
        toast({
            variant: "destructive",
            title: "Google Sign-In Failed",
            description: error.message,
        });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult || !otp) return;
    setIsVerifyingOtp(true);
    try {
      // The onAuthStateChanged listener (via useUser) will handle the redirect.
      await confirmationResult.confirm(otp);
      toast({ title: "Successfully signed in with Phone!" });
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
  
  const resetPhoneAuth = () => {
    setConfirmationResult(null);
    setPhoneNumber("");
    setOtp("");
    setupRecaptcha();
  };

  if (isUserLoading || user) {
    // Show a loader while checking auth status or if user is already logged in (and redirect is imminent)
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
       <div id="recaptcha-container"></div>
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
          <Button onClick={handleGoogleSignIn} className="w-full" variant="outline" disabled={isGoogleLoading || isSendingOtp || isVerifyingOtp}>
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
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="flex items-center gap-2">
                           <span className="flex h-10 items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                            +91
                           </span>
                           <Input
                                id="phone"
                                type="tel"
                                placeholder="10-digit mobile number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                disabled={isSendingOtp}
                            />
                        </div>
                    </div>
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
                     <Button variant="link" size="sm" onClick={resetPhoneAuth}>
                        Back to phone number entry
                    </Button>
                </div>
            )}
        </CardContent>
      </Card>
    </main>
  );
}

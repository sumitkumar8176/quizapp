
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type Auth,
  type ConfirmationResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useAuth, useUser } from "@/firebase/provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push(redirectUrl);
    }
  }, [user, isUserLoading, router, redirectUrl]);

  // Effect to set up reCAPTCHA
  useEffect(() => {
    if (!auth || activeTab !== 'register') return;

    if (!window.recaptchaVerifier && recaptchaContainerRef.current) {
        const verifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
            'size': 'invisible',
            'callback': (response: any) => {
              // reCAPTCHA solved, allow signInWithPhoneNumber.
            }
        });
        window.recaptchaVerifier = verifier;
    }

    return () => {
        // Cleanup verifier
        window.recaptchaVerifier?.clear();
        window.recaptchaVerifier = undefined;
    };
  }, [auth, activeTab]);

  const handleSendOtp = async () => {
    if (!auth) return;
    if (password !== confirmPassword) {
      toast({ variant: "destructive", title: "Passwords do not match." });
      return;
    }
    setIsLoading(true);
    try {
      const verifier = window.recaptchaVerifier;
      if (!verifier) {
          throw new Error("RecaptchaVerifier not initialized.");
      }
      const phoneNumber = `+91${phone}`;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      window.confirmationResult = confirmationResult;
      setOtpSent(true);
      toast({ title: "OTP Sent!", description: "Please check your phone for the verification code." });
    } catch (error: any) {
      console.error("OTP Send Error:", error);
      toast({ variant: "destructive", title: "Failed to send OTP", description: error.message });
      // Reset reCAPTCHA
      window.recaptchaVerifier?.clear();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
      if (!window.confirmationResult) {
          toast({ variant: "destructive", title: "OTP not verified", description: "Please verify your phone number first." });
          return;
      }
      setIsLoading(true);
      try {
          // Confirm OTP
          const userCredential = await window.confirmationResult.confirm(otp);
          const user = userCredential.user;

          // Since phone auth doesn't have a password, we can't directly add one.
          // A more complex flow involving custom tokens or linking accounts would be needed.
          // For now, we will create a separate email/password user as a placeholder for the logic.
          // This is a limitation of client-side flows.
          // The "email" will be the phone number with a dummy domain.
          const email = `${user.phoneNumber}@quizwhiz.app`;
          
          // This part is tricky. After phone auth, we don't have a user object to just "add a password".
          // The most direct way on the client is to create an email/password user and consider the phone verified.
          // In a real-world app, you'd link credentials or use a backend.
          
          // Let's sign out the phone user and create an email/password user
          await auth.signOut();

          const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
          
          toast({ title: "Registration Successful!", description: "You can now log in." });
          setActiveTab("login"); // Switch to login tab
          setOtpSent(false); // Reset state
          // Clear fields
          setPhone("");
          setPassword("");
          setConfirmPassword("");
          setOtp("");

      } catch (error: any) {
          console.error("Registration Error:", error);
          toast({ variant: "destructive", title: "Registration Failed", description: error.message });
      } finally {
          setIsLoading(false);
      }
  };

  const handleLogin = async () => {
      if (!auth) return;
      setIsLoading(true);
      try {
        // We log in using the phone number as the "email" part of the credential
        const email = `+91${phone}@quizwhiz.app`;
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Sign-In Successful!" });
        // The useEffect will handle redirect
      } catch (error: any) {
        console.error("Login Error:", error);
        toast({ variant: "destructive", title: "Sign-In Failed", description: error.message });
      } finally {
        setIsLoading(false);
      }
  };
  
  if (isUserLoading || (!isUserLoading && user)) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

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
          Create an account or sign in to continue.
        </p>
      </header>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>
            Enter your credentials to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="phone-login">Phone Number</Label>
                <div className="flex items-center gap-2">
                    <span className="p-2 rounded-md border bg-muted">+91</span>
                    <Input id="phone-login" type="tel" placeholder="10-digit mobile number" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isLoading} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-login">Password</Label>
                <Input id="password-login" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
              </div>
              <Button onClick={handleLogin} className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Sign In"}
              </Button>
            </TabsContent>
            <TabsContent value="register" className="space-y-4 pt-4">
              {!otpSent ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone-register">Phone Number</Label>
                    <div className="flex items-center gap-2">
                        <span className="p-2 rounded-md border bg-muted">+91</span>
                        <Input id="phone-register" type="tel" placeholder="10-digit mobile number" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isLoading} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-register">Password</Label>
                    <Input id="password-register" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password-register">Confirm Password</Label>
                    <Input id="confirm-password-register" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} />
                  </div>
                  <Button onClick={handleSendOtp} className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : "Send OTP"}
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="otp-input">Enter OTP</Label>
                    <Input id="otp-input" type="text" placeholder="6-digit code" value={otp} onChange={(e) => setOtp(e.target.value)} disabled={isLoading} />
                  </div>
                  <Button onClick={handleRegister} className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : "Create Account"}
                  </Button>
                  <Button variant="link" onClick={() => setOtpSent(false)} disabled={isLoading}>
                    Back
                  </Button>
                </>
              )}
              <div ref={recaptchaContainerRef}></div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}

    
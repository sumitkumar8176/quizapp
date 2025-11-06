
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
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

  // A ref for the invisible reCAPTCHA container
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push(redirectUrl);
    }
  }, [user, isUserLoading, router, redirectUrl]);

  // Effect to set up reCAPTCHA
  useEffect(() => {
    if (!auth || activeTab !== 'register') return;

    if (!window.recaptchaVerifier) {
      // Ensure the container exists before creating the verifier
      if (recaptchaContainerRef.current) {
        const verifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
          'size': 'invisible',
          'callback': () => {
            // This callback is called when the reCAPTCHA is successfully solved.
            // The handleSendOtp function will proceed from here.
          }
        });
        window.recaptchaVerifier = verifier;
      }
    }
    
    // No cleanup needed in this setup, as the verifier is tied to the window object
    // and should persist for the login session.
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
          throw new Error("RecaptchaVerifier not initialized. Please wait a moment and try again.");
      }
      const phoneNumber = `+91${phone}`;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      window.confirmationResult = confirmationResult;
      setOtpSent(true);
      toast({ title: "OTP Sent!", description: "Please check your phone for the verification code." });
    } catch (error: any) {
      console.error("OTP Send Error:", error);
      toast({ variant: "destructive", title: "Failed to send OTP", description: error.message });
      // Reset reCAPTCHA if it exists
      window.recaptchaVerifier?.render().then((widgetId) => {
        // @ts-ignore
        grecaptcha.reset(widgetId);
      });
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
          // Confirm OTP to get the user credential from phone auth
          const phoneUserCredential = await window.confirmationResult.confirm(otp);
          const phoneUser = phoneUserCredential.user;

          // The challenge is that Firebase Auth doesn't let you add a password to a phone-only user on the client.
          // The standard approach is to create an email/password account and link the phone credential.
          // However, for a phone-centric login, we create a user with an "email" derived from the phone number.
          const email = `+91${phone}@quizwhiz.app`;

          // Sign out the temporary phone user to avoid conflicts
          await auth.signOut();
          
          // Create a new user with the derived email and the provided password.
          // This becomes the primary account.
          const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
          
          toast({ title: "Registration Successful!", description: "You can now log in with your phone number and password." });
          setActiveTab("login"); // Switch to login tab
          setOtpSent(false); // Reset OTP state
          // Clear fields for the next user
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
        // Log in using the same phone-derived email convention used during registration.
        const email = `+91${phone}@quizwhiz.app`;
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Sign-In Successful!" });
        // The useEffect at the top will handle the redirect.
      } catch (error: any) {
        console.error("Login Error:", error);
        toast({ variant: "destructive", title: "Sign-In Failed", description: "Incorrect phone number or password." });
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
      {/* Invisible reCAPTCHA container */}
      <div ref={recaptchaContainerRef}></div>

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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}


"use client";

import { useState, useEffect, useRef }from "react";
import { useRouter, useSearchParams }from "next/navigation";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useAuth, useUser }from "@/firebase/provider";
import { Button }from "@/components/ui/button";
import { Input }from "@/components/ui/input";
import { Label }from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription }from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger }from "@/components/ui/tabs";
import { useToast }from "@/hooks/use-toast";
import { Loader2 }from "lucide-react";
import { Logo }from "@/components/icons";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
    grecaptcha?: any;
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
  const [isRecaptchaSolved, setIsRecaptchaSolved] = useState(false);

  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaWidgetId = useRef<number | null>(null);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push(redirectUrl);
    }
  }, [user, isUserLoading, router, redirectUrl]);

  useEffect(() => {
    if (activeTab === 'register' && !otpSent && auth && recaptchaContainerRef.current) {
      if (window.recaptchaVerifier) {
        // If a verifier exists, ensure it's cleared before creating a new one
        try {
            window.recaptchaVerifier.clear();
            if(recaptchaWidgetId.current !== null) {
                window.grecaptcha.reset(recaptchaWidgetId.current);
            }
        } catch (e) {
            console.error("Error clearing old verifier", e);
        }
      }
      
      const verifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
        'size': 'normal',
        'callback': (response: any) => {
          setIsRecaptchaSolved(true);
        },
        'expired-callback': () => {
          setIsRecaptchaSolved(false);
        }
      });

      window.recaptchaVerifier = verifier;
      
      verifier.render().then((widgetId) => {
          recaptchaWidgetId.current = widgetId;
      });

      // Cleanup function to clear the verifier when the tab changes or component unmounts
      return () => {
        setIsRecaptchaSolved(false);
        if (window.recaptchaVerifier) {
            try {
                window.recaptchaVerifier.clear();
            } catch (e) {
                console.error("Error clearing verifier on cleanup", e);
            }
        }
      };
    }
  }, [auth, activeTab, otpSent]);


  const handleSendOtp = async () => {
    if (!auth || !window.recaptchaVerifier) {
      toast({ variant: "destructive", title: "reCAPTCHA not ready. Please wait." });
      return;
    }
    if (password !== confirmPassword) {
      toast({ variant: "destructive", title: "Passwords do not match." });
      return;
    }
    if (!isRecaptchaSolved) {
        toast({ variant: "destructive", title: "Please solve the reCAPTCHA." });
        return;
    }
    setIsLoading(true);
    try {
      const phoneNumber = `+91${phone}`;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      window.confirmationResult = confirmationResult;
      setOtpSent(true);
      toast({ title: "OTP Sent!", description: "Please check your phone for the verification code." });
    } catch (error: any) {
      console.error("OTP Send Error:", error);
      toast({ variant: "destructive", title: "Failed to send OTP", description: error.message });
      setIsRecaptchaSolved(false); // Require re-verification
      if (recaptchaWidgetId.current !== null && window.grecaptcha) {
        window.grecaptcha.reset(recaptchaWidgetId.current);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
      if (!window.confirmationResult) {
          toast({ variant: "destructive", title: "OTP not verified", description: "Please send an OTP first." });
          return;
      }
      setIsLoading(true);
      try {
          // CRITICAL: First, confirm the OTP. This is the main security check.
          await window.confirmationResult.confirm(otp);
          
          // If OTP is correct, proceed to create the account.
          // Create an email address from the phone number to use as a stable identifier
          const email = `+91${phone}@quizwhiz.app`;

          // Sign out the temporary phone user to allow creating a new account with email/password
          if (auth.currentUser) {
            await auth.signOut();
          }
          
          // Create the user with the generated email and the chosen password
          await createUserWithEmailAndPassword(auth, email, password);
          
          toast({ title: "Registration Successful!", description: "You can now log in with your phone number and password." });
          setActiveTab("login"); 
          setOtpSent(false); 
          setPhone("");
          setPassword("");
          setConfirmPassword("");
          setOtp("");
          setIsRecaptchaSolved(false);

      } catch (error: any) {
          console.error("Registration Error:", error);
          toast({ variant: "destructive", title: "Registration Failed", description: "The OTP may be incorrect or expired." });
      } finally {
          setIsLoading(false);
      }
  };

  const handleLogin = async () => {
      if (!auth) return;
      setIsLoading(true);
      try {
        // The email is derived from the phone number, matching the registration process
        const email = `+91${phone}@quizwhiz.app`;
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Sign-In Successful!" });
        // The useEffect will handle the redirect
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
                  <div ref={recaptchaContainerRef} className="flex justify-center my-4"></div>
                  <Button onClick={handleSendOtp} className="w-full" disabled={isLoading || !isRecaptchaSolved}>
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
                  <Button variant="link" onClick={() => {
                      setOtpSent(false); 
                      setIsRecaptchaSolved(false);
                    }} disabled={isLoading}>
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

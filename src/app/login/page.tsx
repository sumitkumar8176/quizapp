
"use client";

import { useState, useEffect }from "react";
import { useRouter, useSearchParams }from "next/navigation";
import {
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


export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const { toast } = useToast();
  
  // State for both forms
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Control flow state
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push(redirectUrl);
    }
  }, [user, isUserLoading, router, redirectUrl]);


  const handleRegister = async () => {
      if (registerPassword !== confirmPassword) {
        toast({ variant: "destructive", title: "Passwords do not match." });
        return;
      }
      if (!auth) return;

      setIsLoading(true);
      try {
          await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
          toast({ title: "Registration Successful!", description: "You can now log in with your email and password." });
          setActiveTab("login"); 
          setRegisterEmail("");
          setRegisterPassword("");
          setConfirmPassword("");

      } catch (error: any) {
          console.error("Registration Error:", error);
          let description = "An unexpected error occurred.";
          if (error.code === 'auth/email-already-in-use') {
            description = "This email address is already in use by another account.";
          } else if (error.code === 'auth/invalid-email') {
            description = "Please enter a valid email address.";
          } else if (error.code === 'auth/weak-password') {
            description = "The password is too weak. Please use at least 6 characters.";
          }
          toast({ variant: "destructive", title: "Registration Failed", description });
      } finally {
          setIsLoading(false);
      }
  };

  const handleLogin = async () => {
      if (!auth) return;
      setIsLoading(true);
      try {
        await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
        toast({ title: "Sign-In Successful!" });
        // The useEffect will handle the redirect
      } catch (error: any) {
        console.error("Login Error:", error);
        toast({ variant: "destructive", title: "Sign-In Failed", description: "Incorrect email or password." });
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
                <Label htmlFor="email-login">Email</Label>
                <Input id="email-login" type="email" placeholder="you@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-login">Password</Label>
                <Input id="password-login" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} disabled={isLoading} />
              </div>
              <Button onClick={handleLogin} className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Sign In"}
              </Button>
            </TabsContent>
            <TabsContent value="register" className="space-y-4 pt-4">
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email-register">Email</Label>
                    <Input id="email-register" type="email" placeholder="you@example.com" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-register">Password</Label>
                    <Input id="password-register" type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password-register">Confirm Password</Label>
                    <Input id="confirm-password-register" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} />
                  </div>
                  <Button onClick={handleRegister} className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : "Create Account"}
                  </Button>
                </>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}

"use client";
import { SignIn, useSignIn, useSignUp, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { clerkClient } from "@clerk/nextjs/server";
interface LoginResponse {
  status: string;
  message: string;
  data?: {
    id: string;
    role: string;
  };
}

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://8705-171-252-188-90.ngrok-free.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data: LoginResponse = await response.json();

      if (data.status === "success") {
        if (data.data?.role === "doctor")
          router.push(`/${data.data.id}/doctor/dashboard`);
        else if (data.data?.role === "receptionist")
          router.push(`/${data.data.id}/receptionist/dashboard`);
        else router.push("/");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during sign in. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-fit max-w-full ">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-blue-400">
          Đăng nhập vào Laman Clinic
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "hidden",
              card: "shadow-none p-0 border-none",
              cardBox: "shadow-none p-0 border-none",
              header: "hidden",
              formFieldInput: "hidden",
              formFieldLabel: "hidden",
              formField: "hidden",
              footer: "hidden",
              socialButtons: "p-2",
              main: "bg-transparent",
            },
          }}
        />
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Loading..." : "Continue"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

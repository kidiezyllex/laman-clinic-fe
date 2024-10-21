"use client";
import { SignIn } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cookies } from "next/headers";
import { getCookie } from "../../../../../actions/getCookie";
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
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data: LoginResponse = await response.json();

      // Lưu currentId (để navigate) và token (để đăng xuất)
      localStorage.setItem("currentId", (data as any)?.data?.id);
      localStorage.setItem("token", (data as any)?.token);
      localStorage.setItem("currentEmail", (data as any)?.data?.email);
      localStorage.setItem("role", (data as any)?.data?.role);
      const token = await getCookie("jwt");
      console.log(token);

      if (data.status === "success") {
        if (data.data?.role === "doctor") {
          toast({
            variant: "default",
            title: data.message,
            description: "Đăng nhập với quyền Bác sĩ",
          });
          router.push(`/${data.data.id}/doctor/dashboard`);
        } else if (data.data?.role === "receptionist") {
          toast({
            variant: "default",
            title: "Thành công!",
            description: data.message,
          });
          router.push(`/${data.data.id}/receptionist/dashboard`);
        } else if (data.data?.role === "pharmacist") {
          toast({
            variant: "default",
            title: "Thành công!",
            description: data.message,
          });
          router.push(`/${data.data.id}/pharmacist/dashboard`);
        } else router.push("/");
      } else {
        toast({
          variant: "destructive",
          title: "Thất bại!",
          description: data.message,
        });
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
    <Card className="w-fit max-w-full bg-white">
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
              socialButtonsBlockButton: "zIndex: 100",
            },
          }}
        />
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2 text-black">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="dark:bg-primary border border-slate-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2 text-black">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              className="dark:bg-primary border border-slate-200"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full border bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white"
            disabled={isLoading}
            variant={"default"}
          >
            {isLoading ? "Loading..." : "Continue"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

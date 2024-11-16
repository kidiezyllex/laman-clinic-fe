"use client";
import { SignIn } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useAuthContext } from "@/app/auth-context";
import { LoginResponse } from "../../../../../lib/entity-types";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { setToken } = useAuthContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const dummyToken =
        "dummy_token_" + Math.random().toString(36).substr(2, 9);
      setToken(dummyToken);
      localStorage.setItem("currentEmail", (data as any)?.data?.email);
      localStorage.setItem("role", (data as any)?.data?.role);

      if (data.status === "success") {
        if (data.data?.role === "doctor") {
          toast({
            variant: "default",
            title: "Thành công!",
            description: "Đăng nhập với quyền Bác sĩ.",
          });
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/?email=${
              (data as any)?.data?.email
            }`
          );
          router.push(`/${res.data._id}/doctor/dashboard`);
          localStorage.setItem("currentId", res.data._id);
        } else if (data.data?.role === "receptionist") {
          toast({
            variant: "default",
            title: "Thành công!",
            description: "Đăng nhập với quyền Lễ tân.",
          });
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/receptionists/?email=${
              (data as any)?.data?.email
            }`
          );
          router.push(`/${res.data._id}/receptionist/dashboard`);
          localStorage.setItem("currentId", res.data._id);
        } else if (data.data?.role === "pharmacist") {
          toast({
            variant: "default",
            title: "Thành công!",
            description: "Đăng nhập với quyền Dược sĩ.",
          });
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/pharmacists/?email=${
              (data as any)?.data?.email
            }`
          );
          console.log(res);
          router.push(`/${res.data._id}/pharmacist/dashboard`);
          localStorage.setItem("currentId", res.data._id);
        } else if (data.data?.role === "laboratory-technician") {
          toast({
            variant: "default",
            title: "Thành công!",
            description: "Đăng nhập với quyền Y tá xét nghiệm.",
          });
          const res = await axios.get(
            `${
              process.env.NEXT_PUBLIC_BACKEND_API_URL
            }/laboratory-technicians/?email=${(data as any)?.data?.email}`
          );
          router.push(`/${res.data._id}/laboratory-technician/dashboard`);
          localStorage.setItem("currentId", res.data._id);
        } else if (data.data?.role === "cashier") {
          toast({
            variant: "default",
            title: "Thành công!",
            description: "Đăng nhập với quyền Thu ngân.",
          });
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/cashiers/?email=${
              (data as any)?.data?.email
            }`
          );
          router.push(`/${res.data._id}/cashier/dashboard`);
          localStorage.setItem("currentId", res.data._id);
        } else if (data.data?.role === "admin") {
          toast({
            variant: "default",
            title: "Thành công!",
            description: "Đăng nhập với quyền Quản trị viên.",
          });
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admins/?email=${
              (data as any)?.data?.email
            }`
          );
          console.log(res);
          console.log(res.data._id);
          router.push(`/${res.data._id}/admin/dashboard`);
          localStorage.setItem("currentId", res.data._id);
        } else router.push("/");
      } else {
        toast({
          variant: "destructive",
          title: "Thất bại!",
          description: data.message,
        });
      }
    } catch (error) {
      console.error(error);
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
              placeholder="Nhập Email của bạn..."
              className="dark:bg-white border border-slate-200"
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
              className="dark:bg-white border border-slate-200"
              placeholder="Nhập mật khẩu của bạn..."
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

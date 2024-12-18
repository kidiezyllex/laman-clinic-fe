"use client";

import { SignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useAuthContext } from "@/app/auth-context";
import { Loader2, LogIn } from "lucide-react";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { setEmail2, setPassword2, setRole, setCurrentId } = useAuthContext();
  const { data: session } = useSession();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      setTrigger(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Thất bại!",
        description: error + "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const redirect = async () => {
      if (session?.user) {
        setEmail2((session?.user as any)?.email);
        setPassword2(password);
        setRole((session?.user as any)?.role);
        // Tìm hồ sơ = email
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/${
            (session?.user as any)?.role
          }s/?email=${(session?.user as any)?.email}`
        );
        if ((session?.user as any)?.role === "patient") {
          router.push("/");
        } else
          router.push(
            `/${res?.data?._id}/${(session?.user as any)?.role}/dashboard`
          );
        // Nếu có hồ sơ
        if (res?.data?._id) {
          setCurrentId(res?.data?._id);
        } else {
          setCurrentId(`user_${(session?.user as any)?.id}`);
        }

        toast({
          variant: "default",
          title: "Thành công!",
          description: `Đăng nhập với quyền ${(session?.user as any)?.role}!`,
        });
      }
    };
    redirect();
  }, [trigger]);

  return (
    <div className="max-w-fit bg-white sm:w-[500px] w-[340px] shadow-xl border rounded-xl p-4 py-8">
      <div className="text-2xl font-bold text-blue-500 text-center">
        Đăng nhập
      </div>
      <div className="flex flex-col items-center">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "hidden",
              cardBox: "w-[320px] sm:w-[400px] shadow-none p-0 border-none",
              card: "shadow-none p-0 border-none",
              header: "hidden",
              formFieldInput: "hidden",
              formFieldLabel: "hidden",
              formField: "hidden",
              footer: "hidden",
              socialButtons: "flex flex-row items-center p-2",
              socialButtonsBlockButton: "zIndex: 100 w-full self-center py-2",
            },
          }}
        />
        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
          <div className="space-y-2 text-black">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Nhập email của bạn..."
              className="dark:bg-white border border-slate-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2 text-black">
            <Label htmlFor="password">Mật khẩu</Label>
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
            className="w-full flex items-center self-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white text-white dark:bg-blue-500 dark:hover:bg-blue-600"
            disabled={isLoading}
            variant={"default"}
          >
            {isLoading ? (
              <>
                Đang đăng nhập
                <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                Đăng nhập
                <LogIn className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

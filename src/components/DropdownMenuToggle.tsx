"use client";
import { useAuthContext } from "@/app/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { Calendar, LogOut, Menu, User } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function UserMenu() {
  const { userId } = useAuth();
  const { setToken, currentId, setCurrentId } = useAuthContext();
  const { toast } = useToast();
  console.log(userId);
  useEffect(() => {
    // Nếu đăng nhập bằng GG thì userId sẽ có data, currentId cũng sẽ có data trong localStorage
    const setId = async () => {
      if (userId) {
        const response2 = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/clerk/${userId}`
        );
        if (response2?.data === null) {
          setCurrentId(userId);
        } else {
          setCurrentId(response2?.data?._id);
        }
      }
      setId();
    };
  }, [userId]);
  const handleLogOut = async () => {
    setToken(null);
    toast({
      variant: "default",
      title: "Thành công!",
      description: "Đăng xuất thành công",
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-2" align="end">
        <Link href={`/${currentId}/patient/profile`}>
          <DropdownMenuItem className="px-4 py-2 flex flex-row justify-between text-slate-600 dark:text-primary font-medium">
            <span>Đặt lịch khám</span>
            <Calendar className="h-4 w-4" />
          </DropdownMenuItem>
        </Link>
        <Link href={`/${currentId}/patient/dashboard`}>
          <DropdownMenuItem className="px-4 py-2 flex flex-row justify-between text-slate-600 dark:text-primary font-medium">
            <span>Quản lý tài khoản</span>
            <User className="h-4 w-4" />
          </DropdownMenuItem>
        </Link>
        <Link href="/">
          <DropdownMenuItem
            className="px-4 py-2 flex flex-row justify-between text-slate-600 dark:text-primary font-medium"
            onClick={() => handleLogOut()}
          >
            <span>Đăng xuất</span>
            <LogOut className="h-4 w-4" />
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
import { Calendar, CreditCard, LogOut, Menu, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function UserMenu() {
  const { userId } = useAuth();
  const [currentId, setCurrentId] = useState("");
  const { token, setToken } = useAuthContext();
  const { toast } = useToast();

  useEffect(() => {
    // Nếu đăng nhập bằng GG thì userId sẽ có data, currentId cũng sẽ có data trong localStorage
    if (userId) {
      const setId = async () => {
        const response2 = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/clerk/${userId}`
        );
        if (response2.data === "") {
          setCurrentId(userId);
        } else {
          setCurrentId(response2.data._id);
        }
      };
      setId();
    }
    // Còn nếu đăng nhập bằng tài khoản thì userId 0 có data, currentId vẫn sẽ có data trong localStorage
    else {
      const setId2 = async () => {
        const currentEmail = localStorage.getItem("currentEmail");
        const response2 = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/?email=${currentEmail}`
        );
        setCurrentId(response2.data._id || "");
      };
      setId2();
    }
  }, [userId]);

  const handleLogOut = async () => {
    setToken(null);
    toast({
      variant: "default",
      title: "Thành công!",
      description: "Đăng xuất thành công",
    });
    // router.push("/");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-2" align="end">
        <DropdownMenuItem className="px-4 py-2 flex flex-row justify-between">
          <Link href={`/${currentId}/patient/profile`}>
            <span>Đặt lịch khám</span>
          </Link>
          <Calendar className="mr-2 h-4 w-4" />
        </DropdownMenuItem>
        <DropdownMenuItem className="px-4 py-2 flex flex-row justify-between">
          <Link href={`/${currentId}/patient/dashboard`}>
            <span>Quản lý tài khoản</span>
          </Link>
          <User className="mr-2 h-4 w-4" />
        </DropdownMenuItem>
        <DropdownMenuItem className="px-4 py-2 flex flex-row justify-between" onClick={() => handleLogOut()}>
          <Link href="/">
            <span>Đăng xuất</span>
          </Link>
          <LogOut className="mr-2 h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { Calendar, CreditCard, Menu, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UserMenu() {
  const { userId } = useAuth();
  const [currentId, setCurrentId] = useState("");
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-2" align="end">
        <DropdownMenuItem className="px-4 py-2">
          <Calendar className="mr-2 h-4 w-4" />
          <Link href={`/${currentId}/patient/profile`}>
            <span>Đặt lịch khám</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="px-4 py-2">
          <User className="mr-2 h-4 w-4" />
          <Link href={`/${currentId}/patient/dashboard`}>
            <span>Quản lý tài khoản</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

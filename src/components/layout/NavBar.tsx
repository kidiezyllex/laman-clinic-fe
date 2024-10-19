"use client";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Calendar, HistoryIcon, LogOut, User, SquareUser } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "../ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import Link from "next/link";
import SplitText from "../animata/text/split-text";
import DropdownMenuToggle from "../DropdownMenuToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { getUserData } from "../../../actions/getUserData";
export default function NavBar() {
  const { toast } = useToast();
  const router = useRouter();
  const { userId } = useAuth();
  const [currentId, setCurrentId] = useState("");
  const [role, setRole] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    setCurrentId(localStorage.getItem("currentId") || "");
    setRole(localStorage.getItem("role") || "");
    setToken(localStorage.getItem("token") || "");
    console.log(
      localStorage.getItem("role"),
      localStorage.getItem("currentEmail")
    );
  }, []);

  const navLinks = [
    { href: "/", label: "TRANG CHỦ" },
    { href: "/quy-trinh", label: "QUY TRÌNH" },
    { href: "/huong-dan", label: "HƯỚNG DẪN" },
    { href: "/hoi-dap", label: "HỎI ĐÁP" },
    { href: "/lien-he", label: "LIÊN HỆ" },
  ];

  const handleLogOut = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/logout`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${res.status}`
        );
      }

      const data = await res.json();

      if (data.status === "success") {
        localStorage.removeItem("currentId");
        localStorage.removeItem("token");

        toast({
          variant: "default",
          title: "Thành công!",
          description: data.message,
        });

        router.push("/sign-in");
      } else {
        toast({
          variant: "destructive",
          title: "Thất bại!",
          description: data.message || "Đăng xuất không thành công",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Thất bại!",
        description: error + "",
      });
    }
  };
  const renderNavBar = () => {
    // Nếu có id của User login bằng GG/GH
    if (userId)
      return (
        <div className="flex flex-row gap-3 justify-end">
          <div className="flex items-center justify-center bg-slate-200 w-[40px] rounded-full">
            <UserButton afterSignOutUrl="/">
              <UserButton.MenuItems>
                <UserButton.Action
                  label="Cập nhật tài khoản"
                  labelIcon={<HistoryIcon className="h-4 w-4" />}
                  onClick={async () => {
                    const user = await getUserData(userId);
                    console.log(user);
                  }}
                />
              </UserButton.MenuItems>
            </UserButton>
          </div>

          {/* Dark Mode */}
          <ModeToggle></ModeToggle>
          <DropdownMenuToggle></DropdownMenuToggle>
        </div>
      );
    // Nếu có id của User login tài khoản của phòng khám (patient, doctor, receptionist)
    if (currentId)
      return (
        <div className="flex flex-row gap-3 justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-secondary"
              >
                <User className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2" align="end">
              <DropdownMenuItem className="px-4 py-2 flex flex-row justify-between ">
                <div onClick={() => handleLogOut()}>
                  <span>Đăng xuất</span>
                </div>
                <LogOut className="mr-2 h-4 w-4" />
              </DropdownMenuItem>
              <DropdownMenuItem className="px-4 py-2 flex flex-row justify-between ">
                <Link href={`/${userId}/patient/dashboard`}>
                  <span>Quản lý tài khoản</span>
                </Link>
                <SquareUser className="mr-2 h-4 w-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle></ModeToggle>
          {role === "patient" ? (
            <DropdownMenuToggle></DropdownMenuToggle>
          ) : null}
        </div>
      );
    return (
      <div className="flex flex-row gap-3 justify-end">
        <Link href={"/sign-up"}>
          <Button variant="outline">Đăng ký</Button>
        </Link>
        <Link href={"/sign-in"}>
          <Button className="border-2 border-secondary">Đăng nhập</Button>
        </Link>
        {/* Dark Mode */}
        <ModeToggle></ModeToggle>
      </div>
    );
  };
  return (
    <Card className="sticky top-0 border border-b-primary/10  dark:bg-slate-800 bg-white z-50 rounded-none">
      <div className="max-w-[1920px] w-full mx-auto xl:px-20 px-4 py-4 dark:bg-slate-800 bg-white">
        <div className="items-center justify-between flex flex-row gap-10">
          <Link
            className="flex flex-row items-center gap-3 justify-start"
            href={"/"}
            onClick={() => router.push("/")}
          >
            <Avatar className=" border-blue-500 border-4">
              <AvatarImage
                src={
                  "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726685609/learning-webdev-blog/clinic/medical-care-logo-icon-design-vector-22560842_j6xhlk.jpg"
                }
                alt="Laman Clinic"
              />
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm">PHÒNG KHÁM ĐA KHOA</p>
              <SplitText text="LAMAN Clinic" />
            </div>
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
          {renderNavBar()}
        </div>
      </div>
    </Card>
  );
}

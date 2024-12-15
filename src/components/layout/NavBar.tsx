"use client";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { LogOut, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "../ModeToggle";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import Link from "next/link";
import SplitText from "../animata/text/split-text";
import DropdownMenuToggle from "../DropdownMenuToggle";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/app/auth-context";
import { useSession } from "next-auth/react";
import axios from "axios";
export default function NavBar() {
  const { toast } = useToast();
  const router = useRouter();
  const { userId } = useAuth();
  const pathName = usePathname();
  const { token, setToken, role } = useAuthContext();
  const { data: session } = useSession();

  useEffect(() => {
    renderNavBar();
  }, [token]);

  const navLinks = [
    { href: "/", label: "TRANG CHỦ" },
    { href: "/process", label: "QUY TRÌNH" },
    { href: "/question", label: "HỎI ĐÁP" },
    { href: "/contact", label: "LIÊN HỆ" },
  ];

  const handleLogOut = async () => {
    // Nếu Bác sĩ đăng xuất thì cập nhật lại room và status Online
    if (pathName.split("/")[1].includes("BS")) {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/${
          pathName.split("/")[1]
        }/updateRoomNumber`,
        { isOnline: false, roomNumber: "000" }
      );
    }
    setToken(null);
    toast({
      variant: "default",
      title: "Thành công!",
      description: "Đăng xuất thành công",
    });
    router.push("/");
  };
  const renderNavBar = () => {
    // Nếu có id của User login bằng GG/GH
    if (userId)
      return (
        <div className="flex flex-row gap-3 justify-end">
          <div className="flex items-center justify-center bg-slate-200 w-[40px] rounded-full">
            <UserButton afterSignOutUrl="/"></UserButton>
          </div>
          {/* Dark Mode */}
          <ModeToggle></ModeToggle>
          <DropdownMenuToggle></DropdownMenuToggle>
        </div>
      );
    // Nếu có id của User login tài khoản của phòng khám (patient, doctor, receptionist)
    if (
      (session?.user as any)?.jti !== "" &&
      (session?.user as any)?.jti !== "undefined" &&
      (session?.user as any)?.jti !== null
    )
      return (
        <div>
          {role === "patient" ? (
            <div className="flex flex-row gap-3 justify-end">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-secondary dark:bg-background pointer-events-none border border-slate-200 dark:border-background"
              >
                <User className="h-[1.2rem] w-[1.2rem] text-slate-600 dark:text-primary" />
              </Button>
              <ModeToggle></ModeToggle>
              <DropdownMenuToggle></DropdownMenuToggle>
            </div>
          ) : (
            <div className="flex flex-row gap-3 justify-end">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleLogOut()}
              >
                <LogOut className="h-4 w-4" />
              </Button>
              <ModeToggle></ModeToggle>
            </div>
          )}
        </div>
      );
    return (
      <div className="flex flex-row gap-3 justify-end">
        <Link href={"/sign-up"}>
          <Button variant="outline">Đăng ký</Button>
        </Link>
        <Link href={"/sign-in"}>
          <Button className="w-fit flex items-center self-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white text-white dark:bg-blue-500 dark:hover:bg-blue-600 border-2 border-blue-400 dark:border-slate-800">
            Đăng nhập
          </Button>
        </Link>
        {/* Dark Mode */}
        <ModeToggle></ModeToggle>
      </div>
    );
  };
  return (
    <Card className="sticky top-0 border border-b-primary/10 dark:bg-slate-800 bg-white z-50 rounded-none">
      <div className="max-w-[1920px] w-full mx-auto xl:px-14 px-4 py-4 dark:bg-slate-800 bg-white">
        <div className="items-center justify-between flex flex-row pb-4 border-b sm:border-none sm:pb-0">
          <Link
            className="flex flex-row items-center gap-3 justify-start"
            href={pathName.split("/")[2] === "patient" ? "/" : "#"}
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
              <p className="md:block md:text-sm hidden md:font-semibold">
                PHÒNG KHÁM ĐA KHOA
              </p>
              <SplitText text="LAMAN Clinic" />
            </div>
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            {!pathName.split("-")[0].includes("LT") &&
              !pathName.split("-")[0].includes("BS") &&
              !pathName.split("-")[0].includes("DS") &&
              navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm hover:text-primary font-medium text-slate-600 dark:text-primary"
                >
                  {link.label}
                </Link>
              ))}
          </div>
          {renderNavBar()}
        </div>
        <p className="md:hidden block text-lg font-semibold text-center mt-4 text-slate-600 dark:text-slate-300">
          PHÒNG KHÁM ĐA KHOA <span className="text-blue-500">LAMAN</span>
        </p>
      </div>
    </Card>
  );
}

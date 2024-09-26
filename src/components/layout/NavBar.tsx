"use client";
import { useAuth, UserButton } from "@clerk/nextjs";
import Container from "../Container";
import { Button } from "../ui/button";
import { HistoryIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ModeToggle } from "../ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import Link from "next/link";
import SplitText from "../animata/text/split-text";
import DropdownMenuToggle from "../DropdownMenuToggle";
export default function NavBar() {
  const router = useRouter();
  const { userId } = useAuth();
  return (
    <Card className="sticky top-0 border border-b-primary/10  dark:bg-slate-800 bg-white z-50 rounded-none">
      <div className="max-w-[1920px] w-full mx-auto xl:px-20 px-4 py-4 dark:bg-slate-800 bg-white">
        <div className="items-center justify-between flex flex-row gap-10">
          {/* Logo */}
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
          {/* Search Field */}
          <div className="flex flex-row gap-4">
            <Link href="" className="text-sm">
              TRANG CHỦ
            </Link>
            <Link href="" className="text-sm">
              QUY TRÌNH
            </Link>
            <Link href="" className="text-sm">
              HƯỚNG DẪN
            </Link>
            <Link href="" className="text-sm">
              HỎI ĐÁP
            </Link>
            <Link href="" className="text-sm">
              LIÊN HỆ
            </Link>
          </div>

          {/* Sign in & Sign up & Avatar*/}
          {!userId ? (
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
          ) : (
            <div className="flex flex-row gap-3 justify-end">
              <div className="flex items-center justify-center bg-slate-200 w-[40px] rounded-full">
                <UserButton afterSignOutUrl="/">
                  <UserButton.MenuItems>
                    <UserButton.Action
                      label="Xem lịch sử khám"
                      labelIcon={<HistoryIcon className="h-4 w-4" />}
                      onClick={() => {
                        router.push(`/${userId}/patient/medical-history`);
                        router.refresh();
                      }}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </div>

              {/* Dark Mode */}
              <ModeToggle></ModeToggle>
              {/* <SheetToggle></SheetToggle> */}
              <DropdownMenuToggle></DropdownMenuToggle>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

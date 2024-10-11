"use client";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { HistoryIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "../ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import Link from "next/link";
import SplitText from "../animata/text/split-text";
import DropdownMenuToggle from "../DropdownMenuToggle";
export default function NavBar() {
  const router = useRouter();
  const { userId } = useAuth();
  const userId2 = usePathname().split("/");
  const navLinks = [
    { href: "/", label: "TRANG CHỦ" },
    { href: "/quy-trinh", label: "QUY TRÌNH" },
    { href: "/huong-dan", label: "HƯỚNG DẪN" },
    { href: "/hoi-dap", label: "HỎI ĐÁP" },
    { href: "/lien-he", label: "LIÊN HỆ" },
  ];
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

              {(userId && userId === "user_2mhwov955PdUhVgruqpERpKsFI3") ||
              userId === "user_2mQagC8cN1qekfGHPefv3QRKkYD" ? (
                ""
              ) : (
                <DropdownMenuToggle></DropdownMenuToggle>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

"use client";
import { useAuth, UserButton } from "@clerk/nextjs";
import Container from "../Container";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { ModeToggle } from "../ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SheetToggle } from "../SheetToggle";
import { Card } from "../ui/card";
import Link from "next/link";
import SplitText from "../animata/text/split-text";
export default function NavBar() {
  const router = useRouter();
  const { userId } = useAuth();
  console.log(userId);
  return (
    <Card className="sticky top-0 border border-b-primary/10  dark:bg-slate-800 bg-white z-50 rounded-none">
      <Container>
        <div className="items-stretch justify-between grid grid-cols-3 gap-10">
          {/* Logo */}
          <Link
            className="flex flex-row items-center gap-3 justify-start"
            href={"/"}
          >
            <Avatar className=" border-blue-500 border-4">
              <AvatarImage
                src={
                  "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726685609/learning-webdev-blog/clinic/medical-care-logo-icon-design-vector-22560842_j6xhlk.jpg"
                }
                alt="Laman Clinic"
              />
            </Avatar>
            <SplitText text="LAMAN Clinic" />
          </Link>
          {/* Search Field */}
          <div className="flex flex-row gap-2">
            <Input type="text" placeholder="Search" />

            <Button className="border-2 border-secondary">
              <Search className="h-4 w-4" />
            </Button>
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
                <UserButton afterSignOutUrl="/" />
              </div>

              {/* Dark Mode */}
              <ModeToggle></ModeToggle>
              <SheetToggle></SheetToggle>
            </div>
          )}
        </div>
      </Container>
    </Card>
  );
}

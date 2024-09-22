import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@clerk/nextjs";
import {
  Accessibility,
  FilePen,
  Hotel,
  HotelIcon,
  Menu,
  MessageSquareText,
  ShieldHalf,
  Stethoscope,
  Syringe,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SheetToggle() {
  const router = useRouter();
  const { userId } = useAuth();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Công cụ</SheetTitle>
        </SheetHeader>
        <Button
          className="w-full my-5 flex flex-row justify-start gap-3"
          variant="outline"
        >
          <Accessibility h-4 w-4 />
          Bệnh nhân Dashboard
        </Button>
        <Link href={`/${userId}/doctor/dashboard`}>
          <Button
            className="w-full my-5 flex flex-row justify-start gap-3"
            variant="outline"
          >
            <Syringe h-4 w-4 />
            Bác sĩ Dashboard
          </Button>
        </Link>
        <Link href={`/${userId}/receptionist/dashboard`}>
          <Button
            className="w-full my-5 flex flex-row justify-start gap-3"
            variant="outline"
          >
            <Stethoscope h-4 w-4 /> Tiếp tân Dashboard
          </Button>
        </Link>
        <Button
          className="w-full my-5 flex flex-row justify-start gap-3"
          variant="outline"
        >
          <ShieldHalf h-4 w-4 /> Admin Dashboard
        </Button>
      </SheetContent>
    </Sheet>
  );
}

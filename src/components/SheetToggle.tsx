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
  FilePen,
  Hotel,
  HotelIcon,
  Menu,
  MessageSquareText,
} from "lucide-react";
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
          onClick={() => {
            router.push(`/${userId}/hotel/list`);
          }}
        >
          <Hotel h-4 w-4 />
          Đặt lịch khám
        </Button>
        <Button
          className="w-full my-5 flex flex-row justify-start gap-3"
          variant="outline"
          onClick={() => {
            router.push(`/${userId}/hotel/0`);
          }}
        >
          <FilePen h-4 w-4 />
          Xem lịch khám/ buồng khám
        </Button>
        <Button
          className="w-full my-5 flex flex-row justify-start gap-3"
          variant="outline"
        >
          <FilePen h-4 w-4 /> Xem thông báo, thư
        </Button>
        <Button
          className="w-full my-5 flex flex-row justify-start gap-3"
          variant="outline"
        >
          <MessageSquareText h-4 w-4 />
          Xem lịch sử khám bệnh
        </Button>
        <SheetHeader>
          <SheetTitle>Tìm bác sĩ</SheetTitle>
        </SheetHeader>
        <Button
          className="w-full my-5 flex flex-row justify-start gap-3"
          variant="outline"
        >
          <MessageSquareText h-4 w-4 />
          Chuyên ngành
        </Button>
        <Button
          className="w-full my-5 flex flex-row justify-start gap-3"
          variant="outline"
        >
          <MessageSquareText h-4 w-4 />
          Các bệnh thường gặp
        </Button>
      </SheetContent>
    </Sheet>
  );
}

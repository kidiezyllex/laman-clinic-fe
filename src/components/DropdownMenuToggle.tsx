"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

export default function DropdownMenuToggle() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-2" align="end">
        <DropdownMenuItem className="px-4 py-2">
          ĐẶT LỊCH THEO BÁC SĨ
        </DropdownMenuItem>
        <DropdownMenuItem className="px-4 py-2">
          ĐẶT LỊCH THEO NGÀY
        </DropdownMenuItem>
        <DropdownMenuItem className="px-4 py-2">
          XEM LỊCH TÁI KHÁM
        </DropdownMenuItem>
        <DropdownMenuItem className="px-4 py-2">THANH TOÁN</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

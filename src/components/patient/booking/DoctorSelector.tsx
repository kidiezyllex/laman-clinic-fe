"use client";

import { useState, useCallback, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ArrowButton from "@/components/animata/button/arrow-button";
import axios from "axios";
import { doctorsData } from "../../../../lib/hardcoded-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Doctor } from "../../../../lib/entity-types";
export default function DoctorSelector({
  setActiveSection,
  setSelectedSpe,
  setSelectedDoctor,
}: {
  setActiveSection: (section: string) => void;
  setSelectedDoctor: (section: Doctor) => void;
  setSelectedSpe: (section: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const handleSelectDoctor = (item: any) => {
    setSelectedSpe(item?.specialization);
    setSelectedDoctor(item);
    setActiveSection("calendarSelector");
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <p className="text-base font-semibold text-blue-500 uppercase">
        Vui lòng chọn bác sĩ
      </p>

      <Input
        type="text"
        placeholder="Tìm kiếm chuyên khoa..."
        value={searchTerm}
        // onChange={handleSearch}
        className="w-full"
      />
      <ScrollArea className="h-[400px] w-full rounded-md border bg-background p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>STT</TableHead>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Giới tính</TableHead>
              <TableHead>Chuyên khoa</TableHead>
              <TableHead>Lịch khám</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctorsData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.fullName}</TableCell>
                <TableCell>
                  {item.gender?.toLowerCase() === "female" ? "Nữ" : "Nam"}
                </TableCell>
                <TableCell>{item.specialization}</TableCell>
                <TableCell>
                  <Button variant={"outline"}>Xem chi tiết</Button>
                </TableCell>
                <TableCell>
                  <Button
                    className="bg-blue-500 text-white hover:bg-blue-700"
                    onClick={() => handleSelectDoctor(item)}
                  >
                    Đặt khám
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}

"use client";

import { useState, useCallback, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Doctor } from "../../../../lib/entity-types";
import { renderSpecialty } from "../../../../lib/utils";
import { Calendar, Plus } from "lucide-react";
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
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const handleSelectDoctor = (item: any) => {
    setSelectedSpe(item?.specialization);
    setSelectedDoctor(item);
    setActiveSection("calendarSelector");
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const searchTermLower = searchTerm.toLowerCase();
    return doctor?.fullName?.toLowerCase().includes(searchTermLower);
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors`
      );
      setDoctors(response.data);
    };

    fetchDoctors();
  }, [searchTerm]);

  return (
    <div className="w-full">
      <p className="text-base font-semibold text-blue-500 uppercase mb-4">
        Vui lòng chọn bác sĩ
      </p>
      <Input
        type="text"
        placeholder="Nhập tên bác sĩ..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4"
      />
      {/* <div className="w-full border rounded-md p-2 sm:p-4 bg-primary-foreground overflow-x-auto"> */}

      <ScrollArea className="h-[400px] w-full rounded-md border bg-background sm:p-4">
        <Table>
          <TableHeader className="sticky">
            <TableRow>
              <TableHead className="text-blue-500 font-semibold sm:text-base">
                STT
              </TableHead>
              <TableHead className="text-blue-500 font-semibold text-xs sm:text-sm">
                Họ và tên
              </TableHead>
              <TableHead className="text-blue-500 font-semibold text-xs sm:text-sm">
                Giới tính
              </TableHead>
              <TableHead className="text-blue-500 font-semibold text-xs sm:text-sm">
                Chuyên khoa
              </TableHead>
              <TableHead className="text-blue-500 font-semibold text-xs sm:text-sm">
                Chọn
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDoctors.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                  {index + 1}
                </TableCell>
                <TableCell className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-semibold">
                  {item.fullName}
                </TableCell>
                <TableCell className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                  {item.gender?.toLowerCase() === "female" ? "Nữ" : "Nam"}
                </TableCell>
                <TableCell className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-semibold">
                  {renderSpecialty(item?.specialization + "")}
                </TableCell>

                <TableCell className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-semibold">
                  <Button
                    className="hidden sm:flex bg-blue-500 text-white dark:text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-700"
                    onClick={() => handleSelectDoctor(item)}
                  >
                    Đặt khám
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button
                    size={"icon"}
                    className="flex sm:hidden bg-blue-500 text-white dark:text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-700"
                    onClick={() => handleSelectDoctor(item)}
                  >
                    <Plus className="h-4 w-4" />
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

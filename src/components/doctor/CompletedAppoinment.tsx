"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import axios from "axios";
import { CompletedAppointment } from "../../../lib/entity-types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { formatDate } from "../../../lib/utils";

export default function CompletedAppointments() {
  const pathname = usePathname();
  const doctorId = pathname.split("/")[1];
  const [searchTerm, setSearchTerm] = useState("");
  const [completedAppointments, setCompletedAppointments] = useState<
    CompletedAppointment[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("all");
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/${doctorId}`
      );
      setCompletedAppointments(response.data.appointmentList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredAndSortedCA = completedAppointments
    .filter((ca) =>
      ca?.patientId?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (filterType === "new") {
        return (
          new Date(b.appointmentDate).getTime() -
          new Date(a.appointmentDate).getTime()
        );
      } else if (filterType === "old") {
        return (
          new Date(a.appointmentDate).getTime() -
          new Date(b.appointmentDate).getTime()
        );
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredAndSortedCA.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCA = filteredAndSortedCA.slice(startIndex, endIndex);

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%] overflow-auto">
      <p className="text-base font-semibold text-blue-500">
        DANH SÁCH CÁC CA KHÁM ĐÃ HOÀN THÀNH
      </p>
      <div className="flex flex-row gap-3">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Nhập mã bệnh nhân..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo ngày" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="new">Mới nhất</SelectItem>
            <SelectItem value="old">Cũ nhất</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="max-w-full border rounded-md p-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <Table className="overflow-scroll">
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Mã ca khám</TableHead>
                <TableHead>Mã bệnh nhân</TableHead>
                <TableHead>Ngày khám</TableHead>
                <TableHead>Lý do khám</TableHead>
                <TableHead>Bệnh nhân</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentCA.map((item, index) => (
                <TableRow key={`${item._id}-${index}`}>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell>{item._id}</TableCell>
                  <TableCell>{item.patientId}</TableCell>
                  <TableCell>
                    {formatDate(new Date(item.appointmentDate))}
                  </TableCell>
                  <TableCell>{item.reason}</TableCell>
                  <TableCell>
                    <Button variant={"outline"}>Xem chi tiết</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="ghost"
            >
              <PaginationPrevious />
            </Button>
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setCurrentPage(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              variant="ghost"
            >
              <PaginationNext />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

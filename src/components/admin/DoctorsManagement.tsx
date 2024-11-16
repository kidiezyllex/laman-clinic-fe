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
import { SearchIcon, UserRoundCog } from "lucide-react";
import axios from "axios";
import { Doctor } from "../../../lib/entity-types";
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
import { renderSpecialty } from "../../../lib/utils";
import { Badge } from "../ui/badge";
import DoctorDetails from "./accounts/DoctorDetails";
export default function DoctorsManagement() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRole, setFilterRole] = useState("all");
  const itemsPerPage = 10;
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors`
      );
      setDoctors(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = doctors.filter(
    (user) =>
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterRole === "all" || user.specialization === filterRole)
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);
  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%] overflow-auto">
      <p className="text-base font-semibold text-blue-500">DANH SÁCH BÁC SĨ</p>
      <div className="flex flex-row gap-3">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Nhập email hoặc mã bác sĩ..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[230px]">
            <SelectValue placeholder="Lọc theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Lọc theo chuyên ngành</SelectItem>
            <SelectItem value="InternalMedicine">Khoa Nội tổng quát</SelectItem>
            <SelectItem value="GeneralSurgery">Khoa Ngoại tổng quát</SelectItem>
            <SelectItem value="Pediatrics">Khoa Nhi</SelectItem>
            <SelectItem value="ObstetricsGynecology">Khoa Sản</SelectItem>
            <SelectItem value="Cardiology">Khoa Tim mạch</SelectItem>
            <SelectItem value="Neurology">Khoa Thần kinh</SelectItem>
            <SelectItem value="Pulmonology">Khoa Phổi</SelectItem>
            <SelectItem value="Dermatology">Khoa Da liễu</SelectItem>
            <SelectItem value="Gastroenterology">Khoa Tiêu hóa</SelectItem>
            <SelectItem value="NephrologyUrology">
              Khoa Thận - Tiết niệu
            </SelectItem>
            <SelectItem value="Hematology">Khoa Huyết học</SelectItem>
            <SelectItem value="Otolaryngology">Khoa Tai Mũi Họng</SelectItem>
            <SelectItem value="Ophthalmology">Khoa Mắt</SelectItem>
            <SelectItem value="OralMaxillofacialSurgery">
              Khoa Răng Hàm Mặt
            </SelectItem>
            <SelectItem value="PhysicalMedicineRehabilitation">
              Khoa Phục hồi chức năng
            </SelectItem>
            <SelectItem value="ClinicalPsychology">Khoa Tâm lý học</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Badge
        variant={"secondary"}
        className="w-fit flex flex-row gap-1 items-center self-end border border-blue-500"
      >
        <UserRoundCog className="h-4 w-4 text-blue-500"></UserRoundCog>

        <p className="text-sm text-blue-500">: Trưởng Khoa</p>
      </Badge>
      <div className="max-w-full border rounded-md p-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <Table className="overflow-scroll">
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Mã Bác sĩ</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>Giới tính</TableHead>
                <TableHead>Số ĐT</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Chuyên ngành</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((item, index) => (
                <TableRow
                  key={item._id}
                  className={item.isDepartmentHead ? "bg-secondary" : ""}
                  onClick={() => {
                    setSelectedDoctor(item);
                    setIsOpen(true);
                  }}
                >
                  <TableCell>
                    {item.isDepartmentHead ? (
                      <UserRoundCog className="h-5 w-5 text-blue-500"></UserRoundCog>
                    ) : (
                      startIndex + index + 1
                    )}
                  </TableCell>
                  <TableCell>{item._id}</TableCell>
                  <TableCell>{item.fullName}</TableCell>
                  <TableCell>
                    {item.gender &&
                      (item.gender.toLowerCase() === "male" ? "Nam" : "Nữ")}
                  </TableCell>
                  <TableCell>{item.phone}</TableCell>
                  <TableCell>
                    {(item?.email as string).length > 18
                      ? (item?.email as string).slice(0, 18) + "..."
                      : item?.email}
                  </TableCell>
                  <TableCell>
                    {renderSpecialty(item.specialization + "")}
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

      <DoctorDetails
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selectedDoctor={selectedDoctor}
      ></DoctorDetails>
    </div>
  );
}

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
import { User } from "../../../lib/entity-types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

export default function Component() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRole, setFilterRole] = useState("all");
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user`
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderRole = (role: string) => {
    const roles: { [key: string]: string } = {
      doctor: "Bác sĩ",
      receptionist: "Lễ tân",
      patient: "Bệnh nhân",
      cashier: "Thu ngân",
      pharmacist: "Dược sĩ",
      "laboratory-technician": "Y tá xét nghiệm",
      admin: "QTV",
    };
    return roles[role] || "Không xác định";
  };

  const filteredUsers = users.filter(
    (user) =>
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterRole === "all" || user.role === filterRole)
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%] overflow-auto">
      <p className="text-base font-semibold text-blue-500">
        DANH SÁCH TÀI KHOẢN NGƯỜI DÙNG
      </p>
      <div className="flex flex-row gap-3">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Nhập email người dùng..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="patient">Bệnh nhân</SelectItem>
            <SelectItem value="receptionist">Lễ tân</SelectItem>
            <SelectItem value="doctor">Bác sĩ</SelectItem>
            <SelectItem value="pharmacist">Dược sĩ</SelectItem>
            <SelectItem value="laboratory-technician">
              Y tá xét nghiệm
            </SelectItem>
            <SelectItem value="cashier">Thu ngân</SelectItem>
            <SelectItem value="admin">Quản trị viên</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="secondary">Thêm tài khoản</Button>
      </div>
      <div className="max-w-full border rounded-md p-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <Table className="overflow-scroll">
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>Giới tính</TableHead>
                <TableHead>Số ĐT</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((item, index) => (
                <TableRow key={item._id}>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell>{item.fullName}</TableCell>
                  <TableCell>
                    {item.gender &&
                      (item.gender.toLowerCase() === "male" ? "Nam" : "Nữ")}
                  </TableCell>
                  <TableCell>{item.phone}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{renderRole(item.role as string)}</TableCell>
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

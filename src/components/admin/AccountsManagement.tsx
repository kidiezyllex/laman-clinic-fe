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
import { ArrowUpFromLine, SearchIcon, X } from "lucide-react";
import axios from "axios";
import { User } from "../../../lib/entity-types";
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
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import PatientDetails from "./PatientDetails";
import StaffDetails from "./StaffDetails";
export default function AccountsManagement() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRole, setFilterRole] = useState("all");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedUserRole, setSelectedUserRole] = useState("");
  const itemsPerPage = 10;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    gender: "Male",
    role: "patient",
  });
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users`
      );
      setUsers(response.data);
    } catch (error) {
      console.error(error);
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

  const staff = (() => {
    switch (selectedUserRole) {
      case "receptionist":
        return "receptionists";
      case "laboratory-technician":
        return "laboratory-technicians";
      case "cashier":
        return "cashiers";
      case "doctor":
        return "doctors";
      case "admin":
        return "admins";
      default:
        return "";
    }
  })();

  const filteredUsers = users.filter(
    (user) =>
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterRole === "all" || user.role === filterRole)
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handleCreateUser = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user`,
        newUser
      );
      toast({
        variant: "default",
        title: "Thành công!",
        description: "Đã tạo 1 tài khoản!",
      });
      setUsers([...users, response.data]);
      setIsDialogOpen(false);
      setNewUser({
        fullName: "",
        phone: "",
        email: "",
        password: "",
        gender: "Male",
        role: "patient",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Thất bại!",
        description: "Đã xảy ra lỗi: " + error + "",
      });
      console.error(error);
    }
  };
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
        <Button variant="secondary" onClick={() => setIsDialogOpen(true)}>
          Thêm tài khoản
        </Button>
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
                <TableRow
                  key={item._id}
                  onClick={() => {
                    console.log(item.role);
                    console.log(item.email);
                    setSelectedUserEmail(item.email + "");
                    setSelectedUserRole(item.role + "");
                    setIsOpen(true);
                  }}
                  className="cursor-pointer"
                >
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[900px] w-[90%] h-fit overflow-y-auto flex flex-col justify-start gap-4">
          <DialogTitle className="text-md font-semibold self-center text-blue-500">
            THÊM TÀI KHOẢN
          </DialogTitle>
          <div className="flex flex-col gap-4 mx-4 h-full">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName">Họ tên</Label>
              <Input
                id="fullName"
                value={newUser.fullName}
                onChange={(e) =>
                  setNewUser({ ...newUser, fullName: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone">Số ĐT</Label>
              <Input
                id="phone"
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser({ ...newUser, phone: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Giới tính</Label>
              <RadioGroup
                defaultValue="Male"
                onValueChange={(value) =>
                  setNewUser({ ...newUser, gender: value })
                }
                className="col-span-3 flex"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Male" id="Male" />
                  <Label htmlFor="Male">Nam</Label>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <RadioGroupItem value="Female" id="Female" />
                  <Label htmlFor="Female">Nữ</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role">Vai trò</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) =>
                  setNewUser({ ...newUser, role: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
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
            </div>
            <div className="flex justify-end items-end self-end gap-2 flex-grow h-full mt-4">
              <Button
                variant="destructive"
                onClick={() => {
                  setIsDialogOpen(false);
                  setNewUser({
                    fullName: "",
                    phone: "",
                    email: "",
                    password: "",
                    gender: "male",
                    role: "patient",
                  });
                }}
              >
                Huỷ
                <X className="w-4 h-4" />
              </Button>
              <Button
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                onClick={handleCreateUser}
              >
                Tạo
                <ArrowUpFromLine className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {selectedUserRole.includes("patient") ? (
        <PatientDetails
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          selectedUserEmail={selectedUserEmail}
        ></PatientDetails>
      ) : (
        <StaffDetails
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          routes={`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/${staff}/?email=${selectedUserEmail}`}
        ></StaffDetails>
      )}
    </div>
  );
}

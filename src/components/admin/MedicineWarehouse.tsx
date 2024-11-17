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
import {
  ArrowUpFromLine,
  CirclePlus,
  Edit2,
  Hospital,
  Mail,
  MapPin,
  PhoneIcon,
  TrendingDown,
  SearchIcon,
  Trash,
  X,
  RotateCcw,
} from "lucide-react";
import axios from "axios";
import { Medication, TestType } from "../../../lib/entity-types";
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
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "../../../lib/utils";
import MedicationFluctuations from "./medicine-warehouse/MedicationFluctuations";

export default function MedicineWarehouse() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOpenMF, setIsOpenMF] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [editingId, setEditingId] = useState<String | null>("");
  const [editedTest, setEditedTest] = useState<TestType | null>(null);
  const [newTest, setNewTest] = useState<TestType>({
    _id: "",
    testName: "",
    description: "",
    price: 0,
  });
  const [filterValue, setFilterValue] = useState("all");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/medications`
      );
      setMedications(response.data);
    } catch (error) {
      toast({
        title: "Thất bại!",
        description: error + "",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredMedications = medications
    .filter((item) =>
      item?.medicationName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (filterValue === "farthest") {
        return (
          new Date(b.expirationDate).getTime() -
          new Date(a.expirationDate).getTime()
        );
      } else if (filterValue === "nearest") {
        return (
          new Date(a.expirationDate).getTime() -
          new Date(b.expirationDate).getTime()
        );
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredMedications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMedications = filteredMedications.slice(startIndex, endIndex);

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%] overflow-auto">
      <p className="text-base font-semibold text-blue-500">KHO THUỐC</p>
      <div className="flex flex-col  gap-3 border rounded-md p-4">
        <div className="flex items-center space-x-3">
          <Hospital className="text-blue-500 h-4 w-4" />
          <span className="text-sm font-semibold">Kho thuốc số 1</span>
        </div>
        <div className="flex items-center space-x-3">
          <MapPin className="text-blue-500 h-4 w-4" />
          <p className="text-sm font-semibold">
            Địa chỉ:{" "}
            <span className="font-normal">
              20/12, Phạm Huy Thông, Phường 6, Gò Vấp, T.P Hồ Chí Minh
            </span>
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Mail className="text-blue-500 h-4 w-4" />
          <p className="font-semibold text-sm">
            Email:{" "}
            <span className="font-normal">buitranthienan1111@gmail.com</span>
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <PhoneIcon className="text-blue-500 h-4 w-4" />
          <span className="font-semibold text-sm">Số ĐT: 0336735283</span>
        </div>
      </div>
      <div className="flex flex-row gap-3">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Nhập tên thuốc..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterValue} onValueChange={setFilterValue}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="nearest">HSD gần nhất</SelectItem>
            <SelectItem value="farthest">HSD xa nhất</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={() => setIsOpenMF(true)}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Biến động
          <TrendingDown className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Thêm thuốc
          <CirclePlus className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={fetchData}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Tên thuốc</TableHead>
            <TableHead>SL nhập</TableHead>
            <TableHead>SL tồn</TableHead>
            <TableHead>Liều lượng</TableHead>
            <TableHead>Giá</TableHead>
            <TableHead>Hướng dẫn sử dụng</TableHead>
            <TableHead>Ngày hết hạn</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentMedications.map((medication, index) => (
            <TableRow key={medication._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{medication.medicationName}</TableCell>
              <TableCell>{medication.quantityImported}</TableCell>
              <TableCell>{medication.quantityRemaining}</TableCell>
              <TableCell>{medication.dosage}</TableCell>
              <TableCell>{medication.price}</TableCell>
              <TableCell>{medication.instructions}</TableCell>
              <TableCell>{formatDate(medication.expirationDate)}</TableCell>
              <TableCell className="flex flex-row gap-2">
                <Button
                  variant="secondary"
                  className="border border-slate-300 dark:border-none"
                >
                  Sửa
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="destructive">
                  Xoá
                  <Trash className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
          <DialogTitle className="text-md font-semibold self-center text-blue-500 mb-4">
            THÊM THUỐC MỚI
          </DialogTitle>
          <div className="flex flex-col gap-4">
            <p className="text-sm">Tên xét nghiệm:</p>
            <Input
              name="testName"
              placeholder="Tên xét nghiệm"
              value={newTest.testName}
            />
            <p className="text-sm">Mô tả xét nghiệm:</p>
            <Textarea
              name="description"
              placeholder="Mô tả"
              value={newTest.description}
              // onChange={handleNewTestChange}
            />
            <p className="text-sm">Giá:</p>

            <Input
              name="price"
              type="number"
              placeholder="Giá (VND)"
              value={newTest.price}
              // onChange={handleNewTestChange}
            />
            <div className={"flex flex-row justify-end gap-4 items-end"}>
              <Button
                variant="destructive"
                onClick={() => setIsDialogOpen(false)}
              >
                Huỷ
                <X className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                // onClick={handleCreateTest}
              >
                Tạo
                <ArrowUpFromLine className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <MedicationFluctuations
        isOpenMF={isOpenMF}
        setIsOpenMF={setIsOpenMF}
      ></MedicationFluctuations>
    </div>
  );
}

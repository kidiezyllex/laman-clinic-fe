"use client";

import { useState } from "react";
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
  ArrowUpFromLine,
  CirclePlus,
  Edit2,
  Save,
  SearchIcon,
  Trash,
  X,
} from "lucide-react";
import { TestType } from "../../../lib/entity-types";
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
import { usePathname } from "next/navigation";
import { 
  useGetTestTypes, 
  useCreateTestType, 
  useUpdateTestType, 
  useDeleteTestType 
} from "@/hooks/useTestType";

export default function TestTypesManagement() {
  const { toast } = useToast();
  const userId = usePathname().split("/")[1];
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<String | null>("");
  const [editedTest, setEditedTest] = useState<TestType | null>(null);
  const [newTest, setNewTest] = useState({
    name: "",
    description: "",
    price: 0,
  });

  // Use hooks for data fetching
  const { data: testTypesData, isLoading, error } = useGetTestTypes();
  const createTestTypeMutation = useCreateTestType();
  const updateTestTypeMutation = useUpdateTestType();
  const deleteTestTypeMutation = useDeleteTestType();
  
  const tests = testTypesData?.data || [];

  const handleEdit = (test: TestType) => {
    setEditingId(test._id);
    setEditedTest({ ...test });
  };

  const handleSave = async () => {
    if (editedTest) {
      try {
        await updateTestTypeMutation.mutateAsync({
          id: editedTest._id,
          data: editedTest
        });
        setEditingId(null);
        setEditedTest(null);
        toast({
          title: "Thành công!",
          description: "Đã cập nhật xét nghiệm!",
        });
      } catch (error) {
        toast({
          title: "Thất bại!",
          description: error + "",
          variant: "destructive",
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedTest) {
      const { name, value } = e.target;
      setEditedTest({
        ...editedTest,
        [name]: name === "price" ? parseInt(value) || 0 : value,
      });
    }
  };

  const handleNewTestChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTest({
      ...newTest,
      [name]: name === "price" ? parseInt(value) || 0 : value,
    });
  };

  const handleCreateTest = async () => {
    try {
      await createTestTypeMutation.mutateAsync(newTest);
      setIsDialogOpen(false);
      setNewTest({
        name: "",
        description: "",
        price: 0,
      });
      toast({
        title: "Thành công!",
        description: "Đã thêm 1 loại xét nghiệm mới!",
      });
    } catch (error) {
      toast({
        title: "Thất bại",
        description: error + "",
        variant: "destructive",
      });
    }
  };

  const filteredTests = tests.filter((item) =>
    item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTests = filteredTests.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%] overflow-auto">
        <p className="text-base font-semibold text-blue-500">
          DANH SÁCH LOẠI XÉT NGHIỆM
        </p>
        <div className="flex justify-center items-center h-64">
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%] overflow-auto">
        <p className="text-base font-semibold text-blue-500">
          DANH SÁCH LOẠI XÉT NGHIỆM
        </p>
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Lỗi khi tải dữ liệu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%] overflow-auto">
      <p className="text-base font-semibold text-blue-500">
        DANH SÁCH LOẠI XÉT NGHIỆM
      </p>
      <div className="flex flex-row gap-3">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Nhập tên loại xét nghiệm..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {userId.includes("QTV")
            ? "Thêm loại xét nghiệm"
            : "Yêu cầu thêm loại xét nghiệm"}

          <CirclePlus className="h-4 w-4" />
        </Button>
      </div>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-blue-500 font-semibold">STT</TableHead>
            <TableHead className="text-blue-500 font-semibold">
              Tên xét nghiệm
            </TableHead>
            <TableHead className="text-blue-500 font-semibold">Mô tả</TableHead>
            <TableHead className="text-blue-500 font-semibold">
              Giá (VND)
            </TableHead>

            {userId.includes("QTV") ? (
              <TableHead className="w-[100px] text-blue-500 font-semibold">
                Thao tác
              </TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentTests.map((test, index) => (
            <TableRow key={test._id}>
              <TableCell>{test._id}</TableCell>
              <TableCell>
                {editingId === test._id ? (
                  <Input
                    name="name"
                    value={editedTest?.name || ""}
                    onChange={handleChange}
                    className="max-w-[200px]"
                  />
                ) : (
                  test.name
                )}
              </TableCell>
              <TableCell>
                {editingId === test._id ? (
                  <Input
                    name="description"
                    value={editedTest?.description || ""}
                    onChange={handleChange}
                    className="max-w-[300px]"
                  />
                ) : (
                  test.description
                )}
              </TableCell>
              <TableCell>
                {editingId === test._id ? (
                  <Input
                    name="price"
                    type="number"
                    value={editedTest?.price || 0}
                    onChange={handleChange}
                    className="max-w-[100px]"
                  />
                ) : (
                  test.price.toLocaleString("vi-VN")
                )}
              </TableCell>
              {userId.includes("QTV") ? (
                <TableCell className="flex flex-row gap-2">
                  {editingId === test._id ? (
                    <Button
                      onClick={handleSave}
                      className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      Lưu
                      <Save className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleEdit(test as any)}
                      variant="secondary"
                      className="border border-slate-00 dark:border-none"
                    >
                      Sửa
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="destructive">
                    Xoá
                    <Trash className="w-4 h-4" />
                  </Button>
                </TableCell>
              ) : null}
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
            THÊM LOẠI XÉT NGHIỆM
          </DialogTitle>
          <div className="flex flex-col gap-4">
            <p className="text-sm">Tên xét nghiệm:</p>
            <Input
              name="name"
              placeholder="Tên xét nghiệm"
              value={newTest.name}
              onChange={handleNewTestChange}
            />
            <p className="text-sm">Mô tả xét nghiệm:</p>
            <Textarea
              name="description"
              placeholder="Mô tả"
              value={newTest.description}
              onChange={handleNewTestChange}
            />
            <p className="text-sm">Giá:</p>

            <Input
              name="price"
              type="number"
              placeholder="Giá (VND)"
              value={newTest.price}
              onChange={handleNewTestChange}
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
                onClick={handleCreateTest}
              >
                Tạo
                <ArrowUpFromLine className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

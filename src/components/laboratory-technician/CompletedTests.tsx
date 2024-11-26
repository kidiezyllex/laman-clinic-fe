import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FlaskConical, RotateCcw, SearchIcon } from "lucide-react";
import axios from "axios";
import { Test } from "../../../lib/entity-types";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "../../../lib/utils";
import { usePathname } from "next/navigation";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TestResult from "./TestResult";
export default function CompletedTests() {
  // State
  const { toast } = useToast();
  const technicianId = usePathname().split("/")[1];
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [viewDoctorName, setViewDoctorName] = useState({
    doctorName: "",
    id: "",
  });
  const [filterType, setFilterType] = useState("all");
  const filteredTests = tests
    .filter((item) => {
      const searchTermLower = searchTerm.toLowerCase();
      if (filterType === "today")
        return formatDate(item.datePerformed) === formatDate(new Date());
      return item.patientId.toLowerCase().includes(searchTermLower);
    })
    .sort((a, b) => {
      if (filterType === "old") {
        return (
          new Date(b.datePerformed).getTime() -
          new Date(a.datePerformed).getTime()
        );
      } else if (filterType === "new") {
        return (
          new Date(a.datePerformed).getTime() -
          new Date(b.datePerformed).getTime()
        );
      }
      return 0;
    });

  // Function
  const fetchData = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/tests`
    );
    setTests(
      response.data.filter(
        (item: { technicianId: string }) => item.technicianId === technicianId
      )
    );
  };

  const handleViewDoctorName = async (doctorId: string, id: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/${doctorId}`
      );
      setViewDoctorName({ doctorName: response.data.fullName, id: id });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Thất bại!",
        description: error + "",
      });
    }
  };

  // UseEff
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%]">
      <p className="text-base font-semibold text-blue-500">
        DANH SÁCH CÁC XÉT NGHIỆM ĐÃ THỰC HIỆN
      </p>
      <div className="flex flex-row gap-3">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Nhập mã bệnh nhân (BN-XXXXXX). Ví dụ: BN-5EN8C8"
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
            <SelectItem value="today">Hôm nay</SelectItem>
            <SelectItem value="new">Gần nhất</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={fetchData}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Ngày yêu cầu</TableHead>
            <TableHead>Ngày thực hiện</TableHead>
            <TableHead>Mã bệnh nhân</TableHead>
            <TableHead>Bác sĩ yêu cầu</TableHead>
            <TableHead>Lý do</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTests.map((test, index) => (
            <TableRow key={test._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{formatDate(test.dateRequested)}</TableCell>
              <TableCell>{formatDate(test.datePerformed)}</TableCell>
              <TableCell>{test.patientId}</TableCell>
              <TableCell>
                <Badge
                  className="ml-2 cursor-pointer"
                  onClick={() => handleViewDoctorName(test.doctorId, test._id)}
                >
                  {viewDoctorName.id === test._id &&
                  viewDoctorName.doctorName !== ""
                    ? viewDoctorName.doctorName
                    : "Xem tên BS"}
                </Badge>
              </TableCell>
              <TableCell>{test.reasonByDoctor}</TableCell>
              <TableCell className="flex flex-row gap-2">
                <Button
                  onClick={() => {
                    setIsOpen(true);
                    setSelectedTest(test);
                  }}
                  variant="secondary"
                  className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Kết quả
                  <FlaskConical className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TestResult
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selectedTest={selectedTest}
      ></TestResult>
    </div>
  );
}

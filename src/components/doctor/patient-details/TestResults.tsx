import { formatDate } from "../../../../lib/utils";
import { Test } from "../../../../lib/entity-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, FlaskConical, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import axios from "axios";

interface TestResultsProps {
  testResults: Test;
}

export default function TestResults({ testResults }: TestResultsProps) {
  const [viewName, setViewName] = useState("");
  const handleViewName = async (technicianId: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/laboratory-technicians/${technicianId}`
      );
      setViewName(response.data.fullName);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="border rounded-md p-4 mr-4 text-slate-600 dark:text-slate-300 bg-primary-foreground">
        <div className="flex flex-col w-full">
          <h3 className="text-md font-semibold mb-2">Kết quả xét nghiệm</h3>
          <div className="flex flex-row items-center gap-3 justify-between p-4 bg-secondary rounded-t-md font-semibold text-slate-600 dark:text-slate-300 border border-b-0">
            <p className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              Ngày thực hiện: {formatDate(testResults.datePerformed)}
            </p>
            <p className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2" />Y tá xét nghiệm:{" "}
              <Badge
                variant={"default"}
                className="ml-2 cursor-pointer bg-slate-700 dark:bg-slate-300"
                onClick={() => handleViewName(testResults.technicianId)}
              >
                {viewName !== "" ? viewName : "Xem tên Y tá"}
              </Badge>
            </p>
            <p className="flex items-center text-sm">
              <FlaskConical className="h-4 w-4 mr-2" />
              Phòng xét nghiệm: {testResults.labTestId}
            </p>
          </div>
          <Table className="border bg-background pointer-events-none">
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Tên xét nghiệm</TableHead>
                <TableHead>Kết quả</TableHead>
                <TableHead>Khoảng tham chiếu</TableHead>
                <TableHead>Đơn vị</TableHead>
                <TableHead>Thiết bị</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testResults?.results?.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{result.testName}</TableCell>
                  <TableCell>{result.testResult}</TableCell>
                  <TableCell>{result.referenceRange}</TableCell>
                  <TableCell>{result.measurementUnit}</TableCell>
                  <TableCell>{result.equipment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}

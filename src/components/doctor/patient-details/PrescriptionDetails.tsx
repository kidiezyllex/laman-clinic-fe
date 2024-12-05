import { formatDate, formatDate2 } from "../../../../lib/utils";
import { Prescription, Test } from "../../../../lib/entity-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Stethoscope } from "lucide-react";
import { useState } from "react";
import axios from "axios";

interface props {
  selectedPrescription: Prescription;
}

export default function PrescriptionDetails({ selectedPrescription }: props) {
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
          <h3 className="text-md font-semibold mb-2">Chi tiết đơn thuốc</h3>
          <div className="flex flex-row items-center gap-3 justify-between p-4 bg-secondary rounded-t-md font-semibold text-slate-600 dark:text-slate-300 border border-b-0">
            <p className="flex items-center text-sm font-semibold">
              <Calendar className="h-4 w-4 mr-2" />
              Ngày lập đơn:{" "}
              {formatDate2(new Date(selectedPrescription.dateIssued))}
            </p>
            <p className="flex items-center text-sm font-semibold">
              <Stethoscope className="h-4 w-4 mr-2" />
              Mã Đơn thuốc: {selectedPrescription._id}
            </p>
          </div>
          <Table className="border bg-background">
            <TableHeader>
              <TableRow>
                <TableHead>Tên thuốc</TableHead>
                <TableHead>Liều lượng</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Đơn giá (VNĐ)</TableHead>
                <TableHead>Cách dùng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-slate-600 dark:text-slate-300">
              {selectedPrescription.medications.map((medication) => (
                <TableRow key={medication._id + ""}>
                  <TableCell>{medication.medicationName}</TableCell>
                  <TableCell>{medication.dosage}</TableCell>
                  <TableCell>{medication.quantity}</TableCell>
                  <TableCell>{medication.price}</TableCell>
                  <TableCell className="w-[35%]">
                    {medication.instructions}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}

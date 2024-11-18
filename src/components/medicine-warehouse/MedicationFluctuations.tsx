"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "../../../lib/utils";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

type PrescriptionType = {
  _id: string;
  quantity: number;
  dateIssued: string;
};

type MedicationDataType = {
  medicationName: string;
  prescriptions: PrescriptionType[];
};

export default function MedicationFluctuations({
  isOpenMF,
  setIsOpenMF,
}: {
  isOpenMF: boolean;
  setIsOpenMF: (isOpenMF: boolean) => void;
}) {
  const [medicationData, setMedicationData] = useState<MedicationDataType[]>(
    []
  );
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const toggleRow = (medicationName: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [medicationName]: !prev[medicationName],
    }));
  };

  const calculateTotals = (prescriptions: PrescriptionType[]) => {
    const totalPrescriptions = prescriptions.length;
    const totalQuantity = prescriptions.reduce(
      (sum, prescription) => sum + prescription.quantity,
      0
    );
    return { totalPrescriptions, totalQuantity };
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/prescriptions/medication-fluctuations`
      );
      setMedicationData(response.data);
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

  return (
    <Dialog open={isOpenMF || false} onOpenChange={setIsOpenMF}>
      <DialogContent className="max-w-[900px] w-[90%] h-[90%] overflow-y-auto">
        <DialogTitle className="text-md font-semibold self-center text-blue-500 mb-4">
          THÔNG TIN BIẾN ĐỘNG CỦA THUỐC
        </DialogTitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Xem chi tiết</TableHead>
              <TableHead>Tên thuốc</TableHead>
              <TableHead className="w-[200px]">Số đơn thuốc chứa</TableHead>
              <TableHead className="w-[200px]">
                Tổng số lượng thuốc đã bán
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicationData.map((medication) => {
              const { totalPrescriptions, totalQuantity } = calculateTotals(
                medication.prescriptions
              );
              return (
                <>
                  <TableRow
                    key={medication.medicationName}
                    onClick={() => toggleRow(medication.medicationName)}
                  >
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        {expandedRows[medication.medicationName] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">
                      {medication.medicationName}
                    </TableCell>
                    <TableCell>{totalPrescriptions}</TableCell>
                    <TableCell>{totalQuantity}</TableCell>
                  </TableRow>
                  {expandedRows[medication.medicationName] && (
                    <TableRow className="bg-primary-foreground pointer-events-none">
                      <TableCell colSpan={4}>
                        <Table>
                          <TableHeader className="border-b">
                            <TableRow>
                              <TableHead>Mã đơn thuốc</TableHead>
                              <TableHead>Ngày lập đơn</TableHead>
                              <TableHead>Số lượng</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {medication.prescriptions.map((prescription) => (
                              <TableRow key={prescription._id}>
                                <TableCell>{prescription._id}</TableCell>
                                <TableCell>
                                  {formatDate(
                                    new Date(prescription.dateIssued)
                                  )}
                                </TableCell>
                                <TableCell>{prescription.quantity}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}

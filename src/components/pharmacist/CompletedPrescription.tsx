import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  ChevronUp,
  Eye,
  SearchIcon,
  Stethoscope,
  User,
} from "lucide-react";
import axios from "axios";
import PatientPrescriptionInvoice from "./prescription/PatientPrescriptionInvoice";
import { Medication, Patient, Prescription } from "../../../lib/entity-types";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "../../../lib/utils";
export default function CompletedPrescription() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [newMedication, setNewMedication] = useState<Medication[]>([]);
  const [showInvoice, setShowInvoice] = useState({ isShow: false, id: "" });
  const [filterType, setFilterType] = useState("all");

  // FecthData đơn thuốc đã hoàn thành
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/prescriptions`
      );
      setPrescriptions(
        response.data.filter(
          (item: { status: string }) => item.status === "Completed"
        )
      );
    };

    fetchData();
  }, []);

  const filteredPrescriptions = prescriptions
    .filter((prescription) => {
      const searchTermLower = searchTerm.toLowerCase();
      if (filterType === "today")
        return formatDate(prescription.dateIssued) === formatDate(new Date());
      else if (filterType === "visitor")
        return prescription.patientId.includes("BN-VL");
      return (
        prescription.patientId
          .toLowerCase()
          .includes(searchTermLower.toLowerCase()) ||
        prescription?.visitorName
          ?.toLowerCase()
          .includes(searchTermLower.toLowerCase()) ||
        prescription?.visitorPhone?.includes(searchTermLower)
      );
    })
    .sort((a, b) => {
      if (filterType === "old") {
        return (
          new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime()
        );
      } else if (filterType === "new") {
        return (
          new Date(a.dateIssued).getTime() - new Date(b.dateIssued).getTime()
        );
      }
      return 0;
    });
  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%]">
      <p className="text-base font-semibold text-blue-500">
        ĐƠN THUỐC ĐÃ HOÀN THÀNH
      </p>
      <div className="flex flex-row gap-3">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Nhập mã hoặc tên hoặc SĐT của Bệnh nhân..."
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
            <SelectItem value="visitor">Khách vãng lai</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-6 md:grid-cols-1">
        {filteredPrescriptions.map((prescription) => (
          <Card key={prescription._id + ""} className="mb-6">
            <div className="flex flex-row items-center gap-3 justify-between p-4 bg-secondary rounded-t-md">
              <p className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                Ngày lập đơn:{" "}
                {new Date(prescription.dateIssued).toLocaleDateString("vi-VN")}
              </p>
              {prescription.patientId.includes("BN-VL") ? (
                <>
                  <p className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2" />
                    Tên Bệnh nhân: {prescription.visitorName}
                  </p>
                  <p className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2" />
                    SĐT: {prescription.visitorPhone}
                  </p>
                </>
              ) : (
                <p className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2" />
                  Mã Bệnh nhân: {prescription.patientId}
                </p>
              )}

              <p className="flex items-center text-sm">
                <Stethoscope className="h-4 w-4 mr-2" />
                Mã Đơn thuốc: {prescription._id}
              </p>
            </div>

            {/* Medications table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên thuốc</TableHead>
                  <TableHead>Liều lượng</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Đơn giá (VNĐ)</TableHead>
                  <TableHead>Cách dùng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescription.medications.map((medication) => (
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

            {/* Action buttons */}
            <div className="flex lfex-row gap-3 p-4 justify-end">
              {showInvoice.id === prescription._id && showInvoice.isShow ? (
                <Button
                  variant="destructive"
                  onClick={() =>
                    setShowInvoice({ isShow: false, id: prescription._id + "" })
                  }
                >
                  Thu gọn
                  <ChevronUp className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowInvoice({ isShow: true, id: prescription._id + "" });
                  }}
                >
                  Xem hoá đơn
                  <Eye className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Invoice component */}
            {showInvoice.id === prescription._id && showInvoice.isShow && (
              <PatientPrescriptionInvoice
                prescription={prescription}
                newMedication={newMedication}
              />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

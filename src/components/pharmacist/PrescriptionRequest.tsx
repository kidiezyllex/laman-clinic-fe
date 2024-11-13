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
import { Calendar, SearchIcon, Stethoscope, User } from "lucide-react";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import PatientPrescriptionInvoice from "./prescription/PatientPrescriptionInvoice";
import { formatDate } from "../../../lib/utils";
import { Medication, Patient, Prescription } from "../../../lib/entity-types";
import { useToast } from "@/hooks/use-toast";

export default function PrescriptionRequest() {
  const { toast } = useToast();
  const [showCheckboxes, setShowCheckboxes] = useState({
    isShow: false,
    id: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [newMedication, setNewMedication] = useState<Medication[]>([]);
  const [showInvoice, setShowInvoice] = useState({ isShow: false, id: "" });
  const [selectedPatientId, setSelectedPatientId] = useState({
    patientId: "",
    id: "",
  });
  const [selectedPatientMedicalHistory, setSelectedPatientMedicalHistory] =
    useState<Patient>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        // `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/prescriptions` // cho bên ông test api này
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/pharmacists/get-list-prescriptions` //api này có connect với redis
      );
      setPrescriptions(
        response.data.data.filter(
          (item: { status: string }) => item.status === "Scheduled"
        )
      );
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/${selectedPatientId.patientId}`
      );
      console.log(response.data);
      setSelectedPatientMedicalHistory(response.data);
    };

    fetchData();
  }, [selectedPatientId]);
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const searchTermLower = searchTerm.toLowerCase();
    return prescription.patientId.toLowerCase().includes(searchTermLower);
  });

  const handleCheckboxChange = (checked: boolean, medication: Medication) => {
    if (checked) {
      setNewMedication((prev) => [...prev, medication]);
    } else {
      setNewMedication((prev) =>
        prev.filter((med) => med._id !== medication._id)
      );
    }
  };

  const handleCompletePrescription = async (prescriptionId: string) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/prescriptions/${prescriptionId}`,
        { status: "Completed", dateIssued: new Date() }
      );
      toast({
        variant: "default",
        title: "Thành công!",
        description: "Hoàn thành đơn thuốc!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Thất bại!",
        description: "Lỗi: " + error,
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%]">
      <p className="text-base font-semibold text-blue-500">
        DÀNH CHO BỆNH NHÂN ĐÃ KHÁM TẠI PHÒNG KHÁM
      </p>

      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="search"
          placeholder="Nhập mã bệnh nhân (BN-XXXXXX). Ví dụ: BN-JCXX2B"
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        {filteredPrescriptions.map((prescription) => (
          <Card key={prescription._id} className="mb-6">
            {/* Prescription header */}
            <div className="grid grid-cols-3 items-center gap-3 justify-between p-4 bg-secondary rounded-t-md">
              <p className="flex items-center text-base">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(prescription.dateIssued).toLocaleDateString("vi-VN")}
              </p>
              <p className="flex items-center text-base">
                <User className="h-4 w-4 mr-2" />
                Mã Bệnh nhân: {prescription.patientId}
              </p>
              <p className="flex items-center text-base">
                <Stethoscope className="h-4 w-4 mr-2" />
                Mã Đơn thuốc: {prescription._id}
              </p>
            </div>

            {/* Medications table */}
            <Table>
              <TableHeader>
                <TableRow>
                  {showCheckboxes.isShow &&
                    showCheckboxes.id === prescription._id && (
                      <TableHead className="w-[50px]">Chọn</TableHead>
                    )}
                  <TableHead>Tên thuốc</TableHead>
                  <TableHead>Liều lượng</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Đơn giá (VNĐ)</TableHead>
                  <TableHead>Cách dùng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescription.medications.map((medication) => (
                  <TableRow key={medication._id}>
                    {showCheckboxes.isShow &&
                      showCheckboxes.id === prescription._id && (
                        <TableCell>
                          <Checkbox
                            checked={newMedication.some(
                              (med) => med._id === medication._id
                            )}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(
                                checked as boolean,
                                medication as any
                              )
                            }
                          />
                        </TableCell>
                      )}
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
              <Button
                onClick={() =>
                  setSelectedPatientId({
                    patientId: prescription.patientId,
                    id: prescription._id,
                  })
                }
                variant={"outline"}
                className={
                  showCheckboxes.id === prescription._id &&
                  showCheckboxes.isShow
                    ? "hidden"
                    : ""
                }
              >
                Lịch sử bệnh lý
              </Button>

              {showCheckboxes.id === prescription._id &&
              showCheckboxes.isShow ? (
                <Button
                  variant={"destructive"}
                  onClick={() => {
                    setShowCheckboxes({ isShow: false, id: "" });
                    setShowInvoice({ isShow: false, id: "" });
                  }}
                >
                  Huỷ tuỳ chỉnh
                </Button>
              ) : (
                <Button
                  variant={"outline"}
                  onClick={() =>
                    setShowCheckboxes({
                      isShow: !showCheckboxes.isShow,
                      id: prescription._id,
                    })
                  }
                >
                  {"Tuỳ chỉnh đơn thuốc"}
                </Button>
              )}

              {showInvoice.id === prescription._id && showInvoice.isShow ? (
                <Button
                  variant="destructive"
                  onClick={() =>
                    setShowInvoice({ isShow: false, id: prescription._id })
                  }
                >
                  Thu gọn
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowInvoice({ isShow: true, id: prescription._id });
                  }}
                >
                  Xem hoá đơn
                </Button>
              )}
              <Button
                className="bg-blue-500 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600"
                onClick={() => handleCompletePrescription(prescription._id)}
              >
                Hoàn thành đơn
              </Button>
            </div>

            {/* Invoice component */}
            {showInvoice.id === prescription._id && showInvoice.isShow && (
              <PatientPrescriptionInvoice
                prescription={prescription}
                newMedication={newMedication}
              />
            )}

            {/* Lịch sử bệnh lý */}
            {selectedPatientId.id === prescription._id &&
            selectedPatientMedicalHistory?.medicalHistory?.length === 0 ? (
              <p className="text-slate-500 text-sm">
                Chưa có lịch sử khám bệnh
              </p>
            ) : (
              <Table>
                <TableHeader>
                  {selectedPatientId.id === prescription._id && (
                    <TableRow>
                      <TableHead>
                        Tên bệnh nhân: {selectedPatientMedicalHistory?.fullName}
                      </TableHead>
                      <TableHead>
                        {" "}
                        Số ĐT: {selectedPatientMedicalHistory?.phone}
                      </TableHead>
                    </TableRow>
                  )}
                </TableHeader>
                <TableHeader>
                  {selectedPatientId.id === prescription._id && (
                    <TableRow>
                      <TableHead>STT</TableHead>
                      <TableHead>Ngày khám</TableHead>
                      <TableHead>Chẩn đoán bệnh</TableHead>
                      <TableHead>Phương pháp điều trị</TableHead>
                    </TableRow>
                  )}
                </TableHeader>
                <TableBody>
                  {selectedPatientId.id === prescription._id &&
                    selectedPatientMedicalHistory?.medicalHistory?.map(
                      (history: any, index) => (
                        <TableRow key={history.diagnosisDate}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            {formatDate(history?.diagnosisDate)}
                          </TableCell>
                          <TableCell>{history.diagnosisDescription}</TableCell>
                          <TableCell>{history.treatment}</TableCell>
                        </TableRow>
                      )
                    )}
                </TableBody>
              </Table>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

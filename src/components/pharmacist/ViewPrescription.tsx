"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  CalendarIcon,
  Cat,
  Dog,
  Loader2,
  Pill,
  SearchIcon,
  Stethoscope,
  Trash,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
interface Medication {
  medicationName: string;
  dose: string;
  quantity: number;
  instructions: string;
  _id: string;
}

interface Patient {
  _id: String;
  fullName?: string;
  phone?: string;
  email?: string;
}
interface Prescription {
  _id: string;
  patientId: string;
  doctorId: string;
  medications: Medication[];
  dateIssued: Date;
  patient: Patient;
}

export default function ViewPrescription() {
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Prescription | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const searchTermLower = searchTerm.toLowerCase();
    return prescription.patientId.toLowerCase().includes(searchTermLower);
  });

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return format(date, "dd/MM/yyyy");
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/pharmacists/prescriptions`
      );
      // const response2 = await axios.get(
      //   `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/?_id=${selectedAppointment?.patientId}`
      // );
      // patient: {
      //   _id: response2.data[0]._id,
      //   fullName: response2.data[0].fullName,
      //   phone: response2.data[0].phone,
      //   email: response2.data[0].email,
      // }
      setPrescriptions(response.data.data);
    };

    fetchData();
  }, []);

  // const handleSubmit = async () => {
  //   try {
  //     setIsLoading(true);
  //     const payload = {
  //       patientId: selectedAppointment?.id,
  //       appointmentDate: new Date(),
  //       reason,
  //       specialization: selectedAppointment?.specialization,
  //     };
  //     const response = await axios.post(
  //       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/appointments`,
  //       payload
  //     );
  //     if (response.status === 400) {
  //       toast({
  //         variant: "destructive",
  //         title: "Lỗi!",
  //         description: response.data.message,
  //       });
  //     } else if (response.status === 202) {
  //       toast({
  //         variant: "default",
  //         title: "Thành công!",
  //         description: response.data.message,
  //       });
  //     } else {
  //       toast({
  //         variant: "destructive",
  //         title: "Thất bại!",
  //         description: response.data.message,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error during sign in:", error);
  //   } finally {
  //     setIsLoading(false);
  //     setIsDialogOpen(false);
  //     setIsEditing(false);
  //     setReason("");
  //   }
  // };

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%]">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-2 items-center justify-center"></div>
        <Button className="bg-blue-500 hover:bg-blue-600">
          <CalendarIcon className="mr-2 h-4 w-4" /> Tạo ca khám mới
        </Button>
      </div>

      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="search"
          placeholder="Nhập tên, hoặc sđt, hoặc email"
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        {filteredPrescriptions.map((prescription) => (
          <Card key={prescription._id} className="mb-6">
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
                Mã Bác sĩ: {prescription.doctorId}
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên thuốc</TableHead>
                  <TableHead>Liều lượng</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Cách dùng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescription.medications.map((medication) => (
                  <TableRow key={medication._id}>
                    <TableCell>{medication.medicationName}</TableCell>
                    <TableCell>{medication.dose}</TableCell>
                    <TableCell>{medication.quantity}</TableCell>
                    <TableCell className="w-[45%]">
                      {medication.instructions}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ))}
      </div>
    </div>
  );
}

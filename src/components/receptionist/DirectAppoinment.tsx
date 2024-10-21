"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CalendarIcon, Cat, Dog, Loader2, SearchIcon } from "lucide-react";
import axios from "axios";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import PatientProfileForm from "../patient/profile/PatientProfileForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
interface Patient {
  _id: String;
  numberId?: string;
  fullName?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export default function DirectAppoinment() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [specializations, setSpecializations] = useState<[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showCreatePatientProfile, setShowCreatePatientProfile] =
    useState(false);
  const [reason, setReason] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const handleSearchPatientProfile = () => {
    const filteredP = patients.filter((patient) => {
      const searchTermLower = searchTerm.toLowerCase();
      if (searchTermLower === "") {
        return;
      }
      return (
        patient.fullName?.toLowerCase().includes(searchTermLower) ||
        (patient.phone && patient.phone.includes(searchTerm)) ||
        (patient.email &&
          patient.email.toLowerCase().includes(searchTermLower)) ||
        (patient._id && patient._id.toLowerCase().includes(searchTermLower))
      );
    });
    if (filteredP.length === 0) {
      toast({
        variant: "default",
        title: "Không tìm thấy!",
        description: "Vui lòng Tạo hồ sơ bệnh nhân mới!",
      });
      setShowCreatePatientProfile(true);
    }
    setFilteredPatients(filteredP);
  };
  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return format(date, "dd/MM/yyyy");
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients`
      );
      const response2 = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/specializations`
      );
      setPatients(response.data);
      setSpecializations(response2.data);
      console.log(response.data);
    };

    fetchData();
  }, [searchTerm]);

  const handleCreatePatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const payload = {
        patientId: selectedPatient?._id,
        appointmentDate: new Date(),
        reason,
        specialization: specialization,
        priority: checked,
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/appointments`,
        payload
      );
      if (response.status === 400) {
        toast({
          variant: "destructive",
          title: "Lỗi!",
          description: response.data.message,
        });
      } else if (response.status === 202) {
        toast({
          variant: "default",
          title: "Thành công!",
          description: response.data.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Thất bại!",
          description: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error during sign in:", error);
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
      setIsEditing(false);
      setReason("");
    }
  };
  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%]">
      <p className="text-base font-semibold text-blue-500">TẠO HẸN KHÁM MỚI</p>
      <div className="flex flex-row w-full gap-3">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Nhập mã bệnh nhân, tên, hoặc email"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant={"secondary"}
          onClick={() => handleSearchPatientProfile()}
        >
          Tìm hồ sơ bệnh nhân
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {filteredPatients.map((patient) => (
          <Card
            key={patient?._id + ""}
            className="flex flex-col gap-6 justify-center items-center p-4"
          >
            <div className="flex flex-row gap-2 items-center w-full">
              {patient?.gender?.toLowerCase() === "male" ||
              patient?.gender?.toLowerCase() === "nam" ? (
                <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-blue-200">
                  <Dog className="text-blue-500" />
                </div>
              ) : (
                <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-pink-200">
                  <Cat className="text-pink-500" />
                </div>
              )}

              <div>
                <p className="text-sm text-slate-500">
                  <span className="font-semibold text-sm">Mã bệnh nhân: </span>{" "}
                  {patient._id}
                </p>
                <p className="text-base">
                  <span className="font-semibold text-base">Tên: </span>{" "}
                  {patient.fullName}
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <Button
                className="w-fit bg-blue-500 hover:bg-blue-600"
                onClick={() => handleCreatePatient(patient)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" /> Tạo ca khám
              </Button>
            </div>
          </Card>
        ))}
      </div>
      {showCreatePatientProfile && (
        <PatientProfileForm
          setSearchTerm={setSearchTerm}
          setShowCreatePatientProfile={setShowCreatePatientProfile}
        ></PatientProfileForm>
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[900px] w-[90%] h-[90%] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Bệnh nhân:{" "}
              <span className="text-blue-500">{selectedPatient?.fullName}</span>
            </DialogTitle>
          </DialogHeader>
          <Separator></Separator>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 w-full">
            <div className="grid grid-cols-4 items-center gap-2 ">
              <Label htmlFor="name">Mã bệnh nhân</Label>
              <Input
                id="id"
                value={selectedPatient?._id + ""}
                className="col-span-3 bg-secondary rounded-sm"
                disabled={!isEditing}
              />
            </div>
            {selectedPatient?.dateOfBirth && (
              <div className="grid grid-cols-4 items-center gap-3">
                <Label htmlFor="dob">Ngày sinh</Label>
                <Input
                  id="dob"
                  value={
                    formatDate(
                      selectedPatient?.dateOfBirth as unknown as Date
                    ) || ""
                  }
                  className="col-span-3 bg-secondary rounded-sm"
                  disabled={!isEditing}
                />
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="gender">Giới tính</Label>
              <Input
                id="gender"
                value={
                  selectedPatient?.gender?.toLowerCase() === "male" ||
                  selectedPatient?.gender?.toLowerCase() === "nam"
                    ? "Nam"
                    : "Nữ"
                }
                className="col-span-3 bg-secondary rounded-sm"
                disabled={!isEditing}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-2 ">
              <Label htmlFor="name">Email</Label>
              <Input
                id="email"
                value={selectedPatient?.email || ""}
                className="col-span-3 bg-secondary rounded-sm"
                disabled={!isEditing}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-2 ">
              <Label htmlFor="name">Phone</Label>
              <Input
                id="phone"
                value={selectedPatient?.phone || ""}
                className="col-span-3 bg-secondary rounded-sm"
                disabled={!isEditing}
              />
            </div>
            {selectedPatient?.address && (
              <div className="grid grid-cols-4 items-center gap-3">
                <Label htmlFor="address">Địa chỉ</Label>
                <Textarea
                  id="address"
                  value={selectedPatient?.address || ""}
                  className="col-span-3 bg-secondary rounded-sm"
                  disabled={!isEditing}
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-8 items-center gap-3">
            <Label htmlFor="reason">Lý do</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="col-span-7"
              placeholder="Nhập lý do hẹn khám"
            />
          </div>
          <div className="grid grid-cols-8 items-center gap-3">
            <Label htmlFor="reason">Chuyên ngành</Label>
            <Select onValueChange={(value) => setSpecialization(value)}>
              <SelectTrigger className="col-span-7">
                <SelectValue placeholder="Chọn Chuyên ngành" />
              </SelectTrigger>
              <SelectContent>
                {specializations.map((specialization) => (
                  <SelectItem key={specialization} value={specialization}>
                    {specialization}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-8 items-center gap-3">
            <Label htmlFor="reason">Ưu tiên</Label>
            <input
              className="h-5 w-5"
              type="checkbox"
              checked={checked}
              onChange={() => {
                setChecked(!checked);
              }}
            />
          </div>
          <DialogFooter className="flex-grow items-end">
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Hủy" : "Chỉnh sửa"}
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Xác nhận"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  ArrowUpFromLine,
  Calendar,
  CalendarIcon,
  Cat,
  Dog,
  Loader2,
  Mail,
  MapPin,
  Phone,
  SearchIcon,
  User,
  X,
} from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import PatientProfileForm from "../patient/profile/PatientProfileForm";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Patient } from "../../../lib/entity-types";
import { formatDate } from "../../../lib/utils";

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
    const searchTermLower = searchTerm.toLowerCase();
    if (searchTermLower === "") {
      toast({
        variant: "destructive",
        title: "Thất bại!",
        description: "Vui lòng nhập mã bệnh nhân!",
      });
      return;
    }
    const filteredP = patients.filter((patient) => {
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
        variant: "destructive",
        title: "Không tìm thấy!",
        description: "Vui lòng Tạo hồ sơ bệnh nhân mới!",
      });
      setShowCreatePatientProfile(true);
    } else setShowCreatePatientProfile(false);
    setFilteredPatients(filteredP);
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
      console.error(error);
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
                className="w-fit bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600"
                onClick={() => handleCreatePatient(patient)}
              >
                Tạo ca khám
                <CalendarIcon className="mr-2 h-4 w-4" />
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
        <DialogContent className="max-w-[900px] w-[90%] h-[90%] overflow-y-auto">
          <div className="flex items-center space-x-4 border rounded-md p-4 mr-4">
            {selectedPatient?.gender?.toLowerCase() === "male" ? (
              <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-blue-200">
                <Dog className="text-blue-500" />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-pink-200">
                <Cat className="text-pink-500" />
              </div>
            )}
            <div>
              <p className="text-base font-semibold">
                {selectedPatient?.fullName}
              </p>
              <p className="text-slate-500">
                Mã bệnh nhân: {selectedPatient?._id}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 space-x-4 border rounded-md p-4 mr-4">
            <div className="flex flex-col gap-3">
              <h3 className="text-md font-semibold">Thông tin bệnh nhân</h3>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm">
                  Ngày sinh: {formatDate(selectedPatient?.dateOfBirth)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                <span className="text-sm">
                  Giới tính:{" "}
                  {selectedPatient?.gender?.toLowerCase() === "female"
                    ? "Nữ"
                    : "Nam"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="text-sm">
                  Địa chỉ: {selectedPatient?.address}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Số ĐT: {selectedPatient?.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Email: {selectedPatient?.email}</span>
              </div>
            </div>
          </div>
          <h3 className="text-md font-semibold">
            Vui lòng nhập lý do hẹn khám
          </h3>
          <div className="mr-4">
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do hẹn khám"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <h3 className="text-md font-semibold">
                Vui lòng chọn chuyên ngành
              </h3>
              <div className="w-full">
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
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-md font-semibold">
                Vui lòng chọn ưu tiên (tuỳ chọn)
              </h3>
              <input
                className="h-5 w-5"
                type="checkbox"
                checked={checked}
                onChange={() => {
                  setChecked(!checked);
                }}
              />
            </div>
          </div>
          <DialogFooter className="flex-grow items-end mr-4">
            <Button
              variant="destructive"
              onClick={() => setIsDialogOpen(false)}
            >
              Huỷ
              <X className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {isLoading ? (
                <>
                  Đang xử lý
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  Tạo ca khám
                  <ArrowUpFromLine className="mr-2 h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CalendarIcon, Cat, Dog, SearchIcon, Trash } from "lucide-react";
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

interface AppointmentByPatient {
  id: string;
  appointmentDateByPatient: Date;
  specialization: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  medicalHistory: Array<string>;
}

export default function ViewAppointment() {
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [appointmentByPatient, setAppointmentByPatient] = useState<
    AppointmentByPatient[]
  >([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentByPatient | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredAppointments = appointmentByPatient.filter((appointment) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      appointment.fullName.toLowerCase().includes(searchTermLower) ||
      (appointment.phone && appointment.phone.includes(searchTerm)) ||
      (appointment.email &&
        appointment.email.toLowerCase().includes(searchTermLower))
    );
  });

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return format(date, "dd/MM/yyyy");
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `/api/appointment/appointment-by-patient`
      );
      setAppointmentByPatient(response.data);
    };

    fetchData();
  }, []);

  const handleCreateAppointment = (appointment: AppointmentByPatient) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const getHoursBetweenDates = (
    date2: Date | string | undefined
  ): number | null => {
    const date1 = new Date();

    if (!date2) return null;
    let parsedDate2: Date;
    if (typeof date2 === "string") {
      parsedDate2 = new Date(date2);
    } else {
      parsedDate2 = date2;
    }
    if (isNaN(parsedDate2.getTime())) {
      return null;
    }
    return parseInt(Math.abs(parsedDate2.getTime() - date1.getTime()) / 36e5);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const payload = {
        patientId: {
          ...selectedAppointment,
        },
        appointmentDate: new Date(),
        reason,
        status: "Scheduled",
        specialization: selectedAppointment?.specialization,
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

  const handleDeleteAppointmentByPatient = async (id: string) => {
    try {
      const response = await axios.delete(
        `/api/appointment/appointment-by-patient/?id=${id}`
      );
      console.log("res: ", response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%]">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-2 items-center justify-center">
          <p className="font-semibold text-base">Trạng thái: </p>
          <Badge variant={"destructive"}>Đã huỷ</Badge>
          <Badge variant={"secondary"}>Đang chờ</Badge>
          <Badge className="bg-blue-500 dark:text-white">Đã lên lịch</Badge>
          <Badge className="bg-green-500 dark:text-white">Hoàn thành</Badge>
        </div>
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

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {filteredAppointments.map((appointment) => (
          <Card
            key={appointment.id}
            className="flex flex-col gap-6 justify-center items-center p-4"
          >
            <div className="flex flex-row gap-2 items-center w-full">
              {appointment.gender.toLowerCase() === "male" ||
              appointment.gender.toLowerCase() === "nam" ? (
                <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-blue-200">
                  <Dog className="text-blue-500" />
                </div>
              ) : (
                <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-pink-200">
                  <Cat className="text-pink-500" />
                </div>
              )}

              <div>
                <p className="text-base">
                  <span className="font-semibold text-base">Tên: </span>{" "}
                  {appointment.fullName}
                </p>
                <p className="text-sm text-slate-500">
                  <span className="font-semibold text-sm">Giới tính: </span>{" "}
                  {appointment.gender}
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-2 w-full">
              <Badge variant={"secondary"}>Đang chờ</Badge>
              <Badge>{appointment.specialization}</Badge>
            </div>
            <div className="flex flex-row gap-2">
              <Button
                className="w-fit bg-blue-500 hover:bg-blue-600"
                onClick={() => handleCreateAppointment(appointment)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" /> Tạo ca khám
              </Button>
              {/* <Button
                variant={"destructive"}
                onClick={() => handleDeleteAppointmentByPatient(appointment.id)}
              >
                <Trash className="mr-2 h-4 w-4" /> Xoá
              </Button> */}
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[900px] w-[90%] h-[90%] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Bệnh nhân:{" "}
              <span className="text-blue-500">
                {selectedAppointment?.fullName}
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 w-full">
            <div className="grid grid-cols-4 items-center gap-2 ">
              <Label htmlFor="name">CCCD</Label>
              <Input
                id="id"
                value={selectedAppointment?.id || ""}
                className="col-span-3 bg-secondary rounded-sm"
                disabled={!isEditing}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="dob">Ngày sinh</Label>
              <Input
                id="dob"
                value={
                  formatDate(
                    selectedAppointment?.dateOfBirth as unknown as Date
                  ) || ""
                }
                className="col-span-3 bg-secondary rounded-sm"
                disabled={!isEditing}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="gender">Giới tính</Label>
              <Input
                id="gender"
                value={
                  selectedAppointment?.gender.toLowerCase() === "male" ||
                  selectedAppointment?.gender.toLowerCase() === "nam"
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
                value={selectedAppointment?.email || ""}
                className="col-span-3 bg-secondary rounded-sm"
                disabled={!isEditing}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-2 ">
              <Label htmlFor="name">Phone</Label>
              <Input
                id="phone"
                value={selectedAppointment?.phone || ""}
                className="col-span-3 bg-secondary rounded-sm"
                disabled={!isEditing}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-2 ">
              <Label htmlFor="specialization">Khoa</Label>
              <Input
                id="specialization"
                value={selectedAppointment?.specialization || ""}
                className="col-span-3 bg-secondary rounded-sm"
                disabled={!isEditing}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="address">Địa chỉ</Label>
              <Textarea
                id="address"
                value={selectedAppointment?.address || ""}
                className="col-span-3 bg-secondary rounded-sm"
                disabled={!isEditing}
              />
            </div>
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
          <div>
            {selectedAppointment?.appointmentDateByPatient &&
            getHoursBetweenDates(
              selectedAppointment?.appointmentDateByPatient as Date
            ) >= 1 ? (
              <div className="w-full p-4 bg-blue-400 rounded-md border">
                <p className="text-white">
                  Bệnh nhân đến sớm so với lịch đăng ký{" "}
                  {getHoursBetweenDates(
                    selectedAppointment?.appointmentDateByPatient as Date
                  )}{" "}
                  giờ
                </p>
              </div>
            ) : (
              ""
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Hủy" : "Chỉnh sửa"}
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Loading..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

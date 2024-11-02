"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  CalendarIcon,
  Cat,
  Dog,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  SearchIcon,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "../../../lib/utils";
import { AppointmentByPatient } from "../../../lib/entity-types";

export default function OnlineAppointment() {
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

  const fetchData = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/appointmentsByPatient`
    );
    setAppointmentByPatient(response.data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAppointment = (appointment: AppointmentByPatient) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const getHoursBetweenDates = (
    date2: Date | string | number | undefined
  ): number | null => {
    const date1 = new Date();

    if (date2 === undefined) return null;

    let parsedDate2: Date;

    if (typeof date2 === "string") {
      parsedDate2 = new Date(date2);
    } else if (typeof date2 === "number") {
      parsedDate2 = new Date(date2);
    } else {
      parsedDate2 = date2;
    }

    if (isNaN(parsedDate2.getTime())) {
      return null;
    }

    const timeDifference = Math.abs(parsedDate2.getTime() - date1.getTime());
    return Math.floor(timeDifference / (1000 * 60 * 60));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const payload = {
        patientId: selectedAppointment?.id,
        appointmentDate: new Date(),
        reason,
        specialization: selectedAppointment?.specialization,
      };

      // Post lịch hẹn khám chính thức
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

        // Xoá khỏi lịch hẹn khám tạm
        const response2 = await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/appointmentsByPatient/?id=${selectedAppointment?.id}`
        );
        // Fetch lại data
        fetchData();
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
      <p className="text-base font-semibold text-blue-500">
        DANH SÁCH BỆNH NHÂN ĐÃ ĐĂNG KÝ HẸN KHÁM TRÊN WEB
      </p>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="search"
          placeholder="Nhập tên, hoặc sđt, hoặc email"
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex flex-row gap-2 justify-end">
        <p className="font-semibold text-base">Trạng thái: </p>
        <Badge variant={"destructive"}>Đã huỷ</Badge>
        <Badge variant={"secondary"}>Đang chờ</Badge>
        <Badge className="bg-blue-500 dark:text-white">Đã lên lịch</Badge>
        <Badge className="bg-green-500 dark:text-white">Hoàn thành</Badge>
      </div>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {filteredAppointments.map((appointment) => (
          <Card
            key={appointment.id + ""}
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
                  {appointment.gender?.toLowerCase() === "female"
                    ? "Nữ"
                    : "Nam"}
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-2 w-full">
              <Badge variant={"secondary"}>Đang chờ</Badge>
              <Badge>Khoa: {appointment.specialization}</Badge>
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
        <DialogContent className="max-w-[900px] w-[90%] h-[90%] overflow-y-auto">
          <div className="flex items-center space-x-4 border rounded-md p-4 mr-4">
            {selectedAppointment?.gender?.toLowerCase() === "male" ? (
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
                {selectedAppointment?.fullName}
              </p>
              <p className="text-slate-500">
                Mã bệnh nhân: {selectedAppointment?.id}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 space-x-4 border rounded-md p-4 mr-4">
            <div className="flex flex-col gap-3">
              <h3 className="text-md font-semibold">Thông tin bệnh nhân</h3>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm">
                  Ngày sinh:
                  {/* {formatDate(selectedAppointment?.dateOfBirth)} */}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                <span className="text-sm">
                  Giới tính:{" "}
                  {selectedAppointment?.gender.toLowerCase() === "female"
                    ? "Nữ"
                    : "Nam"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="text-sm">
                  Địa chỉ:
                  {/* {selectedAppointment.patientId.address} */}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500" />
                <span className="text-sm">
                  Số ĐT: {selectedAppointment?.phone}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                <span className="text-sm">
                  Email: {selectedAppointment?.email}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 ">
              <p className="text-md font-semibold">
                Thông tin lịch hẹn đăng ký
              </p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-5 text-blue-500" />
                <span className="text-sm">
                  Ngày hẹn khám:{" "}
                  {formatDate(selectedAppointment?.appointmentDateByPatient)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-5 text-blue-500" />
                <span className="text-sm">Trạng thái: Đang chờ duyệt</span>
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

          <div className="mr-4">
            {selectedAppointment?.appointmentDateByPatient ? (
              <div className="w-full p-4 bg-secondary rounded-md border">
                <p>
                  Bệnh nhân đến sớm so với lịch đăng ký{" "}
                  {getHoursBetweenDates(
                    selectedAppointment.appointmentDateByPatient
                  )}{" "}
                  giờ
                </p>
              </div>
            ) : (
              ""
            )}
          </div>
          <DialogFooter className="mr-4 mt-4">
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

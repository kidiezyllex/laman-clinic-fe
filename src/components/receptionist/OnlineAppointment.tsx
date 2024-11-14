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
  SquareActivity,
  Timer,
  User,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  formatDate,
  formatDate3,
  generateExamination,
  getHoursBetweenDates,
  renderSpecialty,
} from "../../../lib/utils";
import { AppointmentByPatient } from "../../../lib/entity-types";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function OnlineAppointment() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [appointmentByPatient, setAppointmentByPatient] = useState<
    AppointmentByPatient[]
  >([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentByPatient | null>(null);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState("all");

  const filteredAppointments = appointmentByPatient
    .filter((appointment) => {
      const searchTermLower = searchTerm.toLowerCase();
      if (filterType === "today")
        return (
          formatDate(appointment.appointmentDateByPatient) ===
          formatDate(new Date())
        );
      return (
        appointment.fullName.toLowerCase().includes(searchTermLower) ||
        (appointment.phone && appointment.phone.includes(searchTerm)) ||
        (appointment.email &&
          appointment.email.toLowerCase().includes(searchTermLower))
      );
    })
    .sort((a, b) => {
      if (filterType === "old") {
        return (
          new Date(b.appointmentDateByPatient).getTime() -
          new Date(a.appointmentDateByPatient).getTime()
        );
      } else if (filterType === "new") {
        return (
          new Date(a.appointmentDateByPatient).getTime() -
          new Date(b.appointmentDateByPatient).getTime()
        );
      }
      return 0;
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

  // Tạo ca khám
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const payload = {
        patientId: selectedAppointment?._id,
        appointmentDate: new Date(),
        reason,
        specialization: selectedAppointment?.specialization,
      };

      // Kafka xử lý
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/appointments`,
        payload
      );

      // Xoá Data khỏi appointmentsByPatient
      const response2 = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/appointmentsByPatient/?_id=${selectedAppointment?._id}`
      );
      // Fetch lại data
      fetchData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Thất bại!",
        description: error + "",
      });
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
      setReason("");
      toast({
        variant: "default",
        title: "Thành công!",
        description: "Hệ thống đang xử lý ca khám!",
      });
    }
  };

  const renderBadge = (doctorId: string, reExamination: boolean) => {
    if (doctorId && !reExamination) {
      return (
        <Badge className="bg-green-600 dark:text-white hover:bg-green-700">
          Đặt lịch theo Bác sĩ
        </Badge>
      );
    } else if (reExamination) {
      return (
        <Badge className="bg-yellow-600 dark:text-white hover:bg-yellow-700">
          Tái khám
        </Badge>
      );
    } else
      return (
        <Badge className="bg-blue-600 dark:text-white hover:bg-blue-700">
          Đặt lịch theo ngày
        </Badge>
      );
  };
  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%]">
      <p className="text-base font-semibold text-blue-500">
        DANH SÁCH BỆNH NHÂN ĐÃ ĐĂNG KÝ HẸN KHÁM TRÊN WEB
      </p>
      <div className="flex flex-row gap-3">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Nhập mã hoặc tên bệnh nhân..."
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
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {filteredAppointments.map((appointment) => (
          <Card
            key={appointment._id + ""}
            className="flex flex-col gap-6 items-center p-4 bg-primary-foreground"
          >
            <div className="flex flex-row gap-4 items-center w-full self-start">
              {appointment.gender.toLowerCase() === "male" ||
              appointment.gender.toLowerCase() === "nam" ? (
                <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center border-2 border-blue-500 bg-blue-200">
                  <Dog className="text-blue-500" />
                </div>
              ) : (
                <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center border-2 border-pink-500 bg-pink-200">
                  <Cat className="text-pink-500" />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <p className="text-sm">
                  <span className="font-semibold">Tên bệnh nhân: </span>
                  <span className="text-muted-foreground">
                    {appointment.fullName}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Mã bệnh nhân: </span>
                  <span className="text-muted-foreground">
                    {appointment.patientId}
                  </span>
                </p>
              </div>
            </div>
            <Separator></Separator>
            <div className="flex flex-row gap-2 w-full flex-wrap">
              {renderBadge(appointment.doctorId, appointment.reExamination)}
              <Badge className="bg-slate-500 dark:bg-slate-700 dark:text-white">
                Khoa: {renderSpecialty(appointment.specialization)}
              </Badge>
              <Badge className="bg-slate-500 dark:bg-slate-700 dark:text-white">
                {appointment.reExamination
                  ? "Ngày tái khám: "
                  : "Ngày đăng ký: "}
                {formatDate(appointment?.appointmentDateByPatient)}
              </Badge>
              {!appointment.doctorId || appointment.reExamination ? null : (
                <Badge className="bg-slate-500 dark:bg-slate-700 dark:text-white">
                  Ca khám:{" "}
                  {generateExamination(
                    formatDate3(appointment?.appointmentDateByPatient)
                  )}
                </Badge>
              )}
            </div>
            <div className="flex flex-row gap-2 mt-4 flex-grow">
              <Button
                className="self-end w-fit bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600"
                onClick={() => handleCreateAppointment(appointment)}
              >
                Tạo ca khám
                <CalendarIcon className="mr-2 h-4 w-4" />
              </Button>
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
                Mã bệnh nhân: {selectedAppointment?.patientId}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 space-x-4 border rounded-md p-4 mr-4">
            <div className="flex flex-col gap-3">
              <h3 className="text-md font-semibold">Thông tin bệnh nhân</h3>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm">
                  Ngày sinh: {formatDate(selectedAppointment?.dateOfBirth)}
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
                  Địa chỉ: {selectedAppointment?.address}
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
              {selectedAppointment?.doctorId ? (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">
                    Bác sĩ: {selectedAppointment?.doctorId}
                  </span>
                </div>
              ) : (
                ""
              )}

              <div className="flex items-center gap-2">
                <SquareActivity className="w-4 h-4 text-blue-500" />
                <span className="text-sm">
                  Chuyên khoa:{" "}
                  {renderSpecialty(selectedAppointment?.specialization + "")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm">
                  {selectedAppointment?.reExamination
                    ? "Ngày tái khám: "
                    : "Ngày đăng ký: "}
                  {formatDate(selectedAppointment?.appointmentDateByPatient)}
                </span>
              </div>
              {!selectedAppointment?.doctorId ||
              selectedAppointment?.reExamination ? null : (
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">
                    Ca khám:{" "}
                    {generateExamination(
                      formatDate3(selectedAppointment?.appointmentDateByPatient)
                    )}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Trạng thái: Đang chờ duyệt</span>
              </div>
            </div>
          </div>
          <h3 className="text-md font-semibold">
            Vui lòng nhập lý do hẹn khám
          </h3>
          <div className="mr-4">
            <Input
              disabled={selectedAppointment?.reExamination}
              id="reason"
              value={selectedAppointment?.reason || reason}
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
            <Button
              variant="destructive"
              onClick={() => {
                setIsDialogOpen(false);
                setReason("");
              }}
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
                  <CalendarIcon className="mr-2 h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

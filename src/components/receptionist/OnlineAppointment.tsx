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
  RotateCcw,
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
  renderPriceBySpeAndService,
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
import Image from "next/image";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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
  const [selectedService, setSelectedService] = useState("");
  const serviceName = [
    "Khám tổng quát",
    "Khám sức khỏe định kỳ",
    "Khám chuyên khoa",
    "Gói khám sức khỏe toàn diện",
    "Khám chẩn đoán hình ảnh",
  ];

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
    const newApmts = response.data.filter((item: AppointmentByPatient) => {
      return (
        new Date(item.appointmentDateByPatient) > new Date() ||
        formatDate(item.appointmentDateByPatient) === formatDate(new Date())
      );
    });
    setAppointmentByPatient(newApmts);
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
        patientId: selectedAppointment?.patientId,
        appointmentDate: selectedAppointment?.appointmentDateByPatient,
        reason,
        specialization: selectedAppointment?.specialization,
      };

      // Xuất hoá đơn
      await exportToPDF();

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
        <Badge className="bg-green-600 dark:text-slate-300 hover:bg-green-700">
          Đặt lịch theo Bác sĩ
        </Badge>
      );
    } else if (reExamination) {
      return (
        <Badge className="bg-yellow-600 dark:text-slate-300 hover:bg-yellow-700">
          Tái khám
        </Badge>
      );
    } else
      return (
        <Badge className="bg-blue-600 dark:text-slate-300 hover:bg-blue-700">
          Đặt lịch theo ngày
        </Badge>
      );
  };

  const exportToPDF = async () => {
    try {
      const input = document.getElementById("preview");
      if (!input) throw new Error("Preview element not found");

      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("portrait");
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(
        `${
          selectedAppointment?.patientId +
          formatDate(selectedAppointment?.appointmentDateByPatient)
        }.pdf`
      );
    } catch (err) {
      console.error(err);
    }
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
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Lọc theo ngày" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="today">
              Hôm nay ({formatDate(new Date())})
            </SelectItem>
            <SelectItem value="new">Gần nhất</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={fetchData}>
          <RotateCcw className="h-4 w-4" />
        </Button>
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
                <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center border border-blue-500 bg-blue-200">
                  <Dog className="text-blue-500" />
                </div>
              ) : (
                <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center border border-pink-500 bg-pink-200">
                  <Cat className="text-pink-500" />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <p className="text-sm">
                  <span className="font-semibold text-sm text-slate-600 dark:text-slate-300">
                    Tên bệnh nhân:{" "}
                  </span>
                  <span className="text-slate-600 dark:text-slate-300">
                    {appointment.fullName}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-sm text-slate-600 dark:text-slate-300">
                    Mã bệnh nhân:{" "}
                  </span>
                  <span className="text-slate-600 dark:text-slate-300">
                    {appointment.patientId}
                  </span>
                </p>
              </div>
            </div>
            <Separator></Separator>
            <div className="flex flex-row gap-2 w-full flex-wrap">
              {renderBadge(appointment.doctorId, appointment.reExamination)}
              <Badge className="bg-slate-500 dark:bg-slate-700 dark:text-slate-300">
                Khoa: {renderSpecialty(appointment.specialization)}
              </Badge>
              <Badge className="bg-slate-500 dark:bg-slate-700 dark:text-slate-300">
                {appointment.reExamination
                  ? "Ngày tái khám: "
                  : "Ngày đăng ký: "}
                {formatDate(appointment?.appointmentDateByPatient)}
              </Badge>
              {!appointment.doctorId || appointment.reExamination ? null : (
                <Badge className="bg-slate-500 dark:bg-slate-700 dark:text-slate-300">
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
          <div className="flex items-center space-x-4 border rounded-md p-4 mr-4 bg-primary-foreground">
            {selectedAppointment?.gender?.toLowerCase() === "male" ? (
              <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center border border-blue-500 bg-blue-200">
                <Dog className="text-blue-500" />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center border border-pink-500 bg-pink-200">
                <Cat className="text-pink-500" />
              </div>
            )}
            <div>
              <p className="text-base font-semibold text-slate-600 dark:text-slate-300">
                {selectedAppointment?.fullName}
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Mã bệnh nhân: {selectedAppointment?.patientId}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 space-x-4 border rounded-md p-4 mr-4 text-slate-600 dark:text-slate-300 bg-primary-foreground">
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
          <div className="mr-4">
            {selectedAppointment?.appointmentDateByPatient ? (
              <div className="w-full p-4 bg-primary-foreground rounded-md border border-blue-300 dark:border-secondary">
                <p className="text-blue-500 text-base">
                  Bệnh nhân đến sớm so với lịch đăng ký{" "}
                  {getHoursBetweenDates(
                    selectedAppointment.appointmentDateByPatient
                  )}{" "}
                  giờ.
                </p>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 mr-4">
            <div className="flex flex-col gap-3">
              <h3 className="text-md font-semibold text-slate-600 dark:text-slate-300">
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
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-md font-semibold text-slate-600 dark:text-slate-300">
                Chọn loại dịch vụ khám
              </h3>
              <Select onValueChange={setSelectedService}>
                <SelectTrigger className="w-full text-slate-600 dark:text-slate-300">
                  <SelectValue placeholder="Chọn loại dịch vụ khám" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Khám tổng quát</SelectItem>
                  <SelectItem value="1">Khám sức khỏe định kỳ</SelectItem>
                  <SelectItem value="2">Khám chuyên khoa</SelectItem>
                  <SelectItem value="3">Gói khám sức khỏe toàn diện</SelectItem>
                  <SelectItem value="4">Khám chẩn đoán hình ảnh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className={selectedService !== "" ? "mr-4 border" : "hidden"}>
            <div
              id="preview"
              className="p-6 m-4 my-6 dark:bg-white dark:text-slate-950 rounded-md"
            >
              <div className="border border-black">
                <div className="flex flex-row items-start justify-between h-full my-4 px-5">
                  <div className="w-32 h-32 relative z-0 rounded-full border-2 border-blue-500">
                    <Image
                      src="https://res.cloudinary.com/drqbhj6ft/image/upload/v1726685609/learning-webdev-blog/clinic/medical-care-logo-icon-design-vector-22560842_j6xhlk.jpg"
                      alt="logo-image"
                      className="object-cover rounded-full"
                      layout="fill"
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-2xl font-bold font-['Times_New_Roman',_Times,_serif]">
                      HÓA ĐƠN GIÁ TRỊ GIA TĂNG
                    </p>
                    <p className="text-2xl font-['Times_New_Roman',_Times,_serif] italic">
                      (VAT INVOICE)
                    </p>
                    <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                      Bản thể hiện của hoá đơn điện tử
                    </p>
                    <p className="text-base italic font-['Times_New_Roman',_Times,_serif]">
                      (Electric invoice display)
                    </p>
                    <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                      Ngày: {formatDate(new Date())}
                    </p>
                  </div>
                  <div>
                    <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                      Ký hiệu (Serial):
                    </p>
                    <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                      Số (No.):
                    </p>
                  </div>
                </div>
                <p className="text-2xl text-center font-bold font-['Times_New_Roman',_Times,_serif] mb-4">
                  HOÁ ĐƠN KHÁM BỆNH
                </p>
                <Separator className="bg-slate-950"></Separator>
                <div className="p-4 flex flex-col gap-2">
                  <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                    Đơn vị bán hàng (Seller): CÔNG TY TRÁCH NHIỆM HỮU HẠN LAMAN
                    CLINIC
                  </p>
                  <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                    Mã số thuế (Tax code): 330187899
                  </p>
                  <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                    Địa chỉ (Address): 2012 Phạm Huy Thông, Phường 17, Gò Vấp,
                    T.P Hồ Chí Minh
                  </p>
                  <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                    Điện thoại (Tel): 098765674323
                  </p>
                  <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                    Số tài khoản (Account No.): 179232999
                  </p>
                  <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                    Ngân hàng (Bank): Ngân hàng BIDV Đầu tư và Phát triển Việt
                    Nam
                  </p>
                </div>
                <Separator className="bg-slate-950"></Separator>
                <div className="p-4 flex flex-col gap-2">
                  <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                    Mã bệnh nhân (Patient Id): {selectedAppointment?.patientId}
                  </p>
                  <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                    Tên bệnh nhân (Patient): {selectedAppointment?.fullName}
                  </p>
                  <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                    Số điện thoại (Phone): {selectedAppointment?.phone}
                  </p>
                  <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                    Địa chỉ (Address): {selectedAppointment?.address}
                  </p>
                  <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                    Hình thức thanh toán: Chuyển khoản/Tiền mặt
                  </p>
                </div>
                <Separator className="bg-slate-950"></Separator>
                <div className="p-4 flex flex-col gap-2">
                  <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                    Mã bác sĩ (Doctor): {selectedAppointment?.doctorId}
                  </p>
                  <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                    Chuyên khoa (Specialization):{" "}
                    {renderSpecialty(selectedAppointment?.specialization + "")}
                  </p>
                  <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                    Ca khám (Examination):{" "}
                    {generateExamination(
                      formatDate3(selectedAppointment?.appointmentDateByPatient)
                    )}
                  </p>
                  <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                    Lý do khám (Reason): {reason}
                  </p>
                </div>
                <Separator className="bg-slate-950"></Separator>
                <Table>
                  <TableHeader>
                    <TableRow className="pointer-events-none">
                      <TableHead className="text-black dark:text-black">
                        Chuyên khoa
                      </TableHead>
                      <TableHead className="text-black dark:text-black">
                        Loại dịch vụ
                      </TableHead>
                      <TableHead className="text-black dark:text-black">
                        Đơn giá (VNĐ)
                      </TableHead>
                      <TableHead className="text-black dark:text-black">
                        Bảo hiểm y tế
                      </TableHead>
                      <TableHead className="text-black dark:text-black">
                        Thành tiền (VNĐ)
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="pointer-events-none">
                      <TableHead className="text-black dark:text-black">
                        {" "}
                        {renderSpecialty(
                          selectedAppointment?.specialization + ""
                        )}
                      </TableHead>
                      <TableHead className="text-black dark:text-black">
                        {" "}
                        {serviceName[parseInt(selectedService)]}
                      </TableHead>
                      <TableHead className="text-black dark:text-black">
                        {renderPriceBySpeAndService(
                          selectedAppointment?.specialization + "",
                          parseInt(selectedService)
                        ).toLocaleString("vi-VN")}
                      </TableHead>
                      <TableHead className="text-black dark:text-black">
                        Không
                      </TableHead>
                      <TableHead className="text-black dark:text-black">
                        {renderPriceBySpeAndService(
                          selectedAppointment?.specialization + "",
                          parseInt(selectedService)
                        ).toLocaleString("vi-VN")}
                      </TableHead>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
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

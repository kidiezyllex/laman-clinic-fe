"use client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  format,
  addDays,
  startOfWeek,
  isSameDay,
  parseISO,
  subMonths,
  addMonths,
} from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Cat,
  ChevronLeft,
  ChevronRight,
  Dog,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "../ui/separator";
import { usePathname } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { medicationData } from "./medicationData";
interface MedicalHistory {
  _id: string;
  disease: string;
  diagnosisDate: string;
  treatment: string;
}

interface Appointment {
  patientId: string;
  appointmentDate: string;
  reason: string;
  specialization: string;
  email: string;
  fullName: string;
  gender: string;
  phone: string;
  medicalHistory: MedicalHistory[];
}

interface MedicationRow {
  id: number;
  medicationName: string;
  dose: string;
  quantity: number;
  instructions: string;
}

const formatDate = (dateString: string) => {
  return format(parseISO(dateString), "dd/MM/yyyy");
};
const medicationSchema = z.object({
  medicationName: z.string().min(1, "Vui lòng chọn thuốc"),
  dose: z.string().min(1, "Liều lượng không được để trống"),
  quantity: z.coerce.number().min(1, "Số lượng phải lớn hơn 0"),
  instructions: z.string().optional(),
});

const formSchema = z.object({
  medications: z.array(medicationSchema),
});
export default function ViewAppointment() {
  // built-in functions
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medications: [
        { medicationName: "", dose: "", quantity: 0, instructions: "" },
      ],
    },
  });
  // state
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("Week");
  const [rows, setRows] = useState<MedicationRow[]>([
    { id: 1, medicationName: "", dose: "", quantity: 0, instructions: "" },
  ]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const currentEmail = localStorage.getItem("currentEmail");
  const [isLoading, setIsLoading] = useState(false);
  // Toggle Form tạo đơn thuốc
  const handleCanclePrescription = () => {
    setRows([
      { id: 1, medicationName: "", dose: "", quantity: 0, instructions: "" },
    ]);
    setShowPrescriptionForm(!showPrescriptionForm);
  };

  // Thêm 1 row
  const addRow = () => {
    const newRow: MedicationRow = {
      id: rows.length + 1,
      medicationName: "",
      dose: "",
      quantity: 0,
      instructions: "",
    };
    setRows([...rows, newRow]);
  };

  // Cập nhật row
  const updateRow = (
    id: number,
    field: keyof MedicationRow,
    value: string | number
  ) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handlePreviousWeek = () => setCurrentDate(addDays(currentDate, -7));
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));

  // Fill value trên các row
  const handleSelectMedicationName = (value: string, rowId: number) => {
    const findMedication = medicationData.find(
      (item) => item.medicationName === value
    );
    setRows(
      rows.map((row) =>
        row.id === rowId ? { ...row, ...findMedication } : row
      )
    );
  };

  // Toggle chi tiết lịch hẹn
  const openAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsOpen(true);
  };

  // Fecth data Appointments đã được lễ tân duyệt
  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/queue/000`
      );

      const data = await response.json();
      setAppointments(data.data);

      // thay sampleData bằng data.data
      // const sampleData = [
      //   {
      //     patientId: "BN-JCXX2B",
      //     appointmentDate: "2024-10-18T18:55:05.587Z",
      //     reason: "benh xxx",
      //     specialization: "Cardiology",
      //   },
      //   {
      //     patientId: "BN-JCXX2B",
      //     appointmentDate: "2024-10-18T18:54:06.403Z",
      //     reason: "benh ho",
      //     specialization: "Cardiology",
      //   },
      // ];
      const newAppointments = await Promise.all(
        data.data.map(async (appointment: Appointment) => {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/?_id=${appointment.patientId}`
          );
          const patientData = response.data[0];
          return { ...appointment, ...patientData };
        })
      );

      setAppointments(newAppointments);
    };

    fetchAppointments();
    // getData Bác sĩ, nếu room khác mặc định thì set True
    setIsOpen2(false);
  }, []);

  // Tạo đơn thuốc
  const handleCreatePrescription = async () => {
    try {
      setIsLoading(true);
      // Lấy data bác sĩ
      const response2 = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/?email=${currentEmail}`
      );
      const doctorData = response2.data[0];
      const payload = {
        patientId: selectedAppointment?.patientId,
        doctorId: doctorData._id,
        medications: rows,
        dateIssued: new Date(),
      };
      // console.log(payload);
      const response3 = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/create-prescription`,
        payload
      );
      // console.log("hello");
    } catch (error) {
      console.error("Error during sign in:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%]">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <Select
            value={format(currentDate, "MMMM yyyy")}
            onValueChange={(value) => setCurrentDate(new Date(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value={format(subMonths(currentDate, 1), "MMMM yyyy")}
              >
                {format(subMonths(currentDate, 1), "MMMM yyyy")}
              </SelectItem>
              <SelectItem value={format(currentDate, "MMMM yyyy")}>
                {format(currentDate, "MMMM yyyy")}
              </SelectItem>
              <SelectItem
                value={format(addMonths(currentDate, 1), "MMMM yyyy")}
              >
                {format(addMonths(currentDate, 1), "MMMM yyyy")}
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="flex space-x-1">
            <Button
              variant={view === "today" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Hôm nay
            </Button>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="border rounded-md h-full ">
        <div className="inline-block min-w-full h-full">
          <div className="w-full grid grid-cols-7 h-full">
            {days.map((day, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 border-r-2"
                onClick={() => {
                  console.log("");
                }}
              >
                <div className="flex flex-row gap-2 items-center justify-center h-20 border-b-2">
                  <div className="font-semibold">{format(day, "EEE")}</div>
                  <div
                    className={`w-8 h-6 flex justify-center items-center rounded-md ${isSameDay(day, new Date())
                      ? "bg-blue-500 text-white"
                      : "text-foreground"
                      }`}
                  >
                    <p className="text-sm">{format(day, "d")}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 p-2 ">
                  {appointments
                    .filter((appointment) =>
                      isSameDay(
                        parseISO((appointment as any).appointmentDate),
                        day
                      )
                    )
                    .map((appointment) => (
                      <div
                        key={appointment.patientId}
                        className="rounded-sm border p-2 flex flex-col gap-2 items-center bg-secondary cursor-pointer"
                        onClick={() => openAppointmentDetails(appointment)}
                      >
                        {appointment.gender === "Male" ? (
                          <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-blue-200">
                            <Dog className="text-blue-500" />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-pink-200">
                            <Cat className="text-pink-500" />
                          </div>
                        )}
                        <p className="text-xs font-semibold text-center">
                          {appointment.fullName}
                        </p>
                        <p className="text-xs font-semibold text-center text-slate-500">
                          Lý do: {appointment.reason}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[900px] w-[90%] h-[90%] overflow-y-auto">
          {selectedAppointment && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                {selectedAppointment.gender.toLowerCase() === "male" ? (
                  <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-blue-200">
                    <Dog className="text-blue-500" />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-pink-200">
                    <Cat className="text-pink-500" />
                  </div>
                )}
                <h2 className="text-md font-semibold">
                  {selectedAppointment.fullName}
                </h2>
              </div>
              <Separator />
              <div className="grid md:grid-cols-2 mb-2">
                <div className="grid gap-3">
                  <h3 className="text-md font-semibold">Thông tin bệnh nhân</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Ngày sinh:
                      {/* {formatDate(selectedAppointment.dateOfBirth)} */}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Giới tính:{" "}
                      {selectedAppointment.gender.toLowerCase() === "female"
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
                      Số ĐT: {selectedAppointment.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Email: {selectedAppointment.email}
                    </span>
                  </div>
                </div>
                <div className="grid gap-3">
                  <p className="text-md font-semibold">Thông tin lịch hẹn</p>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-5 text-blue-500" />
                      <span className="text-sm">
                        Ngày hẹn khám:{" "}
                        {formatDate(selectedAppointment.appointmentDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-5 text-blue-500" />
                      <span className="text-sm">
                        Lý do khám: {selectedAppointment.reason}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-5 text-blue-500" />
                      <span className="text-sm">Trạng thái: Đang chờ khám</span>
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="grid gap-3">
                <h3 className="text-md font-semibold">Lịch sử khám bệnh</h3>
                {selectedAppointment.medicalHistory.length === 0 ? (
                  <p className="text-slate-500 text-sm">
                    Chưa có lịch sử khám bệnh
                  </p>
                ) : (
                  selectedAppointment.medicalHistory.map((history) => (
                    <div key={history._id} className="grid gap-3">
                      <span className="text-sm">
                        Disease: {history.disease}
                      </span>
                      <span className="text-sm">
                        Diagnosis Date: {formatDate(history.diagnosisDate)}
                      </span>
                      <span className="text-sm">
                        Treatment: {history.treatment}
                      </span>
                    </div>
                  ))
                )}
              </div>
              {showPrescriptionForm && (
                <div className="">
                  <h3 className="text-md font-semibold mb-4">Tạo đơn thuốc</h3>
                  <Form {...form}>
                    <form className="space-y-4">
                      <div className="grid grid-cols-4 gap-4 font-medium border p-3 rounded-md">
                        <Label className="align-middle text-center">
                          Tên thuốc
                        </Label>
                        <Label className="align-middle text-center">
                          Liều lượng
                        </Label>
                        <Label className="align-middle text-center">
                          Số lượng
                        </Label>
                        <Label className="align-middle text-center">
                          Hướng dẫn
                        </Label>
                      </div>
                      {rows.map((row) => (
                        <div key={row.id} className="grid grid-cols-4 gap-4">
                          <Select
                            onValueChange={(value) => {
                              handleSelectMedicationName(value, row.id);
                            }}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn tên thuốc" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {medicationData.map((medication, index) => (
                                <SelectItem
                                  key={medication.medicationName}
                                  value={medication.medicationName}
                                >
                                  {medication.medicationName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            value={row.dose}
                            onChange={(e) =>
                              updateRow(row.id, "dose", e.target.value)
                            }
                            placeholder="Liều lượng"
                          />
                          <Input
                            type="number"
                            value={row.quantity}
                            onChange={(e) =>
                              updateRow(
                                row.id,
                                "quantity",
                                parseInt(e.target.value)
                              )
                            }
                            placeholder="Số lượng"
                          />
                          <Textarea
                            value={row.instructions}
                            onChange={(e) =>
                              updateRow(row.id, "instructions", e.target.value)
                            }
                            placeholder="Hướng dẫn (có thể bỏ trống)"
                          />
                        </div>
                      ))}
                    </form>
                  </Form>
                </div>
              )}
              <div className="flex flex-row gap-3 justify-end items-end flex-grow mt-8">
                {showPrescriptionForm ? (
                  <div className="flex flex-row gap-4 w-full justify-end">
                    <Button
                      type="button"
                      onClick={addRow}
                      variant="outline"
                      className="self-start"
                    >
                      Thêm dòng
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleCanclePrescription()}
                    >
                      Huỷ đơn thuốc
                    </Button>
                    <Button
                      onClick={() => handleCreatePrescription()}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        "Tạo đơn thuốc"
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-row gap-4">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setShowPrescriptionForm(!showPrescriptionForm)
                      }
                    >
                      Tạo đơn thuốc
                    </Button>
                    <Button variant="secondary">Hoàn thành khám</Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isOpen2} onOpenChange={setIsOpen2}>
        <DialogContent className="max-w-[900px] w-[50%] h-fit">
          <form className="w-2/3 space-y-6">
            {/* <FormField
                control={form.control}
                name="roomNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vui lòng nhập số phòng</FormLabel>
                    <FormControl>
                      <Input placeholder="Ví dụ: 024, 210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            <Button type="submit">Cập nhật</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

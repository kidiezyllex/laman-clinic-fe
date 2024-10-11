"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { format, addDays, startOfWeek, isSameDay, parseISO } from "date-fns";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "../ui/separator";
import { usePathname } from "next/navigation";

interface MedicalHistory {
  _id: string;
  disease: string;
  diagnosisDate: string;
  treatment: string;
}

interface Patient {
  _id: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  medicalHistory: MedicalHistory[];
}

interface Appointment {
  _id: string;
  patientId: Patient;
  appointmentDate: string;
  reason: string;
  status: string;
}

const FormSchema = z.object({
  roomNumber: z
    .string()
    .regex(/^\d+$/, { message: "Chỉ được nhập số." }) // Chỉ cho phép số
    .min(3, { message: "Room number phải có ít nhất 3 ký tự." }) // Tối thiểu 3 ký tự
    .max(3, { message: "Room number chỉ được tối đa 3 ký tự." }), // Tối đa 3 ký tự
});

export default function ViewAppointment() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      roomNumber: "000",
    },
  });
  const doctorId = usePathname().split("/")[1];
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/${doctorId}`,
      {
        roomNumber: data.roomNumber,
      }
    );
    toast({
      title: "Thành công!",
      description: "Đã cập nhật số phòng!",
    });
    setIsOpen2(false);
  }

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("Week");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(true);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "dd/MM/yyyy");
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/queue/000`
        );
        console.log(response.data);
        // const response = await fetch(
        //   "https://8705-171-252-188-90.ngrok-free.app/queue/000",
        //   {
        //     method: "GET",
        //     headers: {
        //       "Content-Type": "application/json", // Thiết lập Content-Type nếu cần
        //     },
        //   }
        // );

        const data = await response.json();
        console.log(response);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error:", error.response?.data || error.message);
        } else {
          console.error("An unexpected error occurred:", error);
        }
      }
    };

    fetchAppointments();
  }, []);

  const handlePreviousWeek = () => setCurrentDate(addDays(currentDate, -7));
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));

  const openAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsOpen(true);
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
              <SelectItem value="September 2024">September 2024</SelectItem>
              <SelectItem value="October 2024">October 2024</SelectItem>
              <SelectItem value="November 2024">November 2024</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex space-x-1">
            <Button
              variant={view === "Day" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setView("Day")}
            >
              Day
            </Button>
            <Button
              variant={view === "Week" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setView("Week")}
            >
              Week
            </Button>
            <Button
              variant={view === "Month" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setView("Month")}
            >
              Month
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
      <div className="border rounded-md h-full">
        <div className="inline-block min-w-full h-full">
          <div className="w-full grid grid-cols-7 h-full">
            {days.map((day, index) => (
              <div key={index} className="flex flex-col gap-2 border-r-2">
                <div className="flex flex-row gap-2 items-center justify-center h-20 border-b-2">
                  <div className="font-semibold">{format(day, "EEE")}</div>
                  <div
                    className={`w-8 h-6 flex justify-center items-center rounded-md ${
                      isSameDay(day, currentDate)
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
                        key={appointment._id}
                        className="rounded-sm border p-2 flex flex-col gap-2 items-center bg-secondary cursor-pointer"
                        onClick={() => openAppointmentDetails(appointment)}
                      >
                        <div className="h-10 w-10 bg-primary-foreground rounded-full flex flex-row items-center justify-center">
                          <User className="text-blue-500 h-6 w-6" />
                        </div>
                        <p className="text-xs font-semibold">
                          {appointment.patientId.fullName}
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
        <DialogContent className="max-w-[900px] w-[90%] h-[90%]">
          {selectedAppointment && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full"></div>
                <h2 className="text-md font-semibold">
                  {selectedAppointment.patientId.fullName}
                </h2>
              </div>
              <Separator></Separator>
              <div className="grid md:grid-cols-2 mb-2">
                <div className="grid gap-3">
                  <h3 className="text-md font-semibold">Thông tin lịch hẹn</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Ngày sinh:{" "}
                      {formatDate(selectedAppointment.patientId.dateOfBirth)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Gender: {selectedAppointment.patientId.gender}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Address: {selectedAppointment.patientId.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Phone: {selectedAppointment.patientId.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Email: {selectedAppointment.patientId.email}
                    </span>
                  </div>
                </div>
                <div className="grid gap-3">
                  <h3 className="text-md font-semibold">Thông tin lịch hẹn</h3>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-5 text-blue-500" />
                      <span className="text-sm">
                        Date: {formatDate(selectedAppointment.appointmentDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-5 text-blue-500" />
                      <span className="text-sm">
                        Time:{" "}
                        {format(
                          parseISO(selectedAppointment.appointmentDate),
                          "HH:mm"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-5 text-blue-500" />
                      <span className="text-sm">
                        Reason: {selectedAppointment.reason}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-5 text-blue-500" />
                      <span className="text-sm">
                        Status: {selectedAppointment.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Separator></Separator>
              <div className="grid gap-3">
                <h3 className="text-md font-semibold">Lịch sử khám bệnh</h3>
                {selectedAppointment.patientId.medicalHistory.map((history) => (
                  <div key={history._id} className="grid gap-3">
                    <span className="text-sm">Disease: {history.disease}</span>
                    <span className="text-sm">
                      Diagnosis Date: {formatDate(history.diagnosisDate)}
                    </span>
                    <span className="text-sm">
                      Treatment: {history.treatment}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isOpen2} onOpenChange={setIsOpen2}>
        <DialogContent className="max-w-[900px] w-[50%] h-fit">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-6"
            >
              <FormField
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
              />
              <Button type="submit">Cập nhật</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

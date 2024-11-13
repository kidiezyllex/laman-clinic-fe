"use client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  format,
  addDays,
  startOfWeek,
  isSameDay,
  parseISO,
  subMonths,
  addMonths,
} from "date-fns";
import { Cat, ChevronLeft, ChevronRight, Dog, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { labTestsData } from "../../../lib/hardcoded-data";
import { usePathname } from "next/navigation";
import { Appointment, Doctor } from "../../../lib/entity-types";
import PatientDetails from "./PatientDetails";

export default function ViewAppointment({
  roomNumber,
}: {
  roomNumber: string;
}) {
  const { toast } = useToast();
  // state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const [selectedTests, setSelectedTests] = useState<number[]>([]);
  const [testType, setTestType] = useState<string[]>([]);
  const handlePreviousWeek = () => setCurrentDate(addDays(currentDate, -7));
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const pathname = usePathname();
  const doctorId = pathname.split("/")[1];
  // Chi tiết lịch hẹn
  const openAppointmentDetails = async (appointment: Appointment) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/${appointment.patientId}`
    );
    setSelectedAppointment({ ...response.data, ...appointment });
    setIsOpen(true);
  };

  useEffect(() => {
    const selectedTestNames = labTestsData
      .filter((test) => selectedTests.includes(test._id))
      .map((test) => test.testName);
    setTestType(selectedTestNames);
  }, [selectedTests]);
  // Fecth Data
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Lấy roomN của bác sĩ trong data
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/${doctorId}`
        );
        const roomN = response.data.roomNumber;
        if (roomN.toString().trim() !== "000") {
          // const response = await axios.get(
          //   `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/get-appointments/${roomN}`
          // );
          setAppointments([
            {
              patientId: "BN-5C662W",
              appointmentDate: "2024-11-13T02:00:00.000Z",
              reason: "Kiểm tra định kỳ",
              status: "Scheduled",
              specialization: "Cardiology",
              priority: false,
              _id: "CH-K4E64V",
            },
          ]);
          // setAppointments(response.data);
        } else {
          setAppointments([]);
        }
      } catch (err) {
        console.log(err + "");
      }
    };

    fetchAppointments();
  }, [roomNumber]);
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
              variant={"outline"}
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
      <div className="border rounded-md h-full">
        <div className="inline-block min-w-full h-full">
          <div className="w-full grid grid-cols-7 h-full">
            {days.map((day, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 border-r-2 last:border-r-0"
              >
                <div className="flex flex-row gap-2 items-center justify-center h-20 border-b-2">
                  <div className="font-semibold text-sm">
                    {Intl.DateTimeFormat("vi-VN", { weekday: "short" }).format(
                      day
                    )}
                  </div>
                  <div
                    className={`w-8 h-6 flex justify-center items-center rounded-md ${
                      isSameDay(day, new Date())
                        ? "bg-blue-500 text-white"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    <p className="text-sm">{format(day, "d")}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 p-2 ">
                  {appointments.length !== 0 &&
                    appointments
                      ?.filter((appointment) =>
                        isSameDay(
                          parseISO((appointment as any)?.appointmentDate),
                          day
                        )
                      )
                      .map((appointment, index) => (
                        <div
                          key={(appointment as any).patientId + index}
                          className="rounded-sm border border-slate-400 p-2 flex flex-col gap-2 items-center bg-secondary cursor-pointer"
                          onClick={() => openAppointmentDetails(appointment)}
                        >
                          <div className="h-12 w-12 border border-slate-400 rounded-full flex flex-row justify-center items-center bg-slate-200">
                            <User className="text-slate-500" />
                          </div>
                          <p className="text-xs font-semibold text-center">
                            {appointment.patientId}
                          </p>
                          <p className="text-xs font-semibold text-center text-slate-700 dark:text-slate-400">
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
      {/* Dialog chi tiết bệnh nhân */}
      <PatientDetails
        roomNumber={roomNumber}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selectedAppointment={selectedAppointment}
      />
    </div>
  );
}

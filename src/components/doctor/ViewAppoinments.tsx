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
import { ChevronLeft, ChevronRight, RefreshCw, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { usePathname } from "next/navigation";
import { Appointment, Doctor, TestType } from "../../../lib/entity-types";
import PatientDetails from "./patient-details/PatientDetails";
import { formatDate } from "../../../lib/utils";
import { Badge } from "../ui/badge";
export default function ViewAppointment({
  roomNumber,
}: {
  roomNumber: string;
}) {
  const { toast } = useToast();
  // state
  const doctorId = usePathname().split("/")[1];
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const [selectedTests, setSelectedTests] = useState<String[]>([]);
  const [pendingTestList, setPendingTestList] = useState<String[]>([]);
  const [completedTestList, setCompletedTestList] = useState<String[]>([]);
  const [createdPresList, setCreatedPresList] = useState<String[]>([]);
  const [testType, setTestType] = useState<string[]>([]);
  const handlePreviousWeek = () => setCurrentDate(addDays(currentDate, -7));
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const [tests, setTests] = useState<TestType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Chi tiết lịch hẹn
  const openAppointmentDetails = async (appointment: Appointment) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/${appointment.patientId}`
    );
    setSelectedAppointment({ ...response.data, ...appointment });
    setIsOpen(true);
  };

  useEffect(() => {
    const selectedTestNames = tests
      .filter((test) => selectedTests.includes(test._id))
      .map((test) => test.testName);
    setTestType(selectedTestNames);
  }, [selectedTests]);

  // Fecth Data
  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      // Lấy roomN của bác sĩ trong data
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/${doctorId}`
      );
      const response2 = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test-types`
      );
      setTests(response2.data);
      const roomN = response.data.roomNumber;
      if (roomN.toString().trim() !== "000") {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/get-appointments/${roomN}`
        );
        setAppointments(response.data);

        // Lấy danh sách appointmentId đang chờ xét nghiệm
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/request-tests/check/?doctorId=${doctorId}`
        );
        setPendingTestList(res.data.appointmentIds);

        // Lấy danh sách appointmentId đã có kết quả xét nghiệm
        const res2 = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/tests/check/?doctorId=${doctorId}`
        );
        setCompletedTestList(res2.data.appointmentIds);

        // Lấy danh sách ID lịch hẹn theo ID bác sĩ
        const res3 = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/prescriptions/check/?doctorId=${doctorId}`
        );
        setCreatedPresList(res3.data);
        setIsLoading(false);
      } else {
        setAppointments([]);
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err + "");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [roomNumber]);

  const disabled = (appointments: any, appointment: any, index: number) => {
    let flag = false;
    // Nếu khác ngày hoặc index !==0 thì disable
    if (index !== 0) flag = true;
    //Nếu đang chờ xét nghiệm hoặc có kết quả XN thì enable
    if (
      pendingTestList.includes(appointment._id) ||
      completedTestList.includes(appointment._id)
    )
      flag = false;
    if (
      index - 1 >= 0 &&
      pendingTestList.includes(appointments[index - 1]?._id)
    )
      flag = false;
    if (
      index - 1 >= 0 &&
      completedTestList.includes(appointments[index - 1]?._id)
    )
      flag = false;
    if (
      formatDate(new Date(appointment?.appointmentDate)) !==
      formatDate(new Date())
    )
      flag = true;
    return flag;
  };
  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%]">
      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-row gap-3">
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
          <Button
            variant={"outline"}
            onClick={() => setCurrentDate(new Date())}
          >
            Hôm nay
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchAppointments}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
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
                  <div className="font-semibold text-sm text-slate-600 dark:text-slate-300">
                    {Intl.DateTimeFormat("vi-VN", { weekday: "short" }).format(
                      day
                    )}
                  </div>
                  <div
                    className={`w-8 h-6 flex justify-center items-center rounded-md ${
                      isSameDay(day, new Date())
                        ? "bg-blue-500 text-white"
                        : "bg-secondary text-slate-600 dark:text-slate-300"
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
                        <Button
                          disabled={disabled(appointments, appointment, index)}
                          key={(appointment as any).patientId + index}
                          variant={"outline"}
                          className="h-fit w-full flex flex-col gap-2 bg-secondary"
                          onClick={() => openAppointmentDetails(appointment)}
                        >
                          <div className="h-12 w-12 border border-blue-500  rounded-full flex flex-row justify-center items-center bg-blue-100">
                            <User className="text-blue-500" />
                          </div>
                          <p className="text-xs font-semibold text-center text-blue-500 dark:text-blue-500">
                            {appointment.patientId}
                          </p>
                          <p className="text-xs font-semibold text-center text-slate-600 dark:text-slate-300 break-words text-wrap">
                            Lý do: {appointment.reason}
                          </p>
                          {pendingTestList.includes(appointment._id) ? (
                            <Badge className="bg-yellow-600 dark:text-slate-300 hover:bg-yellow-700">
                              Đang chờ KQXN
                            </Badge>
                          ) : null}
                          {completedTestList.includes(appointment._id) ? (
                            <Badge className="bg-green-600 dark:text-slate-300 hover:bg-green-700">
                              Đã có KQXN
                            </Badge>
                          ) : null}
                          {createdPresList.includes(appointment._id) ? (
                            <Badge className="bg-green-600 dark:text-slate-300 hover:bg-green-700">
                              Đã tạo Đ.TH
                            </Badge>
                          ) : null}
                        </Button>
                      ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <PatientDetails
        roomNumber={roomNumber}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selectedAppointment={selectedAppointment}
        fetchAppointments={fetchAppointments}
        createdPresList={createdPresList}
        pendingTestList={pendingTestList}
      />
    </div>
  );
}

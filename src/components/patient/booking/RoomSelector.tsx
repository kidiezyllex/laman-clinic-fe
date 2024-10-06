"use client";

import {
  useState,
  useCallback,
  useEffect,
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Clock, FileCog, Stethoscope, User, Warehouse } from "lucide-react";
import ArrowButton from "@/components/animata/button/arrow-button";
export default function RoomSelector({
  setActiveSection,
  selectedSpe,
  selectedDate,
}: {
  setActiveSection: (section: string) => void;
  selectedSpe: number | null;
  selectedDate: Date;
}) {
  const [doctorsBySpecialization, setDoctorsBySpecialization] = useState<[]>(
    []
  );

  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await axios.get(
        `http://localhost:3000/doctors?specialization=${selectedSpe}`
      );
      // response.data.filter((item)=> {item.})
      const getDoctorsByDay = response.data.filter(
        (doctor: { schedule: any[] }) =>
          doctor.schedule.some(
            (schedule: { dayOfWeek: string }) =>
              schedule.dayOfWeek === getDayOfWeek(selectedDate)
          )
      );
      console.log(getDoctorsByDay);
      setDoctorsBySpecialization(getDoctorsByDay);
    };

    fetchDoctors();
  }, []);
  function generateTimeSlots(startTime: string, endTime: string) {
    const slots = [];
    let currentTime = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);

    while (currentTime < end) {
      const slotStart = currentTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      currentTime.setHours(currentTime.getHours() + 1);
      const slotEnd = currentTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      slots.push(`${slotStart} - ${slotEnd}`);
    }

    return slots;
  }

  function getDayOfWeek(date: Date) {
    switch (date.getUTCDay()) {
      case 6:
        return "Sunday";
      case 0:
        return "Monday";
      case 1:
        return "Tuesday";
      case 2:
        return "Wednesday";
      case 3:
        return "Thursday";
      case 4:
        return "Friday";
      case 5:
        return "Saturday";
      default:
        return "Invalid day";
    }
  }
  return (
    <div className="w-full flex flex-col gap-4">
      <p className="text-base font-semibold text-blue-500">
        DANH SÁCH PHÒNG KHÁM, BÁC SĨ, GIỜ KHÁM BẠN SẼ VÀO
      </p>
      <div className="w-full gap-4">
        {doctorsBySpecialization.map((doctor) => (
          <div
            key={(doctor as any)._id}
            className="overflow-hidden transition-shadow duration-300 rounded-md mb-4 bg-background border"
          >
            <div className="p-6">
              <div className="items-center mb-4 grid grid-cols-3">
                <div className="flex flex-row gap-3 items-center">
                  <Stethoscope className="w-6 h-6 text-blue-500" />
                  <p className="text-sm font-semibold">
                    Bác sĩ: {(doctor as any)?.fullName}
                  </p>
                </div>
                <div className="flex flex-row gap-3 items-center">
                  <Warehouse className="w-6 h-6 text-blue-500" />
                  <p className="text-sm font-semibold">
                    Phòng khám: {(doctor as any)?.roomNumber}
                  </p>
                </div>
                <div className="flex flex-row gap-3 items-center">
                  <FileCog className="w-6 h-6 text-blue-500" />
                  <p className="text-sm font-semibold">
                    Chuyên khoa: {(doctor as any)?.specialization}
                  </p>
                </div>
              </div>
              <div className="space-y-4 ">
                {(doctor as any).schedule.map(
                  (scheduleItem: {
                    _id: Key | null | undefined;
                    dayOfWeek:
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | ReactPortal
                      | Promise<AwaitedReactNode>
                      | null
                      | undefined;
                    startTime: string;
                    endTime: string;
                  }) => (
                    <div
                      key={scheduleItem._id}
                      className={
                        scheduleItem.dayOfWeek === getDayOfWeek(selectedDate)
                          ? "p-3 border-2 border-blue-500 "
                          : "p-3 border"
                      }
                    >
                      <h3 className="font-medium text-slate-500 mb-2 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <p className="text-sm"> {scheduleItem.dayOfWeek}</p>
                      </h3>
                      <div className="grid grid-cols-4 gap-2 ">
                        {generateTimeSlots(
                          scheduleItem.startTime,
                          scheduleItem.endTime
                        ).map((slot) => (
                          <Button key={slot} variant={"secondary"}>
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-between">
        <Button
          className="w-fit"
          onClick={() => {
            setActiveSection("specialtySelector");
          }}
          variant={"outline"}
        >
          Quay lại
        </Button>
        <ArrowButton
          className="w-fit"
          text={"Tiếp tục"}
          onClick={() => {
            setActiveSection("payment");
          }}
        ></ArrowButton>
      </div>
    </div>
  );
}

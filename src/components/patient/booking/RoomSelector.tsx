"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Clock, FileCog, Stethoscope, User } from "lucide-react";
import ArrowButton from "@/components/animata/button/arrow-button";
import { Schedule } from "../../../../lib/entity-types";
import {
  generateTimeSlots,
  getDayOfWeek,
  renderDayOfWeek,
  renderSpecialty,
} from "../../../../lib/utils";
export default function RoomSelector({
  setActiveSection,
  selectedSpe,
  selectedDate,
}: {
  setActiveSection: (section: string) => void;
  selectedSpe: number | null;
  selectedDate: Date | undefined;
}) {
  const [doctorsBySpecialization, setDoctorsBySpecialization] = useState<[]>(
    []
  );
  const [selectedDate2, setSelectedDate2] = useState<Date>(
    selectedDate || new Date()
  );
  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors?specialization=${selectedSpe}`
      );
      const getDoctorsByDay = selectedDate
        ? response.data.filter((doctor: { schedule: any[] }) =>
            doctor.schedule.some(
              (schedule: { dayOfWeek: string }) =>
                schedule.dayOfWeek === getDayOfWeek(selectedDate)
            )
          )
        : [];
      setDoctorsBySpecialization(getDoctorsByDay);
    };

    fetchDoctors();
  }, []);

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
              <div className="items-center mb-4 flex flex-row justify-between">
                <div className="flex flex-row gap-2 items-center">
                  <Stethoscope className="w-4 h-4 text-blue-500" />
                  <span className="text-slate-600 dark:text-slate-300 text-base font-medium">
                    Bác sĩ:
                  </span>
                  <span className="text-slate-500 dark:text-slate-300">
                    {(doctor as any)?.fullName}
                  </span>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <User className="w-4 h-4 text-blue-500" />
                  <span className="text-slate-600 dark:text-slate-300 text-base font-medium">
                    Giới tính:
                  </span>
                  <span className="text-slate-600 dark:text-slate-300">
                    {(doctor as any)?.gender.toLocaleLowerCase() === "male"
                      ? "Nam"
                      : "Nữ"}
                  </span>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <FileCog className="w-4 h-4 text-blue-500" />
                  <span className="text-slate-600 dark:text-slate-300 text-base font-medium">
                    Chuyên khoa:
                  </span>
                  <span className="text-slate-500 dark:text-slate-300">
                    {renderSpecialty((doctor as any)?.specialization)}
                  </span>
                </div>
              </div>
              <div className="space-y-4 ">
                {selectedDate &&
                  (doctor as any).schedule.map((scheduleItem: Schedule) => (
                    <div
                      key={scheduleItem.dayOfWeek + scheduleItem.startTime}
                      className={
                        scheduleItem.dayOfWeek === getDayOfWeek(selectedDate2)
                          ? "p-4 border bg-primary-foreground border-blue-300 dark:border-secondary rounded-md"
                          : "hidden"
                      }
                    >
                      <h3 className="font-medium text-blue-500 mb-2 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <p className="text-sm">
                          {renderDayOfWeek(scheduleItem.dayOfWeek)}
                        </p>
                      </h3>
                      <div className="grid grid-cols-4 gap-2 ">
                        {generateTimeSlots(
                          (scheduleItem as any).startTime,
                          (scheduleItem as any).endTime
                        ).map((slot) => (
                          <Button
                            key={slot}
                            variant={"outline"}
                            className="pointer-events-none"
                          >
                            <span className="text-slate-600 dark:text-slate-300">
                              {slot}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-between">
        <Button
          className="w-fit dark:hover:bg-slate-900"
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
            setActiveSection("confirm");
          }}
        ></ArrowButton>
      </div>
    </div>
  );
}

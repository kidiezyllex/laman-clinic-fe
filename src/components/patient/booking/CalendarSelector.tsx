"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import ArrowButton from "@/components/animata/button/arrow-button";
import { Doctor, Schedule } from "../../../../lib/entity-types";
import { Button } from "@/components/ui/button";
import {
  generateTimeSlots,
  getDayOfWeek,
  renderDayOfWeek,
  setTimeToDate,
} from "../../../../lib/utils";
import { Clock } from "lucide-react";

export default function CalendarSelector({
  setActiveSection,
  setSelectedDate,
  selectedDoctor,
}: {
  setActiveSection: (section: string) => void;
  setSelectedDate: (date: Date) => void;
  selectedDoctor: Doctor | null;
}) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [showExamination, setShowExamination] = useState(false);
  const [selectedDate2, setSelectedDate2] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState("");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const availableDays = new Set(
    selectedDoctor?.schedule?.map((day) => day.dayOfWeek.toLowerCase())
  );

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && selectedDate >= today) {
      setDate(selectedDate);
      setSelectedDate(selectedDate);
      setSelectedDate2(selectedDate);
      setShowExamination(true);
    }
  };

  const isDateDisabled = (date: Date) => {
    const day = date
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    if (selectedDoctor) return date < today || !availableDays.has(day);
    return date < today;
  };

  const filteredSchedule = selectedDoctor
    ? (selectedDoctor as any).schedule.filter((scheduleItem: Schedule) => {
        return scheduleItem.dayOfWeek === getDayOfWeek(selectedDate2);
      })
    : [];

  const handleSetSelectedDate = (slot: string) => {
    setSelectedSlot(slot);
    const newDate = setTimeToDate(selectedDate2, slot.split("-")[0]);
    setSelectedDate(newDate);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <p className="text-base font-semibold text-blue-500 ml-4 md:ml-0">
        VUI LÒNG CHỌN NGÀY KHÁM
      </p>
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleSelect}
        disabled={isDateDisabled}
        className="rounded-md border bg-background flex flex-row items-center justify-center"
        classNames={{
          head: "h-[30px] flex items-center",
          nav: "h-[35px] flex items-center sm:h-[70px]",
          head_cell: "w-[35px] sm:w-[100px] font-medium text-slate-600 mr-2",
          cell: "w-[35px] h-[35px] m-1 sm:h-[70px] sm:w-[100px] text-slate-600",
          button:
            "w-[35px] h-[35px] border border-slate-400 sm:w-[100px] sm:h-[70px]",
          nav_button:
            "w-[35px] h-[35px] border rounded-md flex items-center justify-center sm:w-[70px] sm:h-[70px]",
        }}
      />
      {filteredSchedule[0] && showExamination ? (
        <div className="w-full flex flex-col gap-4">
          <p className="text-base font-semibold text-blue-500 ml-4 md:ml-0">
            VUI LÒNG CHỌN CA KHÁM
          </p>
          <div className="space-y-4 bg-background rounded-md p-4">
            <h3 className="font-medium text-slate-500 mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-blue-500" />
              <p className="text-sm text-blue-500">
                {" "}
                {renderDayOfWeek(filteredSchedule[0].dayOfWeek)}
              </p>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 ">
              {generateTimeSlots(
                filteredSchedule[0].startTime,
                filteredSchedule[0].endTime
              ).map((slot) => (
                <Button
                  key={slot}
                  variant={selectedSlot === slot ? "default" : "outline"}
                  onClick={() => handleSetSelectedDate(slot)}
                >
                  <span
                    className={
                      selectedSlot === slot
                        ? "text-slate-300 dark:text-slate-950"
                        : "text-slate-600 dark:text-slate-300"
                    }
                  >
                    {slot}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      <div className="flex flex-row justify-between">
        {selectedDoctor ? (
          <Button
            className="w-fit dark:hover:bg-slate-900"
            onClick={() => {
              setActiveSection("doctorSelector");
            }}
            variant={"outline"}
          >
            Quay lại
          </Button>
        ) : (
          <div></div>
        )}
        <ArrowButton
          disabled={!date}
          className="w-fit self-end"
          text={"Tiếp tục"}
          onClick={() => {
            if (selectedDoctor) {
              setActiveSection("confirm");
            } else setActiveSection("specialtySelector");
          }}
        />
      </div>
    </div>
  );
}

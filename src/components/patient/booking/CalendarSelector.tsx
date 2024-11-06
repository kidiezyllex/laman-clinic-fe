"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import ArrowButton from "@/components/animata/button/arrow-button";
import { Doctor } from "../../../../lib/entity-types";

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
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const availableDays = new Set(
    selectedDoctor?.schedule?.map((day) => day.dayOfWeek.toLowerCase())
  );

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && selectedDate >= today) {
      setDate(selectedDate);
      setSelectedDate(selectedDate);
    }
  };

  const isDateDisabled = (date: Date) => {
    const day = date
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    return date < today || !availableDays.has(day);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <p className="text-base font-semibold text-blue-500">
        VUI LÒNG CHỌN NGÀY KHÁM
      </p>
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleSelect}
        disabled={isDateDisabled}
        className="rounded-md border bg-background flex flex-row items-center justify-center"
        styles={{
          head: {
            height: "30px",
            display: "flex",
            alignItems: "center",
          },
          nav: {
            height: "70px",
            display: "flex",
            alignItems: "center",
          },
          head_cell: { width: "100px" },
          cell: { width: "100px", height: "70px", margin: 1 },
          button: {
            width: "100px",
            height: "70px",
            border: "1px solid gray",
          },
          nav_button: { width: "32px", height: "70px" },
        }}
      />
      <ArrowButton
        disabled={!date}
        className="w-fit self-end"
        text={"Tiếp tục"}
        onClick={() => {
          if (selectedDoctor) {
            setActiveSection("payment");
          } else setActiveSection("specialtySelector");
        }}
      />
    </div>
  );
}

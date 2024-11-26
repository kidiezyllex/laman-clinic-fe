"use client";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
export default function CalendarSelector({
  setSelectedDate,
}: {
  setSelectedDate: (date: Date) => void;
}) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && selectedDate >= today) {
      setDate(selectedDate);
      setSelectedDate(selectedDate);
    }
  };
  const isDateDisabled = (date: Date) => {
    return date < today;
  };
  return (
    <div className="w-full flex flex-col gap-4">
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
    </div>
  );
}

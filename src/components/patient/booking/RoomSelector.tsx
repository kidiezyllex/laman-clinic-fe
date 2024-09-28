"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Clock, FileCog, Stethoscope, User, Warehouse } from "lucide-react";
export default function RoomSelector({
  setActiveSection,
}: {
  setActiveSection: (section: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [doctorsBySpecialization, setDoctorsBySpecialization] = useState<[]>(
    []
  );

  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await axios.get(`http://localhost:3000/doctors`);
      console.log(response.data);
      setDoctorsBySpecialization(response.data);
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

  return (
    <div className="w-full flex flex-col gap-4">
      <p className="text-base font-semibold text-blue-500">
        VUI LÒNG CHỌN PHÒNG KHÁM, BÁC SĨ, GIỜ KHÁM
      </p>
      <div className="w-full gap-4">
        {doctorsBySpecialization.map((doctor) => (
          <div
            key={doctor?._id}
            className="overflow-hidden transition-shadow duration-300 rounded-md mb-4 bg-background border"
          >
            <div className="p-6">
              <div className="items-center mb-4 grid grid-cols-3">
                <div className="flex flex-row gap-3 items-center">
                  <Stethoscope className="w-6 h-6 text-blue-500" />
                  <p className="text-sm font-semibold">
                    Bác sĩ: {doctor?.fullName}
                  </p>
                </div>
                <div className="flex flex-row gap-3 items-center">
                  <Warehouse className="w-6 h-6 text-blue-500" />
                  <p className="text-sm font-semibold">
                    Phòng khám: {doctor?.roomNumber}
                  </p>
                </div>
                <div className="flex flex-row gap-3 items-center">
                  <FileCog className="w-6 h-6 text-blue-500" />
                  <p className="text-sm font-semibold">
                    Chuyên khoa: {doctor?.specialization}
                  </p>
                </div>
              </div>
              <div className="space-y-4 ">
                {doctor.schedule.map((scheduleItem) => (
                  <div key={scheduleItem._id} className="p-3 border ">
                    <h3 className="font-medium text-slate-500 mb-2 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <p className="text-sm"> {scheduleItem.dayOfWeek}</p>
                    </h3>
                    <div className="grid grid-cols-4 gap-2 ">
                      {generateTimeSlots(
                        scheduleItem.startTime,
                        scheduleItem.endTime
                      ).map((slot) => (
                        <Button
                          key={slot}
                          variant="outline"
                          className="bg-white hover:bg-blue-200 text-blue-500 border-blue-500 rounded-sm"
                        >
                          {slot}
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
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, SearchIcon } from "lucide-react";

interface Patient {
  _id: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
}

interface Appointment {
  _id: string;
  patientId: Patient;
  appointmentDate: string;
  specialization: string;
}

const appointments: Appointment[] = [
  {
    _id: "66f89100569db3fc0becc63b",
    patientId: {
      _id: "66f88faf569db3fc0becc44e",
      fullName: "Ho Duc Lam",
      dateOfBirth: "2008-06-04T17:00:00.000Z",
      gender: "Female",
      phone: "+84904548277",
    },
    appointmentDate: "2024-10-02T17:00:00.000Z",
    specialization: "Pediatrics",
  },
  // Add more sample appointments here if needed
];

export default function ViewAppoinment() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.patientId.fullName
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%]">
      <Button className="bg-blue-500 hover:bg-blue-600 self-end">
        <CalendarIcon className="mr-2 h-4 w-4" /> Create Appointment
      </Button>

      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="search"
          placeholder="Search appointments..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        {filteredAppointments.map((appointment) => (
          <Card key={appointment._id}>
            <p>{appointment.patientId.fullName}</p>
            <CardContent>
              <p>
                <strong>Date of Birth:</strong>{" "}
                {new Date(
                  appointment.patientId.dateOfBirth
                ).toLocaleDateString()}
              </p>
              <p>
                <strong>Gender:</strong> {appointment.patientId.gender}
              </p>
              <p>
                <strong>Phone:</strong> {appointment.patientId.phone}
              </p>
              <p>
                <strong>Appointment Date:</strong>{" "}
                {new Date(appointment.appointmentDate).toLocaleString()}
              </p>
              <p>
                <strong>Specialization:</strong> {appointment.specialization}
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-blue-500 hover:bg-blue-600">
                <CalendarIcon className="mr-2 h-4 w-4" /> Create Appointment
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

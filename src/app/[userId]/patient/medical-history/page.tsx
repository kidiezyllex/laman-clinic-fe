"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import BioCard from "@/components/patient/medical-history/bio-card";
import { getUserData } from "../../../../../actions/getUserData";
import HealthMetricsCharts from "@/components/patient/medical-history/health-metrics-charts";

interface PatientData {
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  height: string;
}

const medicalHistory = [
  {
    date: "2023-05-15",
    type: "Consultation",
    doctor: "Dr. Emily Johnson",
    diagnosis: "Common Cold",
    prescription: "Acetaminophen, Rest",
    notes:
      "Patient presented with symptoms of common cold. Advised rest and over-the-counter medication.",
  },
  {
    date: "2023-03-10",
    type: "Vaccination",
    doctor: "Dr. Michael Chen",
    diagnosis: "Routine Immunization",
    prescription: "Influenza Vaccine",
    notes: "Annual flu shot administered. No adverse reactions observed.",
  },
  {
    date: "2022-11-22",
    type: "Surgery",
    doctor: "Dr. Sarah Patel",
    diagnosis: "Appendicitis",
    prescription: "Post-operative care instructions provided",
    notes:
      "Appendectomy performed. Surgery was successful with no complications.",
  },
];

export default function Page({ params }: { params: { userId: string } }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [patientData, setPatientData] = useState<PatientData>({
    name: "",
    age: 35,
    gender: "Male",
    bloodType: "A+",
    height: "1m65",
  });
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserData(params.userId);
        setPatientData({ ...patientData, name: user ? user.fullName : "" });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-blue-400">
        Lịch sử khám bệnh
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="col-span-1 flex flex-col gap-4">
          <BioCard items={patientData}></BioCard>
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-xl">Lịch hẹn sắp tới</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row items-center justify-center w-full">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>
        <HealthMetricsCharts></HealthMetricsCharts>
      </div>
    </div>
  );
}

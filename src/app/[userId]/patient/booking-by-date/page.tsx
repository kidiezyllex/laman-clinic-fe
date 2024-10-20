"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import CalendarSelector from "@/components/patient/booking/CalendarSelector";
import SpecialtySelector from "@/components/patient/booking/SpecialtySelector";
import { format } from "date-fns";
import axios from "axios";
import RoomSelector from "@/components/patient/booking/RoomSelector";
import { Fingerprint, Hospital, Stethoscope } from "lucide-react";
import Payment from "@/components/patient/booking/Payment";

interface Patient {
  _id: String;
  numberId?: string;
  fullName?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
}
export default function Page() {
  const [activeSection, setActiveSection] = useState("calendarSelector");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSpe, setSelectedSpe] = useState<number | null>(null);
  const [patient, setPatient] = useState<Partial<Patient>>({});
  const currentEmail = localStorage.getItem("currentEmail");
  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return format(date, "dd/MM/yyyy");
  };
  // Fetch Data Bệnh nhân
  useEffect(() => {
    const fetchPatientByAccountId = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/?email=${currentEmail}`
      );
      console.log(currentEmail);
      console.log(response.data[0]);
      setPatient(response.data[0]);
    };

    if (currentEmail) {
      fetchPatientByAccountId();
    } else {
      console.log("Email is not defined");
    }
  }, []);
  const renderMainContent = () => {
    switch (activeSection) {
      case "calendarSelector":
        return (
          <CalendarSelector
            setActiveSection={setActiveSection}
            setSelectedDate={setSelectedDate}
          />
        );
      case "specialtySelector":
        return (
          <SpecialtySelector
            setActiveSection={setActiveSection}
            setSelectedSpe={setSelectedSpe}
          />
        );
      case "roomSelector":
        return (
          <RoomSelector
            setActiveSection={setActiveSection}
            selectedDate={selectedDate}
            selectedSpe={selectedSpe}
          ></RoomSelector>
        );
      case "payment":
        return (
          <Payment
            setActiveSection={setActiveSection}
            selectedSpe={selectedSpe}
            selectedDate={selectedDate}
            patient={patient}
          ></Payment>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-base">
              TRANG CHỦ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/components" className="text-base">
              BỆNH NHÂN
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base text-blue-500">
              ĐẶT KHÁM THEO NGÀY
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] gap-5 mt-8">
        <div className="hidden md:block">
          <div className="border bg-background flex flex-col mb-4">
            <div className="p-3 bg-blue-500 flex flex-row gap-2 items-center">
              <div className="h-10 w-10 bg-primary-foreground rounded-full flex flex-row items-center justify-center">
                <Fingerprint className="text-blue-500"></Fingerprint>
              </div>
              <p className="text-base font-semibold text-primary-foreground dark:text-primary ">
                Thông tin bệnh nhân
              </p>
            </div>
            <div className="flex flex-col gap-2 p-3">
              <p className="text-sm dark:text-slate-500">
                <span className="font-semibold">Tên:</span> {patient.fullName}
              </p>
              <p className="text-sm dark:text-slate-500">
                <span className="font-semibold">CCCD:</span> {patient.numberId}
              </p>
              <p className="text-sm dark:text-slate-500">
                <span className="font-semibold">Địa chỉ:</span>{" "}
                {patient.address}
              </p>
              <p className="text-sm dark:text-slate-500">
                <span className="font-semibold">SĐT:</span> {patient.phone}
              </p>
              <p className="text-sm dark:text-slate-500">
                <span className="font-semibold">Email:</span> {patient.email}
              </p>
            </div>
          </div>
          <div className="border bg-background flex flex-col">
            <div className="p-3 bg-blue-500 flex flex-row gap-2 items-center">
              <div className="h-10 w-10 bg-primary-foreground rounded-full flex flex-row items-center justify-center">
                <Stethoscope className="text-blue-500"></Stethoscope>
              </div>
              <p className="text-base font-semibold text-primary-foreground dark:text-primary ">
                Thông tin khám bệnh
              </p>
            </div>
            <div className="flex flex-col gap-2 p-3">
              <div className="flex flex-row gap-2 items-center">
                <Hospital className="h-4 w-4 text-blue-500" />
                <span className="font-semibold text-blue-500">
                  Phòng khám Đa khoa Laman
                </span>
              </div>
              <p className="text-sm">
                <span className="font-semibold dark:text-slate-500">
                  Ngày khám:
                </span>{" "}
                {formatDate(selectedDate)}
              </p>
              <p className="text-sm">
                <span className="font-semibold dark:text-slate-500">
                  Chuyên khoa:
                </span>{" "}
                {selectedSpe}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col rounded-md">
          <Breadcrumb className="p-4 bg-background border rounded-md mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage
                  className={
                    activeSection === "calendarSelector"
                      ? "text-base text-blue-500 dark:text-blue-500"
                      : "text-base"
                  }
                >
                  Ngày khám
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage
                  className={
                    activeSection === "specialtySelector"
                      ? "text-base text-blue-500 dark:text-blue-500"
                      : "text-base"
                  }
                >
                  Chuyên khoa
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage
                  className={
                    activeSection === "roomSelector"
                      ? "text-base text-blue-500 dark:text-blue-500"
                      : "text-base"
                  }
                >
                  Phòng khám, giờ khám
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage
                  className={
                    activeSection === "payment"
                      ? "text-base text-blue-500 dark:text-blue-500"
                      : "text-base"
                  }
                >
                  Thanh toán
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}

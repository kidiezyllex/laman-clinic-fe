"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Calendar,
  ContactRound,
  HistoryIcon,
  MessageCircleMore,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import PatientProfile from "@/components/patient/profile/PatientProfile";
import MedicalHistory from "@/components/patient/MedicalHistory";
import BookedAppointments from "@/components/patient/BookedAppointments";
export default function Page() {
  const [activeSection, setActiveSection] = useState("patientProfile");

  const renderMainContent = () => {
    switch (activeSection) {
      case "patientProfile":
        return <PatientProfile />;
      case "medicalHistory":
        return <MedicalHistory />;
      case "bookedAppointments":
        return <BookedAppointments />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Breadcrumb className="mt-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-base">
              TRANG CHỦ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-base">BỆNH NHÂN</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base text-blue-500">
              QUẢN LÝ TÀI KHOẢN
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] gap-5 mt-8">
        <div className="hidden h-full border bg-background md:block rounded-md">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex-1 pt-4">
              <nav className="grid items-start px-2 text-sm lg:px-4">
                <Link
                  href="#"
                  onClick={() => setActiveSection("patientProfile")}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all  ${
                    activeSection === "patientProfile"
                      ? "bg-muted text-blue-500 font-semibold"
                      : "text-slate-500"
                  }`}
                >
                  <ContactRound className="h-4 w-4" />
                  Hồ sơ bệnh nhân
                </Link>
                <Link
                  href="#"
                  onClick={() => setActiveSection("medicalHistory")}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all  ${
                    activeSection === "medicalHistory"
                      ? "bg-muted text-blue-500 font-semibold"
                      : "text-slate-500"
                  }`}
                >
                  <HistoryIcon className="h-4 w-4" />
                  Lịch sử khám bệnh
                </Link>
                <Link
                  href="#"
                  onClick={() => setActiveSection("bookedAppointments")}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all  ${
                    activeSection === "bookedAppointments"
                      ? "bg-muted text-blue-500 font-semibold"
                      : "text-slate-500"
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  Lịch hẹn đã đặt
                </Link>
                <Link
                  href="#"
                  onClick={() => setActiveSection("notification")}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all  ${
                    activeSection === "notification"
                      ? "bg-muted text-blue-500 font-semibold"
                      : "text-slate-500"
                  }`}
                >
                  <Bell className="h-4 w-4" />
                  Thông báo
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col rounded-md min-h-screen">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Calendar,
  ContactRound,
  HistoryIcon,
  MessageCircleMore,
  Menu,
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

  const renderNavLink = (section: any, icon: any, text: any) => (
    <Link
      href="#"
      onClick={() => {
        setActiveSection(section);
      }}
      className={`flex items-center gap-3 rounded-lg font-semibold px-3 py-2 transition-all last:mb-4  ${
        activeSection === section ? "bg-muted text-blue-500" : "text-slate-500 "
      }`}
    >
      {icon}
      {text}
    </Link>
  );

  return (
    <div>
      <Breadcrumb className="mt-4 ml-4 md:ml-0 overflow-x-auto whitespace-nowrap">
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

      <div className="flex flex-col md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[220px_1fr] gap-5 mt-8">
        <div className="md:block h-full border bg-background rounded-md">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex-1 pt-4">
              <nav className="grid items-start px-2 text-sm">
                {renderNavLink(
                  "patientProfile",
                  <ContactRound className="h-4 w-4" />,
                  "Hồ sơ bệnh nhân"
                )}
                {renderNavLink(
                  "medicalHistory",
                  <HistoryIcon className="h-4 w-4" />,
                  "Lịch sử khám bệnh"
                )}
                {renderNavLink(
                  "bookedAppointments",
                  <Calendar className="h-4 w-4" />,
                  "Lịch hẹn đã đặt"
                )}
              </nav>
            </div>
          </div>
        </div>

        <div className="flex flex-col rounded-md min-h-screen md:p-0">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}

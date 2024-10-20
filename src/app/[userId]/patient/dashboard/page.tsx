"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  ContactRound,
  HistoryIcon,
  MessageCircleMore,
  NotepadText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Messages from "@/components/receptionist/messages";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import PatientProfile from "@/components/patient/profile/PatientProfile";
export default function Page() {
  const [activeSection, setActiveSection] = useState("patientProfile");

  const renderMainContent = () => {
    switch (activeSection) {
      case "patientProfile":
        return <PatientProfile />;
      case "appointments":
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              Your Appointments
            </h3>
            <p className="text-sm text-muted-foreground">
              You have 6 upcoming appointments.
            </p>
            <Button className="mt-4">Manage Appointments</Button>
          </div>
        );
      case "messages":
        return <Messages />;
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
              QUẢN LÝ TÀI KHOẢN
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] gap-5 mt-8">
        <div className="hidden h-[90%] border bg-background md:block rounded-md">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex-1 pt-4">
              <nav className="grid items-start px-2 text-sm lg:px-4">
                <Link
                  href="#"
                  onClick={() => setActiveSection("patientProfile")}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    activeSection === "patientProfile"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <ContactRound className="h-4 w-4" />
                  Hồ sơ bệnh nhân
                </Link>
                <Link
                  href="#"
                  onClick={() => setActiveSection("medicalReport")}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    activeSection === "medicalReport"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <NotepadText className="h-4 w-4" />
                  Phiếu khám bệnh
                </Link>
                <Link
                  href="#"
                  onClick={() => setActiveSection("messages")}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    activeSection === "messages"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <MessageCircleMore className="h-4 w-4" />
                  Tin nhắn
                </Link>
                <Link
                  href="#"
                  onClick={() => setActiveSection("notification")}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    activeSection === "notification"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <Bell className="h-4 w-4" />
                  Thông báo
                </Link>
                <Link
                  href="#"
                  onClick={() => setActiveSection("medicalHistory")}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    activeSection === "medicalHistory"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <HistoryIcon className="h-4 w-4" />
                  Lịch sử khám bệnh
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

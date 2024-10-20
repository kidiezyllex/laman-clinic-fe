"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Bell, ContactRound, User } from "lucide-react";

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
import ViewAppointment from "@/components/doctor/ViewAppoinment";
import DoctorProfile from "@/components/doctor/DoctorProfile";
export default function Page() {
  const [activeSection, setActiveSection] = useState("appoinments");

  const renderMainContent = () => {
    switch (activeSection) {
      case "appoinments":
        return <ViewAppointment />;
      case "profile":
        return <DoctorProfile />;
      // case "notification":
      // return <Notification />;
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
              BÁC SĨ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base text-blue-500">
              DASHBOARD
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[200px_1fr] gap-3 mt-8">
        <div className="hidden h-full border bg-background md:block rounded-md">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex-1 pt-4">
              <nav className="grid items-start px-2 text-sm lg:px-4">
                <Link
                  href="#"
                  onClick={() => setActiveSection("appoinments")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-primary ${
                    activeSection === "appoinments"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <ContactRound className="h-4 w-4" />
                  Lịch hẹn
                </Link>
                {/* <Link
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
                </Link> */}
                {/* <Link
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
                </Link> */}
                <Link
                  href="#"
                  onClick={() => setActiveSection("notification")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-primary ${
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
                  onClick={() => setActiveSection("profile")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-primary ${
                    activeSection === "profile"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <User className="h-4 w-4" />
                  Tài khoản
                </Link>
                {/* <Link
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
                </Link> */}
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

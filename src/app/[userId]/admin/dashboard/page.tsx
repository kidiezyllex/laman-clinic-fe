"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Bell, CircleCheck, User, Users } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import DoctorProfile from "@/components/doctor/DoctorProfile";
import { useToast } from "@/hooks/use-toast";
import AccountsManagement from "@/components/admin/AccountsManagement";
import DoctorsManagement from "@/components/admin/DoctorsManagement";

export default function Page() {
  const [activeSection, setActiveSection] = useState("doctors");
  const { toast } = useToast();
  const renderMainContent = () => {
    switch (activeSection) {
      case "accounts":
        return <AccountsManagement />;
      case "profile":
        return <DoctorProfile />;
      case "doctors":
        return <DoctorsManagement />;
      // case "notification":
      // return <Notification />;
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
            <BreadcrumbLink className="text-base">QUẢN TRỊ VIÊN</BreadcrumbLink>
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
                <div className={"flex items-center gap-3 rounded-md px-3 py-2"}>
                  <Users className="h-4 w-4" />
                  Quản lý
                </div>
                <Link
                  href="#"
                  onClick={() => setActiveSection("accounts")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-primary ${
                    activeSection === "accounts"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <p className="ml-7">Tài khoản</p>
                </Link>
                <Link
                  href="#"
                  onClick={() => setActiveSection("doctors")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-primary ${
                    activeSection === "doctors"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <p className="ml-7">Bác sĩ</p>
                </Link>
                <div className={"flex items-center gap-3 rounded-md px-3 py-2"}>
                  <CircleCheck className="h-4 w-4" />
                  Hoàn thành
                </div>
                <Link
                  href="#"
                  onClick={() => setActiveSection("invoice")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-primary ${
                    activeSection === "invoice"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <p className="ml-7">Lịch hẹn</p>
                </Link>
                <Link
                  href="#"
                  onClick={() => setActiveSection("completed")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-primary ${
                    activeSection === "completed"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <p className="ml-7">Dịch vụ</p>
                </Link>
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

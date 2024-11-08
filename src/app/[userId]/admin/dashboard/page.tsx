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
import ViewAppointment from "@/components/doctor/ViewAppoinment";
import DoctorProfile from "@/components/doctor/DoctorProfile";
import { useToast } from "@/hooks/use-toast";
import AccountManagement from "@/components/admin/AccountManagement";

export default function Page() {
  const [activeSection, setActiveSection] = useState("accounts");
  const { toast } = useToast();
  const renderMainContent = () => {
    switch (activeSection) {
      case "accounts":
        return <AccountManagement />;
      case "profile":
        return <DoctorProfile />;
      // case "notification":
      // return <Notification />;
      default:
        return null;
    }
  };

  const handleChangeRoomNumber = async () => {
    try {
      // const response3 = await axios.patch(
      //   `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/create-prescription`,
      //   roomNumber
      // );
      toast({
        variant: "default",
        title: "Thành công!",
        description: "Đã cập nhật số phòng.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Thất bại!",
        description: error + "",
      });
      console.error(error);
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
                <Link
                  href="#"
                  onClick={() => setActiveSection("accounts")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-primary ${
                    activeSection === "accounts"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  QL Tài khoản
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

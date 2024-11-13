"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, CircleCheck, ContactRound, Edit, User } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { usePathname } from "next/navigation";
import CompletedAppointments from "@/components/doctor/CompletedAppoinment";

export default function Page() {
  const [activeSection, setActiveSection] = useState("appoinments");
  const [roomNumber, setRoomNumber] = useState("");
  const [showUpdateRNForm, setShowUpdateRNForm] = useState(false);
  const { toast } = useToast();
  const pathname = usePathname();
  const doctorId = pathname.split("/")[1];
  const renderMainContent = () => {
    switch (activeSection) {
      case "appoinments":
        return <ViewAppointment roomNumber={roomNumber} />;
      case "profile":
        return <DoctorProfile />;
      case "completedApt":
        return <CompletedAppointments />;
      default:
        return null;
    }
  };

  // Fetch Data Bác sĩ, lấy roomNumber
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/${doctorId}`
      );
      const roomN = response.data.roomNumber;
      if (roomN.toString() === "000") setShowUpdateRNForm(true);
      else {
        setRoomNumber(response.data.roomNumber);
        setShowUpdateRNForm(false);
      }
    };
    fetchData();
  }, [showUpdateRNForm]);

  const handleUpdateRoomNumber = async () => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/${doctorId}/updateRoomNumber`,
        { isOnline: true, roomNumber: roomNumber }
      );
      setShowUpdateRNForm(false);
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
            <BreadcrumbLink className="text-base">BÁC SĨ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base text-blue-500">
              DASHBOARD
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {showUpdateRNForm ? (
        <Alert className="mt-4">
          <Edit className="h-4 w-4" />
          <AlertTitle>
            VUI LÒNG CẬP NHẬT SỐ PHÒNG KHÁM SAU KHI ĐĂNG NHẬP
          </AlertTitle>
          <AlertDescription>
            <div className="w-full mt-4 flex flex-row gap-3 justify-between">
              <Input
                placeholder="Ví dụ: '102'"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="bg-transparent"
              ></Input>
              <Button onClick={handleUpdateRoomNumber} variant={"secondary"}>
                Cập nhật
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[200px_1fr] gap-3 mt-8">
        <div className="hidden h-full border bg-background md:block rounded-md">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex-1 pt-4">
              <nav className="grid items-start px-2 text-sm lg:px-4">
                <Link
                  href="#"
                  onClick={() => setActiveSection("appoinments")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 font-semibold transition-all hover:text-primary ${activeSection === "appoinments"
                    ? "bg-muted text-blue-500 hover:text-blue-700"
                    : "text-slate-500"
                    }`}
                >
                  <ContactRound className="h-4 w-4" />
                  Lịch hẹn
                </Link>
                <div
                  className={
                    activeSection === "completedApt" ||
                      activeSection === "completedSv"
                      ? "flex items-center gap-3 rounded-md px-3 py-2 transition-all text-blue-500 font-semibold"
                      : "flex items-center gap-3 rounded-md px-3 py-2 font-semibold text-slate-500"
                  }
                >
                  <CircleCheck className="h-4 w-4" />
                  Hoàn thành
                </div>
                <Link
                  href="#"
                  onClick={() => setActiveSection("completedApt")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-primary ${activeSection === "completedApt"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                    }`}
                >
                  <p className="ml-7">Ca khám</p>
                </Link>
                <Link
                  href="#"
                  onClick={() => setActiveSection("completedSv")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-primary ${activeSection === "completedSv"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                    }`}
                >
                  <p className="ml-7">Dịch vụ</p>
                </Link>
                <Link
                  href="#"
                  onClick={() => setActiveSection("profile")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 font-semibold transition-all hover:text-primary ${activeSection === "profile"
                    ? "bg-muted text-blue-500 hover:text-blue-700"
                    : "text-slate-500"
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

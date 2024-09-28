"use client";
import React, { useEffect, useState } from "react";
import Messages from "@/components/receptionist/messages";
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
import { useAuth } from "@clerk/nextjs";
import { format } from "date-fns";
import axios from "axios";
import RoomSelector from "@/components/patient/booking/RoomSelector";

interface Patient {
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
  const { userId } = useAuth();
  const [patient, setPatient] = useState<Patient>({});
  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return format(date, "dd/MM/yyyy");
  };
  useEffect(() => {
    const fetchPatientByAccountId = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/patients/by-account/${userId}`
        );
        console.log(response.data);
        setPatient(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error:", error.response?.data || error.message);
        } else {
          console.error("An unexpected error occurred:", error);
        }
      }
    };

    if (userId) {
      fetchPatientByAccountId();
    } else {
      console.log("userId is not defined");
    }
  }, [userId]);
  const renderMainContent = () => {
    switch (activeSection) {
      case "calendarSelector":
        // return <CalendarSelector setActiveSection={setActiveSection} />;
        return (
          <RoomSelector setActiveSection={setActiveSection}></RoomSelector>
        );
      case "specialtySelector":
        return <SpecialtySelector setActiveSection={setActiveSection} />;
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
              ĐẶT KHÁM THEO NGÀY
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] gap-5 mt-8">
        <div className="hidden md:block">
          <div className="border bg-background rounded-md p-4 flex flex-col gap-2">
            <p className="text-base font-semibold text-blue-500">
              {patient.fullName}
            </p>
            <p className="text-sm">
              <span className="font-semibold">CCCD:</span> {patient.numberId}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Địa chỉ:</span> {patient.address}
            </p>
            <p className="text-sm">
              <span className="font-semibold">SĐT:</span> {patient.phone}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Email:</span> {patient.email}
            </p>
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
                <BreadcrumbPage className="text-base">
                  Phòng khám, giờ khám
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-base">
                  Thông tin đăng ký
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-base">
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

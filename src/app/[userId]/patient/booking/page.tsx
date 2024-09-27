"use client";
import { useAuth } from "@clerk/nextjs";
import React, { useState } from "react";
import Link from "next/link";
import { CalendarDays, Home, MessageCircleMore } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Dashboard from "@/components/receptionist/dashboard";
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
export default function Page() {
  const [activeSection, setActiveSection] = useState("calendarSelector");

  const renderMainContent = () => {
    switch (activeSection) {
      case "calendarSelector":
        return <CalendarSelector setActiveSection={setActiveSection} />;
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
              BÙI TRẦN THIÊN ÂN
            </p>
            <p className="text-sm">
              Địa chỉ: Tổ 3, Xã Nhơn Khánh, TX. An Nhơn, Bình Định
            </p>
            <p className="text-sm">SĐT: 033673***6</p>
          </div>
        </div>
        <div className="flex flex-col rounded-md">
          <Breadcrumb className="p-4 bg-background border rounded-md mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage
                  className={
                    activeSection === "calendarSelector"
                      ? "text-base text-blue-500"
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
                      ? "text-base text-blue-500"
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

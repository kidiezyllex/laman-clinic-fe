"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  FlaskConical,
  FlaskRound,
  Pill,
  TestTubes,
  User,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import RequestedTests from "@/components/laboratory-technician/RequestedTests";
import CompletedTests from "@/components/laboratory-technician/CompletedTests";
import TestTypesManagement from "@/components/test/TestTypesManagement";
import TechnicianProfile from "@/components/laboratory-technician/TechnicianProfile";
export default function Page() {
  const [activeSection, setActiveSection] = useState("request");
  const renderMainContent = () => {
    switch (activeSection) {
      case "request":
        return <RequestedTests />;
      case "profile":
        return <TechnicianProfile />;
      case "completed":
        return <CompletedTests />;
      case "test-types":
        return <TestTypesManagement />;
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
            <BreadcrumbLink className="text-base">
              Y TÁ XÉT NGHIỆM
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
      <div className="grid w-full md:grid-cols-[220px_1fr] lg:grid-cols-[200px_1fr] gap-3 mt-8">
        <div className="hidden h-full border bg-background md:block rounded-md">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex-1 pt-4">
              <nav className="grid items-start px-2 text-sm lg:px-4">
                <div
                  className={
                    activeSection === "request" || activeSection === "completed"
                      ? "flex items-center gap-3 rounded-md px-3 py-2 transition-all text-blue-500 font-semibold"
                      : "flex items-center gap-3 rounded-md px-3 py-2 font-semibold text-slate-500"
                  }
                >
                  <FlaskConical className="h-4 w-4" />
                  Xét nghiệm
                </div>
                <Link
                  href="#"
                  onClick={() => setActiveSection("request")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-primary ${
                    activeSection === "request"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <p className="ml-7">Yêu cầu</p>
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
                  <p className="ml-7">Hoàn thành</p>
                </Link>
                <Link
                  href="#"
                  onClick={() => setActiveSection("test-types")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 font-semibold transition-all ${
                    activeSection === "test-types"
                      ? "bg-muted text-blue-500"
                      : "text-slate-500"
                  }`}
                >
                  <TestTubes className="h-4 w-4" />
                  Loại xét nghiệm
                </Link>
                <Link
                  href="#"
                  onClick={() => setActiveSection("profile")}
                  className={`flex items-center gap-3 rounded-md font-semibold px-3 py-2 transition-all ${
                    activeSection === "profile"
                      ? "bg-muted text-blue-500"
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

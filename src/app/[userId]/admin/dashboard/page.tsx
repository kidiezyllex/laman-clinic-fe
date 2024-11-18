"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Pill, TestTubes, User, Users } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useToast } from "@/hooks/use-toast";
import AccountsManagement from "@/components/admin/AccountsManagement";
import DoctorsManagement from "@/components/admin/DoctorsManagement";
import TestTypesManagement from "@/components/test/TestTypesManagement";
import MedicineWarehouse from "@/components/admin/MedicineWarehouse";
import AdminProfile from "@/components/admin/AdminProfile";

export default function Page() {
  const [activeSection, setActiveSection] = useState("medicine-warehouse");
  const { toast } = useToast();
  const renderMainContent = () => {
    switch (activeSection) {
      case "accounts":
        return <AccountsManagement />;
      case "profile":
        return <AdminProfile />;
      case "doctors":
        return <DoctorsManagement />;
      case "tests":
        return <TestTypesManagement />;
      case "medicine-warehouse":
        return <MedicineWarehouse />;
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
                <div
                  className={
                    activeSection === "accounts" || activeSection === "doctors"
                      ? "flex items-center gap-3 rounded-md px-3 py-2 transition-all text-blue-500 font-semibold"
                      : "flex items-center gap-3 rounded-md px-3 py-2 font-semibold text-slate-500"
                  }
                >
                  <Users className="h-4 w-4" />
                  Tài khoản
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
                  <p className="ml-7">Tất cả</p>
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
                <Link
                  href="#"
                  onClick={() => setActiveSection("tests")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 font-semibold transition-all ${
                    activeSection === "tests"
                      ? "bg-muted text-blue-500"
                      : "text-slate-500"
                  }`}
                >
                  <TestTubes className="h-4 w-4" />
                  Loại xét nghiệm
                </Link>
                <Link
                  href="#"
                  onClick={() => setActiveSection("medicine-warehouse")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 font-semibold transition-all ${
                    activeSection === "medicine-warehouse"
                      ? "bg-muted text-blue-500"
                      : "text-slate-500"
                  }`}
                >
                  <Pill className="h-4 w-4" />
                  Kho thuốc
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

"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import axios from "axios";
import { Fingerprint, Hospital, Stethoscope } from "lucide-react";
import { usePathname } from "next/navigation";
import { Doctor, Patient } from "../../../../../lib/entity-types";
import {
  formatDate,
  formatDate3,
  generateExamination,
  renderSpecialty,
} from "../../../../../lib/utils";
import DoctorSelector from "@/components/patient/booking/DoctorSelector";
import CalendarSelector from "@/components/patient/booking/CalendarSelector";
import Confirm from "@/components/patient/booking/Confirm";

export default function Page() {
  const [activeSection, setActiveSection] = useState("doctorSelector");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedSpe, setSelectedSpe] = useState<String | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const pathname = usePathname();
  const patientId = pathname.split("/")[1];
  const [patient, setPatient] = useState<Patient | null>(null);
  // Fetch Data Bệnh nhân
  useEffect(() => {
    const fetchPatientByAccountId = async () => {
      try {
        if (!pathname.split("_").includes("/user")) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/${patientId}`
          );
          setPatient(response.data);
        } else {
          setPatient(null);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPatientByAccountId();
  }, []);
  const renderMainContent = () => {
    switch (activeSection) {
      case "doctorSelector":
        return (
          <DoctorSelector
            setActiveSection={setActiveSection}
            setSelectedDoctor={setSelectedDoctor}
            setSelectedSpe={setSelectedSpe}
          />
        );
      case "calendarSelector":
        return (
          <CalendarSelector
            setActiveSection={setActiveSection}
            setSelectedDate={setSelectedDate}
            selectedDoctor={selectedDoctor}
          />
        );
      case "confirm":
        return (
          <Confirm
            setActiveSection={setActiveSection}
            selectedSpe={null}
            selectedDate={selectedDate}
            patient={patient as any}
            selectedDoctor={selectedDoctor}
          ></Confirm>
        );
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
            <BreadcrumbLink
              href={`/${pathname.split("/")[1]}/patient/dashboard`}
              className="text-base"
            >
              BỆNH NHÂN
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base text-blue-500">
              ĐẶT KHÁM THEO BÁC SĨ
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] gap-5 mt-8">
        <div className="hidden md:block">
          <div className="border bg-background flex flex-col mb-4">
            <div className="p-3 bg-blue-500 flex flex-row gap-2 items-center">
              <div className="h-10 w-10 bg-primary-foreground rounded-full flex flex-row items-center justify-center">
                <Fingerprint className="text-blue-500"></Fingerprint>
              </div>
              <p className="text-base font-semibold text-primary-foreground dark:text-primary">
                Thông tin bệnh nhân
              </p>
            </div>
            <div className="flex flex-col text-slate-600 dark:text-slate-300">
              <div className="text-sm grid grid-cols-2 border p-2 px-3 text-slate-600 dark:text-slate-300">
                <span className="font-semibold">Mã BN:</span>{" "}
                <span>{patient?._id}</span>
              </div>
              <div className="text-sm grid grid-cols-2 border p-2 px-3 break-words">
                <span className="font-semibold">Tên:</span>{" "}
                <span>{patient?.fullName}</span>
              </div>
              <div className="text-sm grid grid-cols-2 border p-2 px-3">
                <span className="font-semibold">Giới tính:</span>{" "}
                <span>
                  {patient?.gender?.toLocaleLowerCase() === "female"
                    ? "Nữ"
                    : "Nam"}
                </span>
              </div>
              <div className="text-sm grid grid-cols-2 border p-2 px-3">
                <span className="font-semibold">SĐT:</span>{" "}
                <span>{patient?.phone}</span>
              </div>
              <div className="text-sm grid grid-cols-2 border p-2 px-3 break-words">
                <span className="font-semibold">Email:</span>{" "}
                <span>{patient?.email}</span>
              </div>
            </div>
          </div>
          <div className="border bg-background flex flex-col">
            <div className="p-3 bg-blue-500 flex flex-row gap-2 items-center">
              <div className="h-10 w-10 bg-primary-foreground rounded-full flex flex-row items-center justify-center">
                <Stethoscope className="text-blue-500"></Stethoscope>
              </div>
              <p className="text-base font-semibold text-white">
                Thông tin khám bệnh
              </p>
            </div>
            <div className="flex flex-col gap-2 p-3">
              <div className="flex flex-row gap-2 items-center">
                <Hospital className="h-4 w-4 text-blue-500" />
                <span className="font-semibold text-blue-500">
                  Phòng khám Đa khoa Laman
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                <span className="font-semibold">Bác sĩ:</span>{" "}
                <span>{selectedDoctor?.fullName}</span>
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                <span className="font-semibold">Chuyên khoa:</span>{" "}
                <span>{renderSpecialty(selectedSpe + "")}</span>
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                <span className="font-semibold">Ngày khám:</span>{" "}
                <span>{selectedDate ? formatDate(selectedDate) : null}</span>
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                <span className="font-semibold">Ca khám:</span>{" "}
                <span>
                  {selectedDate &&
                  generateExamination(formatDate3(selectedDate))[0] !==
                    "00:00 - 01:00"
                    ? generateExamination(formatDate3(selectedDate))
                    : null}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col rounded-md">
          <Breadcrumb className="p-4 bg-background border rounded-md mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage
                  className={
                    activeSection === "doctorSelector"
                      ? "text-base text-blue-500 dark:text-blue-500 font-semibold"
                      : "text-base text-slate-500 dark:text-primary"
                  }
                >
                  Bác sĩ & chuyên khoa
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage
                  className={
                    activeSection === "calendarSelector"
                      ? "text-base text-blue-500 dark:text-blue-500 font-semibold"
                      : "text-base text-slate-500 dark:text-primary"
                  }
                >
                  Ngày & giờ khám
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage
                  className={
                    activeSection === "confirm"
                      ? "text-base text-blue-500 dark:text-blue-500 font-semibold"
                      : "text-base text-slate-500 dark:text-primary"
                  }
                >
                  Xác nhận thông tin
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

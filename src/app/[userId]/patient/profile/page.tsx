"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import PatientProfileForm from "@/components/patient/profile/PatientProfileForm";
import {
  Calendar,
  CalendarIcon,
  Cat,
  Dog,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  Stethoscope,
  UserIcon,
} from "lucide-react";
import axios from "axios";
import { usePathname } from "next/navigation";
import { Patient } from "../../../../../lib/entity-types";
import { formatDate } from "../../../../../lib/utils";
export default function CreatePatientProfile() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const pathname = usePathname();
  const patientId = pathname.split("/")[1];
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
              HỒ SƠ BỆNH NHÂN
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <CardContent className="w-full mx-auto mt-8 ">
        <div className="text-center ">
          {patient && (
            <div className="p-4 border rounded-md flex flex-col gap-3 bg-background">
              <h3 className="text-lg font-semibold text-blue-500 text-center">
                HỒ SƠ HIỆN TẠI
              </h3>
              <div className="grid grid-cols-3 gap-4 ">
                <div className="col-span-1 flex items-center space-x-3 border border-blue-300 dark:border-secondary rounded-md p-4 bg-primary-foreground">
                  {patient.gender?.toLocaleLowerCase() === "male" ? (
                    <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-blue-200">
                      <Dog className="text-blue-500" />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-pink-200">
                      <Cat className="text-pink-500" />
                    </div>
                  )}
                  <div>
                    <p className="text-base font-semibold text-start text-slate-600 dark:text-primary">
                      {patient.fullName}
                    </p>
                    <p className="text-slate-500 text-start">
                      Mã bệnh nhân: {patient._id}
                    </p>
                  </div>
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-3 border border-blue-300 dark:border-secondary rounded-md p-4 bg-primary-foreground">
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="text-blue-500 h-4 w-4" />
                    <span className="text-slate-500 text-sm">
                      Ngày sinh: {formatDate(patient.dateOfBirth)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <UserIcon className="text-blue-500 h-4 w-4" />
                    <span className="text-slate-500 text-sm">
                      Giới tính:{" "}
                      {patient.gender?.toLowerCase() === "female"
                        ? "Nữ"
                        : "Nam"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="text-blue-500 h-4 w-4" />
                    <span className="text-slate-500 text-sm">
                      Địa chỉ: {patient.address}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="text-blue-500 h-4 w-4" />
                    <span className="text-slate-500 text-sm">
                      Số ĐT: {patient.phone}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MailIcon className="text-blue-500 h-4 w-4" />
                    <span className="text-slate-500 text-sm">
                      Email: {patient.email}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-4 items-center justify-center my-4">
                <Link href={`/${patient._id}/patient/booking-by-date`}>
                  <Button
                    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white text-white hover:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                    variant={"secondary"}
                  >
                    Đặt lịch khám theo ngày
                    <Calendar className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/${patient._id}/patient/booking-by-doctor`}>
                  <Button
                    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white text-white hover:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                    variant={"secondary"}
                  >
                    Đặt lịch khám theo bác sĩ
                    <Stethoscope className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
          <div className="w-full h-[100%] bg-background rounded-xl">
            {!patient && (
              <PatientProfileForm
                setSearchTerm={() => {}}
                setShowCreatePatientProfile={() => {}}
              />
            )}
          </div>
        </div>
      </CardContent>
    </div>
  );
}

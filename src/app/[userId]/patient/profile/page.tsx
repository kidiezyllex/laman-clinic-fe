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
              HỒ SƠ BỆNH NHÂN
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="w-full mx-auto mt-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-500 mb-4">
            HỒ SƠ BỆNH NHÂN
          </CardTitle>
          {patient && (
            <div className="p-4 border rounded-md flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-blue-500 self-start">
                HỒ SƠ HIỆN TẠI
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 flex items-center space-x-3 border rounded-md p-4">
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
                    <p className="text-base font-semibold text-start">
                      {patient.fullName}
                    </p>
                    <p className="text-slate-500 text-start">
                      Mã bệnh nhân: {patient._id}
                    </p>
                  </div>
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-3 border rounded-md p-4">
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
                    className="w-fit bg-blue-500 text-white hover:bg-blue-700"
                    variant={"secondary"}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Đặt lịch khám theo ngày
                  </Button>
                </Link>
                <Link href={`/${patient._id}/patient/booking-by-doctor`}>
                  <Button
                    className="w-fit bg-blue-500 text-white hover:bg-blue-700"
                    variant={"secondary"}
                  >
                    <Stethoscope className="mr-2 h-4 w-4" />
                    Đặt lịch khám theo bác sĩ
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {!patient && (
            <CardDescription>
              Bạn đã từng đặt khám tại Đa khoa Laman Clinic?
            </CardDescription>
          )}
        </CardHeader>
        {!patient && (
          <CardContent className="space-y-4">
            <div className="flex justify-center space-x-4">
              <Button
                variant={selectedOption === "existing" ? "default" : "outline"}
                onClick={() => setSelectedOption("existing")}
                className={
                  selectedOption === "existing" ? "bg-blue-500 w-fit" : "w-fit"
                }
              >
                Đã có hồ sơ
              </Button>
              <Button
                variant={selectedOption === "new" ? "default" : "outline"}
                onClick={() => setSelectedOption("new")}
                className={
                  selectedOption === "new" ? "bg-blue-500 w-fit" : "w-fit"
                }
              >
                Chưa có hồ sơ
              </Button>
            </div>

            {selectedOption === "existing" && (
              <div className="mt-4 p-4 border border-blue-500 rounded-md flex flex-col gap-3">
                <h3 className="text-lg font-semibold text-blue-500">
                  VUI LÒNG NHẬP MÃ SỐ BỆNH NHÂN
                </h3>
                <Input placeholder="Ví dụ: N11-XXXXXXX" className="w-[50%]" />
                <Button className="w-fit bg-blue-500">Xác nhận</Button>
                <Link className="text-red-500 text-sm" href="">
                  Bạn quên mã bệnh của mình?
                </Link>
              </div>
            )}

            {selectedOption === "new" && (
              <PatientProfileForm
                setSearchTerm={function (section: string): void {
                  throw new Error("Function not implemented.");
                }}
                setShowCreatePatientProfile={function (section: boolean): void {
                  throw new Error("Function not implemented.");
                }}
              ></PatientProfileForm>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}

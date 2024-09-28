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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  CalendarIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  Stethoscope,
  UserIcon,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { format } from "date-fns";
interface Patient {
  numberId?: string;
  fullName?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
}
export default function CreatePatientProfile() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [patient, setPatient] = useState<Patient>({});
  const { userId } = useAuth();

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
          {Object.keys(patient).length !== 0 && (
            <div className="p-4 border border-blue-500 rounded-md flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-blue-500 self-start">
                HỒ SƠ HIỆN TẠI
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 flex items-center space-x-3 border rounded-md p-4">
                  <Avatar className="w-14 h-14 border-white">
                    <AvatarFallback className="text-base font-semibold bg-secondary"></AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-base font-semibold text-start">
                      {patient.fullName}
                    </p>
                    <p className="text-slate-500 text-start">
                      CCCD: {patient.numberId}
                    </p>
                  </div>
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-3 border rounded-md p-4">
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="text-blue-500 h-4 w-4" />
                    <span className="text-slate-600 text-sm">
                      Ngày sinh: {formatDate(patient.dateOfBirth)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <UserIcon className="text-blue-500 h-4 w-4" />
                    <span className="text-slate-600 text-sm">
                      Giới tính: {patient.gender}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="text-blue-500 h-4 w-4" />
                    <span className="text-slate-600 text-sm">
                      Địa chỉ: {patient.address}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="text-blue-500 h-4 w-4" />
                    <span className="text-slate-600 text-sm">
                      Phone: {patient.phone}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MailIcon className="text-blue-500 h-4 w-4" />
                    <span className="text-slate-600 text-sm">
                      Email: {patient.email}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-4 items-center justify-center my-4">
                <Link href={`/${userId}/patient/booking-by-date`}>
                  <Button className="w-fit bg-blue-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    Đặt lịch khám theo ngày
                  </Button>
                </Link>
                <Link href={`/${userId}/patient/booking-by-doctor`}>
                  <Button className="w-fit bg-blue-500">
                    <Stethoscope className="mr-2 h-4 w-4" />
                    Đặt lịch khám theo bác sĩ
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {Object.keys(patient).length === 0 && (
            <CardDescription>
              Bạn đã từng đặt khám tại Đa khoa Laman Clinic?
            </CardDescription>
          )}
        </CardHeader>
        {Object.keys(patient).length === 0 && (
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
              <PatientProfileForm></PatientProfileForm>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}

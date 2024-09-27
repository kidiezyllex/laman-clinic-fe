"use client";

import { useState } from "react";
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
export default function CreatePatientProfile() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

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
          <CardTitle className="text-2xl font-bold text-blue-500">
            TẠO HỒ SƠ BỆNH NHÂN
          </CardTitle>
          <CardDescription>
            Bạn đã từng đặt khám tại Đa khoa Laman Clinic?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center space-x-4">
            <Button
              variant={selectedOption === "existing" ? "default" : "outline"}
              onClick={() => setSelectedOption("existing")}
              className={
                selectedOption === "existing" ? "bg-blue-500 w-fit" : "w-fit"
              }
            >
              Đã từng khám
            </Button>
            <Button
              variant={selectedOption === "new" ? "default" : "outline"}
              onClick={() => setSelectedOption("new")}
              className={
                selectedOption === "new" ? "bg-blue-500 w-fit" : "w-fit"
              }
            >
              Chưa từng khám
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
      </Card>
    </div>
  );
}

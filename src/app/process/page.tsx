"use client";
import Container from "@/components/Container";
import { ChevronRight, PieChart, Workflow } from "lucide-react";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { processSteps } from "../../../lib/hardcoded-data";
import { Button } from "@/components/ui/button";
export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="w-full h-64 flex relative mt-4">
          <Image
            layout="fill"
            src="https://res.cloudinary.com/drqbhj6ft/image/upload/v1733645303/learning-webdev-blog/clinic/Thi%E1%BA%BFt_k%E1%BA%BF_ch%C6%B0a_c%C3%B3_t%C3%AAn_dokdbk.png"
            alt="Clinic Image"
            className="object-cover rounded-md opacity-80"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-secondary opacity-80 p-4 rounded-full flex items-center gap-2">
              <Button
                size="icon"
                className="pointer-events-none rounded-full bg-blue-500 "
              >
                <Workflow className="text-white w-12 h-12" />
              </Button>
              <p className="text-blue-500 text-2xl font-bold">
                QUY TRÌNH ĐĂNG KÝ KHÁM & KHÁM BỆNH
              </p>
            </div>
          </div>
        </div>
      </div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-base">
              TRANG CHỦ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base text-blue-500">
              QUY TRÌNH ĐĂNG KÝ KHÁM & KHÁM BỆNH
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Separator></Separator>
      <p className="text-base font-semibold text-blue-500 self-center">
        QUY TRÌNH ĐĂNG KÝ KHÁM & KHÁM BỆNH{" "}
      </p>
      <div className="space-y-8">
        {processSteps.map((step, index) => (
          <div
            key={index}
            className="rounded-lg p-6 dark:bg-primary-foreground bg-primary-foreground border"
          >
            <h2 className="text-base font-semibold mb-4 flex items-center text-blue-500">
              <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                {index + 1}
              </span>
              {step.title}
            </h2>
            <ul className="space-y-2 ml-11">
              {step.details.map((detail, detailIndex) => (
                <li key={detailIndex} className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

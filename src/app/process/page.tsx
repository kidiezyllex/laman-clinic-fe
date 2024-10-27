"use client";
import Container from "@/components/Container";
import { ChevronRight, PieChart } from "lucide-react";
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
export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full h-52 flex relative mt-4">
        <Image
          layout="fill"
          src="https://res.cloudinary.com/drqbhj6ft/image/upload/v1730003049/learning-webdev-blog/clinic/quy-trinh-kham-benh-va-nhung-dieu-can-luu-y-1_c1wsab.jpg"
          alt="Hotel Image"
          className="object-cover rounded-md"
        />
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
              QUY TRÌNH ĐĂNG KÝ KHÁM BỆNH THEO HẸN
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Separator></Separator>
      <p className="text-base font-semibold text-blue-500 self-center">
        QUY TRÌNH ĐĂNG KÝ KHÁM BỆNH THEO HẸN
      </p>
      <div className="space-y-8 mb-8">
        {processSteps.map((step, index) => (
          <div
            key={index}
            className="rounded-lg p-6 dark:bg-slate-950 bg-secondary border"
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

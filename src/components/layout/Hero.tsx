"use client";
import { Calendar } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import React from "react";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import TextFlip from "../animata/text/text-flip";
import Container from "../Container";
import ArrowButton from "../animata/button/arrow-button";
import AvatarList from "../animata/list/avatar-list";

const chartData = [
  { month: "Th.1", desktop: 50000 },
  { month: "Th.2", desktop: 45000 },
  { month: "Th.3", desktop: 55000 },
  { month: "Th.4", desktop: 67000 },
  { month: "Th.5", desktop: 78000 },
  { month: "Th.6", desktop: 95000 },
];

const chartConfig = {
  desktop: {
    label: "Số lượng: ",
    color: "hsl(217.2 91.2% 59.8%)",
  },
} satisfies ChartConfig;

export default function Hero() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const router = useRouter();
  return isHomePage ? (
    <Container>
      <div className="w-[100%] grid grid-cols-1 md:grid-cols-[40%_60%] gap-5 items-center">
        <div className="w-full flex flex-col gap-3">
          <TextFlip />

          <p className="text-1xl text-zinc-400 italic">
            Laman Clinic là một nền tảng trực tuyến giúp người dùng dễ dàng đặt
            lịch hẹn tại các phòng khám đa khoa uy tín. Với giao diện thân thiện
            và quy trình đặt lịch nhanh chóng, Laman Clinic mang đến trải nghiệm
            tiện lợi, giúp khách hàng dễ dàng tìm kiếm và lựa chọn các dịch vụ y
            tế phù hợp với nhu cầu.
          </p>
          <div className="flex flex-row gap-5 mt-10">
            <ArrowButton
              text={"Đăng ký ngay"}
              onClick={() => {
                router.push("/sign-up");
              }}
            ></ArrowButton>
            <Button
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white text-white hover:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
              variant="outline"
            >
              Đặt lịch khám
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
          <AvatarList />

          {/* chart */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-5">
          <div className="flex flex-col gap-5 w-full">
            <div className="w-full h-52 flex items-center justify-center py-4 relative">
              <Image
                layout="fill"
                src="https://res.cloudinary.com/drqbhj6ft/image/upload/v1726219677/learning-webdev-blog/clinic/874555dfd40775f94b1c514fbab9d9f2_uzbdlz.jpg"
                alt="Hotel Image"
                className="object-cover rounded-md"
              />
            </div>
            <Card className="w-[100%]">
              <CardHeader>
                <CardDescription>
                  Số lượng bệnh nhân ghé thăm (2024)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 4)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar
                      dataKey="desktop"
                      fill="var(--color-desktop)"
                      radius={5}
                    >
                      <LabelList
                        position="top"
                        offset={10}
                        className="fill-foreground bg-blue-400"
                        fontSize={12}
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col gap-5 w-full">
            <div className="w-full h-56 flex items-center justify-center py-4 relative mt-3">
              <Image
                layout="fill"
                src="https://res.cloudinary.com/drqbhj6ft/image/upload/v1726219677/learning-webdev-blog/clinic/c94e2a7ccc336fe17a498d5daaf73c23_h0grxp.jpg"
                alt="Hotel Image"
                className="object-cover rounded-md"
              />
            </div>
            <div className="w-full h-60 flex items-center justify-center py-4 relative">
              <Image
                layout="fill"
                src="https://res.cloudinary.com/drqbhj6ft/image/upload/v1726219677/learning-webdev-blog/clinic/dab4d9594682ce732ebb40c4187c83d7_oqs8e6.jpg"
                alt="Hotel Image"
                className="object-cover rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  ) : null;
}

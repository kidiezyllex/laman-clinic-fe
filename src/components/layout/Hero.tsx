"use client";

import { Hotel, Pencil, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import React from "react";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Container from "../Container";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import HotelList from "../hotel/HotelList";
import { getHotels } from "@/actions/getHotels";
import TrailingImage from "../animata/image/trailing-image";
import TextFlip from "../animata/text/text-flip";

const chartData = [
  { month: "January", desktop: 50000 },
  { month: "February", desktop: 45000 },
  { month: "March", desktop: 55000 },
  { month: "April", desktop: 67000 },
  { month: "May", desktop: 78000 },
  { month: "June", desktop: 95000 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface HomeProps {
  searchParams: {
    title: string;
    country: string;
    state: string;
    city: string;
  };
}
export default function Hero() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const router = useRouter();
  return isHomePage ? (
    <Container>
      <div className="w-[100%] grid grid-cols-1 md:grid-cols-[40%_60%]  gap-5 items-center">
        <div className="w-full flex flex-col gap-3">
          {/* <p className="font-bold text-5xl tracking-wide leading-snug ">
            Đăng ký và đặt khách sạn mọi lúc!
          </p> */}
          <TextFlip />

          <p className="text-1xl text-zinc-400 italic">
            Dễ dàng đặt phòng khách sạn và đăng ký thông tin khách sạn của bạn.
            Chúng tôi cung cấp một nền tảng đơn giản và tiện lợi để bạn tìm kiếm
            và lựa chọn các khách sạn phù hợp nhất cho kỳ nghỉ của mình, cùng
            với các tùy chọn đăng ký khách sạn dễ dàng và nhanh chóng.
          </p>
          <div className="flex flex-row gap-5 mt-10">
            <Button
              className="flex flex-row gap-3 border-2 border-secondary"
              onClick={() => {
                router.push("/sign-up");
              }}
            >
              <Pencil h-4 w-4 />
              Đăng ký ngay
            </Button>
            <Button className="flex flex-row gap-3 " variant="outline">
              <Hotel h-4 w-4 />
              Đặt khách sạn
            </Button>
          </div>
          {/* chart */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-5">
          <div className="flex flex-col gap-5 w-full">
            <TrailingImage />
            <div className="w-full h-52 flex items-center justify-center py-4 relative">
              <Image
                layout="fill"
                src="https://static.designboom.com/wp-content/uploads/2023/01/portrait-firenze-bedroom-designboom.jpg"
                alt="Hotel Image"
                className="object-cover rounded-md"
              />
            </div>
            <Card className="w-[100%]">
              <CardHeader>
                <CardDescription>Lượt khách ghé thăm năm 2024</CardDescription>
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
                      tickFormatter={(value) => value.slice(0, 3)}
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
                        className="fill-foreground"
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
                src="https://static.designboom.com/wp-content/uploads/2023/01/hall-portrait-firenze-designboom.jpg"
                alt="Hotel Image"
                className="object-cover rounded-md"
              />
            </div>
            <div className="w-full h-60 flex items-center justify-center py-4 relative">
              <Image
                layout="fill"
                src="https://static.designboom.com/wp-content/uploads/2023/01/Portrait-Firenze-bathroom-designboom.jpg"
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

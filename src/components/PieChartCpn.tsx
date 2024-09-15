import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

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

export const description = "A pie chart with a label";

const chartData = [
  { service: "Khám bệnh tổng quát ", text: 35, fill: "hsl(var(--chart-1))" },
  { service: "Khám chuyên khoa ", text: 25, fill: "hsl(var(--chart-2))" },
  {
    service: "Xét nghiệm và chẩn đoán ",
    text: 20,
    fill: "hsl(var(--chart-3))",
  },
  {
    service: "Tư vấn sức khỏe trực tuyến ",
    text: 10,
    fill: "hsl(var(--chart-4))",
  },
  {
    service: "Dịch vụ chăm sóc sau điều trị ",
    text: 10,
    fill: "hsl(var(--chart-5))",
  },
];

const chartConfig = {
  text: {
    label: "text",
  },
} satisfies ChartConfig;

export function PieChartCpn() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardDescription>
          Phân Bổ Dịch Vụ Tại Phòng Khám Đa Khoa Laman Clinic
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 ">
        <ChartContainer
          config={chartConfig}
          className="w-full mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="text" label nameKey="service" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

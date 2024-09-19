"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockData = [
  { time: "00:00", glucose: 95, heartRate: 68 },
  { time: "04:00", glucose: 100, heartRate: 72 },
  { time: "08:00", glucose: 120, heartRate: 75 },
  { time: "12:00", glucose: 110, heartRate: 80 },
  { time: "16:00", glucose: 105, heartRate: 70 },
  { time: "20:00", glucose: 98, heartRate: 65 },
];

const GlucoseChart = () => (
  <Card className="flex-1">
    <CardHeader className="p-4">
      <CardTitle className="text-xl">Glucose Levels</CardTitle>
      <CardDescription>
        Blood glucose measurements throughout the day
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={mockData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[60, 180]} />
          <Tooltip
            contentStyle={{ backgroundColor: "white", borderColor: "#3b82f6" }}
            labelStyle={{ color: "#3b82f6" }}
          />
          <Line
            type="monotone"
            dataKey="glucose"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", strokeWidth: 2 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const HeartRateChart = () => (
  <Card className="flex-1">
    <CardHeader className="p-4">
      <CardTitle className="text-xl">Heart Rate</CardTitle>
      <CardDescription>
        Heart rate measurements throughout the day
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={mockData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[40, 120]} />
          <Tooltip
            contentStyle={{ backgroundColor: "white", borderColor: "#3b82f6" }}
            labelStyle={{ color: "#3b82f6" }}
          />
          <Area
            type="monotone"
            dataKey="heartRate"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default function HealthMetricsCharts() {
  return (
    <div className="col-span-2 gap-4 flex flex-col">
      <GlucoseChart />
      <HeartRateChart />
    </div>
  );
}

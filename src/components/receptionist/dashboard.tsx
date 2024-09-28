import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  UserIcon,
  UsersIcon,
  CalendarIcon,
  Briefcase,
  ArrowRight,
} from "lucide-react";

interface DashboardItem {
  title: string;
  icon: React.ElementType;
  count: number;
  color: string;
}

interface PersonData {
  name: string;
  email: string;
  avatar: string;
  status: "Approved" | "Pending";
}

interface RecentCardProps {
  title: string;
  data: PersonData[];
}

function RecentCard({ title, data }: RecentCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {data.map((item, index) => (
            <li key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={item.avatar} alt={item.name} />
                  <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  View
                </Button>
                <Badge
                  variant={
                    item.status === "Approved" ? "default" : "destructive"
                  }
                >
                  {item.status}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const dashboardItems: DashboardItem[] = [
    { title: "Doctors", icon: UserIcon, count: 48, color: "bg-blue-500" },
    { title: "Patients", icon: UsersIcon, count: 1240, color: "bg-green-500" },
    {
      title: "Appointments",
      icon: CalendarIcon,
      count: 20,
      color: "bg-yellow-500",
    },
    { title: "Services", icon: Briefcase, count: 15, color: "bg-purple-500" },
  ];

  const doctorsData: PersonData[] = [
    {
      name: "Dr. John Doe",
      email: "john@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "Approved",
    },
    {
      name: "Dr. Jane Smith",
      email: "jane@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "Pending",
    },
    // Add more doctor data as needed
  ];

  const patientsData: PersonData[] = [
    {
      name: "Alice Johnson",
      email: "alice@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "Approved",
    },
    {
      name: "Bob Williams",
      email: "bob@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "Pending",
    },
    // Add more patient data as needed
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 rounded-lg bg-background shadow-sm p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardItems.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <item.icon className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.count}</div>
            </CardContent>
            <CardFooter>
              <Button
                variant="ghost"
                className="p-0 h-auto text-xs text-blue-500 hover:text-blue-700"
              >
                View details
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentCard title="Recent Doctors" data={doctorsData} />
        <RecentCard title="Recent Patients" data={patientsData} />
      </div>
    </div>
  );
}

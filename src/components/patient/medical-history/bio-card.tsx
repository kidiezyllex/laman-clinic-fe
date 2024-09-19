import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarDays,
  FileText,
  Pill,
  Activity,
  ChevronLeft,
  ChevronRight,
  User,
  Cake,
  Ruler,
  Droplet,
} from "lucide-react";
interface PatientBioProps {
  items: {
    name: string;
    age: Number;
    gender: string;
    bloodType: string;
    height: string;
  };
}
export default function BioCard({ items }: PatientBioProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardHeader className="flex flex-col items-center gap-2">
          <Avatar className="h-16 w-16">
            {/* <AvatarImage src={avatarUrl} alt={name} /> */}
            <AvatarFallback>
              {items.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">{items.name}</h2>
        </CardHeader>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 border border-primary flex items-center justify-center rounded-full">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="font-base">{items.gender}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 border border-primary flex items-center justify-center rounded-full">
              <Cake className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Age</p>
              <p className="font-base">{items.age + ""} years</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 border border-primary flex items-center justify-center rounded-full">
              <Ruler className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Height</p>
              <p className="font-base">{items.height}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 border border-primary flex items-center justify-center rounded-full">
              <Droplet className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Blood type</p>
              <p className="font-base">{items.bloodType}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

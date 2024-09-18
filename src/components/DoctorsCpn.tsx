import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react";
import GithubCardShiny from "./animata/card/github-card-shiny";

interface DoctorsProps {
  items: any[];
}

export function DoctorsCpn({ items }: DoctorsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
      {items.map((doctor, index) => (
        <GithubCardShiny key={index} className="flex flex-col ">
          <CardHeader className="flex-row gap-4 items-center">
            <Avatar className="h-20 w-20">
              <AvatarImage src={doctor.image} alt={doctor.name} />
            </Avatar>
            <div className="flex flex-col gap-2">
              <CardTitle className="text-lg text-slate-800 dark:text-slate-50">
                {doctor.name}
              </CardTitle>
              <div className="flex flex-row gap-1">
                <Button className="w-fit px-2 rounded-full h-6">
                  <p className="text-xs font-medium">{doctor.specialty}</p>
                </Button>
                <Button className="w-fit px-2 rounded-full h-6">
                  <p className="text-xs font-medium">20 năm kinh nghiệm</p>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="italic text-zinc-400">
              {doctor.description}
            </CardDescription>
          </CardContent>
          <CardFooter className="flex flex-row justify-between gap-2 px-12">
            <Instagram h-2 w-2 className="dark:text-slate-50 text-slate-800" />
            <Facebook h-2 w-2 className="dark:text-slate-50 text-slate-800" />
            <Linkedin h-2 w-2 className="dark:text-slate-50 text-slate-800" />
            <Mail h-2 w-2 className="dark:text-slate-50 text-slate-800" />
          </CardFooter>
        </GithubCardShiny>
      ))}
    </div>
  );
}

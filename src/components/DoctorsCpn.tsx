import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DoctorsProps {
  items: any[];
}

export function DoctorsCpn({ items }: DoctorsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((doctor, index) => (
        <Card key={index} className="flex flex-col">
          <CardHeader className="flex-row gap-4 items-center">
            <Avatar className="h-20 w-20">
              <AvatarImage src={doctor.image} alt={doctor.name} />
            </Avatar>
            <div className="flex flex-col gap-2">
              <CardTitle className="text-lg">{doctor.name}</CardTitle>
              <div className="p-1 px-2 flex flex-row items-center justify-center bg-slate-700 rounded-full w-fit">
                {doctor.specialty}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="italic text-zinc-400">
              {doctor.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

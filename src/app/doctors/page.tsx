"use client";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
interface TabsProps {
  items: any[];
}

export default function Doctors({ items }: TabsProps) {
  return (
    // <Card className="p-4 rounded">
    //   <Tabs defaultValue="service1" className="w-[100%]">
    //     <TabsList className="w-full grid grid-cols-3">
    //       <TabsTrigger className="text-sm" value="service1">
    //         Chuyên ngành
    //       </TabsTrigger>
    //       <TabsTrigger className="text-sm" value="service2">
    //         Bệnh thường gặp
    //       </TabsTrigger>
    //       <TabsTrigger className="text-sm" value="service3">
    //         Triệu chứng
    //       </TabsTrigger>
    //     </TabsList>
    //   </Tabs>
    // </Card>
    <div className="grid md:grid-cols-[2fr_8fr] gap-5 h-full">
      <Card className="flex flex-col gap-3 p-3">
        <Input></Input>
        <Button variant="secondary">Chuyên ngành</Button>
        <Button variant="secondary">Triệu chứng</Button>
        <Button variant="secondary">Bệnh thường gặp</Button>
      </Card>
      <Card></Card>
    </div>
  );
}

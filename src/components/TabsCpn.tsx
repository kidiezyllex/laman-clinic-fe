import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
interface TabsProps {
  items: any[];
}

export function TabsCpn({ items }: TabsProps) {
  return (
    <Tabs defaultValue="service1" className="w-full overflow-hidden">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger className="text-xs" value="service1">
          Khám tổng quát
        </TabsTrigger>
        <TabsTrigger className="text-xs" value="service2">
          Khám chuyên khoa
        </TabsTrigger>
        <TabsTrigger className="text-xs" value="service3">
          Xét nghiệm, chẩn đoán
        </TabsTrigger>
        <TabsTrigger className="text-xs" value="service4">
          Tư vấn trực tuyến
        </TabsTrigger>
        <TabsTrigger className="text-xs" value="service5">
          Chăm sóc sau điều trị
        </TabsTrigger>
      </TabsList>
      {items.map((item, index) => (
        <TabsContent value={"service" + item.id} key={index}>
          <Card>
            <CardHeader>
              <CardTitle>{item.text2}</CardTitle>
              <CardDescription>{item.text}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row items-center gap-5 rounded relative w-full h-72 overflow-hidden">
              <div className="w-[70%] relative h-full z-0">
                <Image
                  src={item.image}
                  alt={"image" + item.id}
                  className="object-cover rounded "
                  layout="fill" // Use fill for container sizing
                />
              </div>
              <Button>Xem chi tiết</Button>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}

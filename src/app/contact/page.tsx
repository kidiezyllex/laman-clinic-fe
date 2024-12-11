"use client";
import {
  Building2,
  Facebook,
  HeartPulse,
  MessageCircle,
  PhoneCall,
  Settings,
  Stethoscope,
} from "lucide-react";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="w-full h-64 flex relative mt-4">
          <Image
            layout="fill"
            src="https://res.cloudinary.com/drqbhj6ft/image/upload/v1733645303/learning-webdev-blog/clinic/Thi%E1%BA%BFt_k%E1%BA%BF_ch%C6%B0a_c%C3%B3_t%C3%AAn_dokdbk.png"
            alt="Clinic Image"
            className="object-cover rounded-md opacity-80"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-secondary opacity-80 p-4 rounded-full flex items-center gap-2">
              <Button
                size="icon"
                className="pointer-events-none rounded-full bg-blue-500 "
              >
                <PhoneCall className="text-white w-12 h-12" />
              </Button>
              <p className="text-blue-500 text-2xl font-bold">LIÊN HỆ HỖ TRỢ</p>
            </div>
          </div>
        </div>
      </div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-base">
              TRANG CHỦ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base text-blue-500">
              LIÊN HỆ HỖ TRỢ
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Separator></Separator>
      <div className="w-full grid md:grid-cols-3 gap-4 mt-4 bg-primary-foreground p-6 rounded-md border">
        <div className="space-y-6 col-span-1 text-slate-600 dark:text-slate-300">
          <div>
            <h2 className="text-md font-medium text-blue-500 mb-2">
              THÔNG TIN CHI TIẾT
            </h2>
            <h3 className="text-lg font-semibold mb-4">
              ĐỊA CHỈ KHÁM CHỮA BỆNH
            </h3>
          </div>

          <div className="flex items-start space-x-4">
            <Building2 className="w-6 h-6 text-blue-500 mt-1" />
            <div>
              <h4 className="text-md font-medium">
                BỆNH VIỆN ĐẠI HỌC Y DƯỢC TPHCM
              </h4>
              <p className="text-sm text-blue-500">
                215 Hồng Bàng, P.11, Q.5, TP.HCM
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Stethoscope className="w-6 h-6 text-blue-500" />
            <div>
              <p className="font-medium text-md">TƯ VẤN CHUYÊN MÔN</p>
              <p className="text-blue-500">1900-7178</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Settings className="w-6 h-6 text-blue-500" />
            <div>
              <p className="font-medium text-md">TƯ VẤN KỸ THUẬT</p>
              <p className="text-blue-500">1900-2115</p>
            </div>
          </div>
        </div>

        <div className="col-span-2 text-slate-600 dark:text-slate-300">
          <h2 className="text-md font-medium text-blue-500 mb-2">LIÊN HỆ</h2>
          <h3 className="text-lg font-semibold mb-4">
            GIẢI ĐÁP THẮC MẮC, GÓP Ý VỀ DỊCH VỤ
          </h3>
          <form className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input id="name" placeholder="Nhập họ và tên" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Địa chỉ email</Label>
                <Input id="email" type="email" placeholder="Nhập email" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" placeholder="Nhập số điện thoại" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Chọn vấn đề của bạn</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Nhấn để chọn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Vấn đề kỹ thuật</SelectItem>
                    <SelectItem value="service">Vấn đề dịch vụ</SelectItem>
                    <SelectItem value="other">Vấn đề khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 w-[100%]">
              <Label htmlFor="message">Nhập nội dung cần trợ giúp</Label>
              <Textarea
                id="message"
                placeholder="Nhập nội dung"
                className="min-h-[120px]"
              />
            </div>
            <Button className="w-fit bg-blue-500 hover:bg-blue-600 flex flex-row gap-3">
              Gửi góp ý
            </Button>
          </form>
        </div>
      </div>

      <div className="w-full text-center mt-4 bg-primary-foreground p-6 rounded-md border flex flex-col gap-4 items-center text-slate-600 dark:text-slate-300">
        <div className="w-fit border border-blue-300 font-semibold px-4 py-2 bg-blue-50 text-blue-500 rounded-full flex flex-row gap-3 items-center">
          Hỗ trợ
          <Button
            size="icon"
            className="pointer-events-none rounded-full bg-blue-400 "
          >
            <PhoneCall className="text-white w-12 h-12" />
          </Button>
        </div>
        <p className="text-lg font-semibold uppercase">
          Các hình thức hỗ trợ từ UMC Đặt Khám
        </p>
        <p className="text-gray-500">Bệnh nhân chọn các hình thức bên dưới</p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mt-4 text-slate-600 dark:text-slate-300">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <HeartPulse className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="font-medium mb-2 text-slate-600 dark:text-slate-300">
              Hỗ trợ chuyên môn
            </p>
            <p className="text-blue-500">1900-7178</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <PhoneCall className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <p className="font-medium mb-2 text-slate-600 dark:text-slate-300">
              Hỗ trợ kỹ thuật
            </p>
            <p className="text-blue-500">1900-2115</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Facebook className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <p className="font-medium mb-2 text-slate-600 dark:text-slate-300">
              Fanpage Facebook
            </p>
            <Button variant="link" className="text-blue-500 ">
              Bấm vào đây
            </Button>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <MessageCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <p className="font-medium mb-2 text-slate-600 dark:text-slate-300">
              Hỗ trợ ZALO
            </p>
            <Button variant="link" className="text-blue-500">
              Bấm vào đây
            </Button>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <MessageCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <p className="font-medium mb-2 text-slate-600 dark:text-slate-300">
              Chat Facebook
            </p>
            <Button variant="link" className="text-blue-500">
              Bấm vào đây
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

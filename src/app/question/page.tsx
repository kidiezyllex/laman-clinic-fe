"use client";
import { Search } from "lucide-react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const questionData = [
  {
    id: 1,
    trigger:
      "Đối tượng bệnh nhân nào có thể sử dụng phần mềm để đăng ký khám bệnh?",
    content: `Tất cả người bệnh đều có thể sử dụng phần mềm để đăng ký khám bệnh.

Tuy nhiên, phần mềm chỉ phù hợp cho những người bệnh có kế hoạch khám chữa bệnh chủ động, hoặc tình trạng bệnh KHÔNG khẩn cấp.

Trong trường hợp CẤP CỨU, người nhà nên đưa người bệnh đến cơ sở y tế gần nhất hoặc gọi số cấp cứu 115 để được hỗ trợ.`,
  },
  {
    id: 2,
    trigger: "Đăng ký khám qua phần mềm có tốn phí không?",
    content: `Có!
Khi đăng ký khám bệnh qua phần mềm, ngoài tiền khám bạn phải trả thêm phí tiện ích cho dịch vụ trực tuyến.`,
  },
  {
    id: 3,
    trigger: "Các loại phí khi sử dụng phần mềm để đăng ký khám bệnh là gì?",
    content: `Tiền khám: là số tiền bạn trả cho dịch vụ khám bệnh tại bệnh viện, thu theo quy định.

Phí tiện ích: là phí hỗ trợ việc đăng ký trực tuyến qua phần mềm.`,
  },
  {
    id: 4,
    trigger: "Có cần tài khoản khi đăng ký khám qua phần mềm không?",
    content: `Có, bạn cần có tài khoản để đăng nhập vào phần mềm trước khi tiến hành đăng ký khám bệnh. Điều này giúp hệ thống lưu trữ và quản lý lịch sử khám của bạn dễ dàng hơn.`,
  },
  {
    id: 5,
    trigger: "Làm sao để huỷ lịch khám đã đăng ký qua phần mềm?",
    content: `Bạn có thể huỷ lịch khám đã đăng ký trong mục "Lịch hẹn của tôi" trong phần mềm. Chỉ cần chọn lịch hẹn và bấm nút huỷ để hoàn tất.`,
  },
  {
    id: 6,
    trigger: "Có thể thay đổi lịch khám đã đăng ký không?",
    content: `Có, bạn có thể thay đổi lịch khám đã đăng ký bằng cách chọn lịch hẹn và chọn thời gian mới trong phần mềm. Lưu ý, thay đổi chỉ khả dụng nếu lịch hẹn chưa đến giờ.`,
  },
  {
    id: 7,
    trigger: "Phần mềm có hỗ trợ đặt lịch khám với bác sĩ cụ thể không?",
    content: `Phần mềm cho phép bạn chọn bác sĩ theo chuyên khoa mong muốn nếu bác sĩ đó có lịch khám khả dụng vào thời gian bạn chọn.`,
  },
  {
    id: 8,
    trigger: "Làm thế nào để được nhắc nhở trước lịch hẹn khám?",
    content: `Phần mềm sẽ gửi thông báo nhắc nhở qua tin nhắn hoặc email mà bạn đã đăng ký trước thời gian khám để đảm bảo bạn không bỏ lỡ lịch hẹn.`,
  },
  {
    id: 9,
    trigger: "Có hỗ trợ tư vấn trực tuyến qua phần mềm không?",
    content: `Có, phần mềm cung cấp tính năng tư vấn trực tuyến cho những trường hợp không cần gặp trực tiếp. Bạn có thể đặt lịch tư vấn và được kết nối với bác sĩ qua video.`,
  },
];

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full h-52 flex relative mt-4">
        <Image
          layout="fill"
          src="https://res.cloudinary.com/drqbhj6ft/image/upload/v1730003049/learning-webdev-blog/clinic/quy-trinh-kham-benh-va-nhung-dieu-can-luu-y-1_c1wsab.jpg"
          alt="Hotel Image"
          className="object-cover rounded-md"
        />
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
              GIẢI ĐÁP THẮC MẮC
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Separator></Separator>
      <div className="grid grid-cols-4 mt-4 gap-6 ">
        {/* Sidebar */}
        <div className="col-span-1 flex flex-col gap-3 dark:bg-slate-950 border rounded-md p-4">
          <h2 className="text-base font-semibold text-blue">
            TÌM NHANH CÂU HỎI
          </h2>
          <div className="flex flex-row gap-2">
            <Input placeholder="Nhập tìm kiếm" className="pr-10" />
            <Button variant={"outline"}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2 p-2 border rounded-md">
            <h3 className="text-sm text-blue-500">Vấn đề chung</h3>
            <h3 className="text-sm">Vấn đề về tài khoản</h3>
            <h3 className="text-sm">Vấn đề về quy trình đặt khám</h3>
            <h3 className="text-sm">Vấn đề về thanh toán</h3>
          </div>
        </div>

        <div className="col-span-3 flex-1">
          <Accordion type="single" collapsible className="space-y-4">
            {questionData.map((item) => (
              <AccordionItem value={`item-${item.id}`}>
                <AccordionTrigger className="text-left bg-secondary px-4 dark:bg-slate-950 border dark:border-slate-950">
                  {item.trigger}
                </AccordionTrigger>
                <AccordionContent className="border dark:border-slate-950 p-4 border-t-0">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

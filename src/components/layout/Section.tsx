"use client";
import React, { useRef } from "react";
import Container from "../Container";

import Slider from "../Slider";
import { Separator } from "@/components/ui/separator";
import { PieChartCpn } from "../PieChartCpn";
import { TabsCpn } from "../TabsCpn";
import { DoctorsCpn } from "../DoctorsCpn";
import HuggingFaceAssistant from "../HuggingFaceAssistant";
import { usePathname, useRouter } from "next/navigation";

const treatments = [
  {
    id: 1,
    image:
      "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726355196/learning-webdev-blog/clinic/kham-suc-khoe-tong-quat-dinh-ky-6-thang-den-1-nam_ugh4tc.jpg",
    text: "Khám sức khỏe định kỳ",
  },
  {
    id: 2,
    image:
      "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726355197/learning-webdev-blog/clinic/tang-1-lan-kham-chuyen-khoa-new_rrb1ft.jpg",
    text: "Ưu đãi cho lần khám chuyên khoa",
  },
  {
    id: 3,
    image:
      "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726355196/learning-webdev-blog/clinic/goi-kham-suc-khoe-tong-quat-thumb_hm3a2j.jpg",
    text: "Tặng ngẫu nhiên cho bệnh nhân may mắn",
  },
  {
    id: 4,
    image:
      "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726355196/learning-webdev-blog/clinic/89739646_2724888877546684_8123526599925563392_o_q1ojbn.jpg",
    text: "Tư vấn miễn phí",
  },
  {
    id: 5,
    image:
      "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726355196/learning-webdev-blog/clinic/the-member-khoa-da-lieu-JW_xuhz5w.jpg",
    text: "Chính sách thẻ thành viên",
  },
];
const services = [
  {
    id: 1,
    image:
      "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726355196/learning-webdev-blog/clinic/kham-suc-khoe-tong-quat-dinh-ky-6-thang-den-1-nam_ugh4tc.jpg",
    text: "Đây là dịch vụ phổ biến nhất, nhắm đến những khách hàng cần khám sức khỏe định kỳ.",
    text2: "Khám bệnh tổng quát - 35%",
  },
  {
    id: 2,
    image:
      "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726355197/learning-webdev-blog/clinic/tang-1-lan-kham-chuyen-khoa-new_rrb1ft.jpg",
    text: "Bao gồm các dịch vụ như khám tai mũi họng, tim mạch, nội tiết, tạo niềm tin cho khách hàng về sự chuyên nghiệp.",
    text2: "Khám chuyên khoa - 25%",
  },
  {
    id: 3,
    image:
      "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726355196/learning-webdev-blog/clinic/goi-kham-suc-khoe-tong-quat-thumb_hm3a2j.jpg",
    text: "Khuyến khích khách hàng đến khám với các ưu đãi về gói xét nghiệm.",
    text2: "Xét nghiệm và chẩn đoán - 20%",
  },
  {
    id: 4,
    image:
      "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726355196/learning-webdev-blog/clinic/89739646_2724888877546684_8123526599925563392_o_q1ojbn.jpg",
    text: "Dịch vụ tư vấn miễn phí hoặc giảm giá nhằm lôi kéo khách hàng đăng ký khám.",
    text2: "Tư vấn sức khỏe trực tuyến - 10%",
  },
  {
    id: 5,
    image:
      "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726355196/learning-webdev-blog/clinic/the-member-khoa-da-lieu-JW_xuhz5w.jpg",
    text: "Chăm sóc sau khi điều trị, tạo trải nghiệm tốt và giữ chân khách hàng quay lại.",
    text2: "Dịch vụ chăm sóc sau điều trị - 10%",
  },
];

const doctors = [
  {
    name: "Bác sĩ Nguyễn Thị Lan",
    specialty: "Tim mạch",
    description:
      "Bác sĩ tim mạch giàu kinh nghiệm chuyên về sức khỏe tim mạch và chăm sóc phòng ngừa.",
    image:
      "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726370628/learning-webdev-blog/clinic/a254b7ebd6e3bb2d1f1c313dfe7a5514_klrfbo.png",
  },
  {
    name: "Bác sĩ Trần Minh Anh",
    specialty: "Nhi khoa",
    description:
      "Bác sĩ nhi khoa tận tâm với hơn 15 năm kinh nghiệm trong lĩnh vực chăm sóc sức khỏe trẻ em.",
    image:
      "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726370628/learning-webdev-blog/clinic/62ecb1441fcc0f236adb69327e17675a_apatzc.png",
  },
  {
    name: "Bác sĩ Lê Thu Hà",
    specialty: "Thần kinh",
    description:
      "Chuyên gia thần kinh học, tập trung vào các phương pháp điều trị sáng tạo cho các rối loạn thần kinh.",
    image:
      "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726370628/learning-webdev-blog/clinic/74ff0190605c1ce177d7c8d31827341f_kldgos.png",
  },
  {
    name: "Bác sĩ Phạm Quang Hưng",
    specialty: "Chỉnh hình",
    description:
      "Bác sĩ phẫu thuật chỉnh hình chuyên về y học thể thao và thay thế khớp.",
    image:
      "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726370628/learning-webdev-blog/clinic/1a25ed54063c55e6e2c1ab3010c86446_z5cjsr.png",
  },
];

export default function Section() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const router = useRouter();
  return isHomePage ? (
    <div className="w-full mt-3">
      <Container>
        <HuggingFaceAssistant></HuggingFaceAssistant>
      </Container>
      <Container>
        <p className="font-bold text-2xl my-5 text-blue-400">
          Chúng tôi có những ưu đãi
        </p>
        <Slider items={treatments}></Slider>
      </Container>
      <Separator></Separator>
      <Container>
        <p className="font-bold text-2xl my-5 text-blue-400">
          Dịch vụ phổ biến
        </p>
        <div className="grid md:grid-cols-[4fr_6fr] gap-5">
          <PieChartCpn></PieChartCpn>
          <TabsCpn items={services}></TabsCpn>
        </div>
      </Container>
      <Separator></Separator>
      <Container>
        <p className="font-bold text-2xl my-5 text-blue-400">Tìm bác sĩ</p>
        <DoctorsCpn items={doctors}></DoctorsCpn>
      </Container>
    </div>
  ) : null;
}

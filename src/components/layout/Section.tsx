"use client";
import React, { useRef } from "react";
import Container from "../Container";

import Slider from "../Slider";
import { Separator } from "@/components/ui/separator";
import { PieChartCpn } from "../PieChartCpn";
import { TabsCpn } from "../TabsCpn";

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
export default function Section() {
  return (
    <div className="w-full mt-3">
      <Separator></Separator>
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
    </div>
  );
}

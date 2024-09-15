"use client";
import React, { useRef } from "react";
import Container from "../Container";

import Slider from "../Slider";
import { Separator } from "@/components/ui/separator";
import { PieChartCpn } from "../PieChartCpn";

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
export default function Section() {
  return (
    <div className="w-full mt-3">
      <Separator></Separator>
      <Container>
        <p className="font-bold text-2xl my-3 text-blue-400">
          Chúng tôi có những ưu đãi
        </p>
        <Slider items={treatments}></Slider>
      </Container>
      <Separator></Separator>
      <Container>
        <p className="font-bold text-2xl my-3 text-blue-400">Về chúng tôi</p>
        <div className="grid md:grid-col-2">
          <PieChartCpn></PieChartCpn>
        </div>
      </Container>
    </div>
  );
}

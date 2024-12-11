"use client";

import { Separator } from "@/components/ui/separator";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarImage } from "../ui/avatar";

export default function Footer() {
  const pathname = usePathname();
  const isHomePage =
    pathname === "/" ||
    pathname === "/process" ||
    pathname === "/question" ||
    pathname === "/contact";
  const router = useRouter();
  return isHomePage ? (
    <div className="mx-auto p-8 dark:bg-slate-950 border mt-8 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex flex-row justify-center">
          <div>
            <Link
              className="flex flex-row items-center gap-3 justify-start"
              href={"/"}
              onClick={() => router.push("/")}
            >
              <Avatar className=" border-blue-500 border-2">
                <AvatarImage
                  src={
                    "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726685609/learning-webdev-blog/clinic/medical-care-logo-icon-design-vector-22560842_j6xhlk.jpg"
                  }
                  alt="Laman Clinic"
                />
              </Avatar>
              <h3 className="text-base text-blue-500 font-semibold">
                Phòng khám Đa Khoa Laman Clinic
              </h3>
            </Link>

            <p className="text-sm mt-3">
              Cung cấp dịch vụ chăm sóc sức khỏe chất lượng cho cộng đồng kể từ
              năm 1995.
            </p>
          </div>
        </div>
        <div className="flex flex-row justify-center">
          <div>
            {" "}
            <h4 className="text-md font-semibold mb-4 text-blue-500">
              Liên hệ chúng tôi
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-sm">info@healthcareclinic.com</span>
              </li>
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">Gò Vấp, T.P Hồ Chí Minh</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-row justify-center">
          <div>
            <h4 className="text-md font-semibold mb-4 text-blue-500">
              Giờ mở cửa
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  Thứ 2 - Thứ 6: 8:00 AM - 8:00 PM
                </span>
              </li>
              <li className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">Thứ 7: 9:00 AM - 5:00 PM</span>
              </li>
              <li className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">Chủ Nhật: Đóng cửa</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-row justify-center">
          <div>
            {" "}
            <h4 className="text-md font-semibold mb-4 text-blue-500">
              Liên kết nhanh
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-sm hover:underline">
                  Quy trình
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="text-sm hover:underline">
                  Hỏi đáp
                </Link>
              </li>
              <li>
                <Link href="/appointments" className="text-sm hover:underline">
                  Điều khoản dịch vụ
                </Link>
              </li>
              <li>
                <Link href="/emergency" className="text-sm hover:underline">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Separator className="my-8 bg-slate-700" />
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">
          &copy; 2023 Laman Clinic. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="#" className="hover:text-primary-foreground/80">
            <Facebook className="w-5 h-5" />
          </Link>
          <Link href="#" className="hover:text-primary-foreground/80">
            <Twitter className="w-5 h-5" />
          </Link>
          <Link href="#" className="hover:text-primary-foreground/80">
            <Mail className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  ) : null;
}

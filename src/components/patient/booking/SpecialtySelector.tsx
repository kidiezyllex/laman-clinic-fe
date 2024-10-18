"use client";

import { useState, useCallback, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ArrowButton from "@/components/animata/button/arrow-button";
import axios from "axios";
const specialties = [
  { id: 1, name: "Nội Tổng quát", price: 250000 },
  { id: 2, name: "Nhi khoa", price: 300000 },
  { id: 3, name: "Tim mạch", price: 350000 },
  { id: 4, name: "Thần kinh", price: 400000 },
  { id: 5, name: "Hô hấp", price: 300000 },
  { id: 6, name: "Da liễu", price: 250000 },
  { id: 7, name: "Tiêu hóa", price: 350000 },
  { id: 8, name: "Cơ xương khớp", price: 300000 },
  { id: 9, name: "Tai Mũi Họng", price: 250000 },
  { id: 10, name: "Mắt", price: 250000 },
  { id: 11, name: "Sản phụ khoa", price: 350000 },
  { id: 12, name: "Nam khoa", price: 300000 },
  { id: 13, name: "Nội tiết", price: 350000 },
  { id: 14, name: "Thận - Tiết niệu", price: 300000 },
  { id: 15, name: "Ung bướu", price: 400000 },
  { id: 16, name: "Tâm thần", price: 350000 },
  { id: 17, name: "Dinh dưỡng", price: 250000 },
  { id: 18, name: "Huyết học", price: 350000 },
  { id: 19, name: "Ngoại Tổng quát", price: 300000 },
  { id: 20, name: "Chấn thương chỉnh hình", price: 350000 },
  { id: 21, name: "Phẫu thuật thẩm mỹ", price: 500000 },
  { id: 22, name: "Nha khoa", price: 300000 },
  { id: 23, name: "Vật lý trị liệu", price: 250000 },
  { id: 24, name: "Y học cổ truyền", price: 200000 },
  { id: 25, name: "Dị ứng - Miễn dịch", price: 350000 },
  { id: 26, name: "Truyền nhiễm", price: 300000 },
  { id: 27, name: "Phục hồi chức năng", price: 250000 },
  { id: 28, name: "Tạo hình thẩm mỹ", price: 450000 },
  { id: 29, name: "Lão khoa", price: 300000 },
  { id: 30, name: "Giải phẫu bệnh", price: 400000 },
];

export default function SpecialtySelector({
  setActiveSection,
  setSelectedSpe,
}: {
  setActiveSection: (section: string) => void;
  setSelectedSpe: (section: number) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [specializations, setSpecializations] = useState<[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<number | null>(
    null
  );

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    []
  );

  useEffect(() => {
    const fetchSpecializations = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/specializations`
      );
      const filteredSpecialties = response.data.filter((specialty: string) =>
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSpecializations(filteredSpecialties);
    };

    fetchSpecializations();
  }, [searchTerm]);

  return (
    <div className="w-full flex flex-col gap-4">
      <p className="text-base font-semibold text-blue-500">
        VUI LÒNG CHỌN MỘT CHUYÊN KHOA
      </p>
      <Input
        type="text"
        placeholder="Tìm kiếm chuyên khoa..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full"
      />
      <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-background">
        {specializations.map((specialty) => (
          <div
            key={specialty}
            className="flex justify-between items-center py-2 border-b"
          >
            <div>
              <h3 className="font-medium">{specialty}</h3>
              <p className="text-sm text-gray-500">
                {/* {specialty.price.toLocaleString("vi-VN")} VNĐ */}
              </p>
            </div>
            <Button
              onClick={() => {
                setSelectedSpecialty(specialty);
                setSelectedSpe(specialty);
              }}
              variant={selectedSpecialty === specialty ? "default" : "outline"}
            >
              Chọn
            </Button>
          </div>
        ))}
      </ScrollArea>
      <div className="flex flex-row justify-between">
        <Button
          className="w-fit"
          onClick={() => {
            setActiveSection("calendarSelector");
          }}
          variant={"outline"}
        >
          Quay lại
        </Button>
        <ArrowButton
          disabled={!selectedSpecialty}
          className="w-fit"
          text={"Tiếp tục"}
          onClick={() => {
            setActiveSection("roomSelector");
          }}
        ></ArrowButton>
      </div>
    </div>
  );
}

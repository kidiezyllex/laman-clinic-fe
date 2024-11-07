"use client";

import { useState, useCallback, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ArrowButton from "@/components/animata/button/arrow-button";
import axios from "axios";

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
          className="w-fit dark:hover:bg-slate-900"
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

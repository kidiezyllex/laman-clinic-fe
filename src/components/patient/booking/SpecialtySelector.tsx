"use client";

import { useState, useCallback, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ArrowButton from "@/components/animata/button/arrow-button";
import axios from "axios";
import { renderSpecialty } from "../../../../lib/utils";
import { CircleCheckBig, CirclePlus } from "lucide-react";

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
        renderSpecialty(specialty)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setSpecializations(filteredSpecialties);
    };

    fetchSpecializations();
  }, [searchTerm]);

  return (
    <div className="w-full flex flex-col gap-4">
      <p className="text-base font-semibold text-blue-500 ml-4 md:ml-0">
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
            <span className="font-semibold text-slate-600 dark:text-primary">
              <h3 className="font-medium">{renderSpecialty(specialty)}</h3>
            </span>
            <Button
              onClick={() => {
                setSelectedSpecialty(specialty);
                setSelectedSpe(specialty);
              }}
              className={
                selectedSpecialty === specialty
                  ? "flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white text-white hover:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                  : "text-slate-600 dark:text-primary"
              }
              variant={selectedSpecialty === specialty ? "default" : "outline"}
            >
              Chọn
              {selectedSpecialty === specialty ? (
                <CircleCheckBig className="h-4 w-4" />
              ) : (
                <CirclePlus className="h-4 w-4" />
              )}
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

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Brain,
  Eye,
  Bone,
  Stethoscope,
  Baby,
  Scissors,
  Pill,
  Search,
} from "lucide-react";

const specialties = [
  {
    name: "Tim mạch",
    icon: Heart,
    description:
      "Tim mạch là một nhánh của y học liên quan đến các rối loạn của tim và hệ tim mạch.",
    commonConditions: ["Bệnh tim", "Tăng huyết áp", "Rối loạn nhịp tim"],
    procedures: ["Siêu âm tim", "Can thiệp mạch vành", "Thông tim"],
    specialists: ["Bác sĩ Emily Johnson", "Bác sĩ Michael Chen"],
  },
  {
    name: "Thần kinh",
    icon: Brain,
    description:
      "Thần kinh học tập trung vào các rối loạn của hệ thần kinh, bao gồm não, tủy sống và dây thần kinh.",
    commonConditions: ["Động kinh", "Đột quỵ", "Đa xơ cứng"],
    procedures: ["Điện não đồ (EEG)", "Chụp MRI", "Chọc dò dịch não tủy"],
    specialists: ["Bác sĩ Sarah Patel", "Bác sĩ David Kim"],
  },
  {
    name: "Nhãn khoa",
    icon: Eye,
    description:
      "Nhãn khoa là nhánh của y học liên quan đến chẩn đoán, điều trị và phòng ngừa các bệnh về mắt và hệ thống thị giác.",
    commonConditions: [
      "Đục thủy tinh thể",
      "Bệnh tăng nhãn áp",
      "Thoái hóa điểm vàng",
    ],
    procedures: [
      "Phẫu thuật đục thủy tinh thể",
      "Phẫu thuật LASIK",
      "Quang đông võng mạc",
    ],
    specialists: ["Bác sĩ Lisa Wong", "Bác sĩ Robert Taylor"],
  },
  {
    name: "Chỉnh hình",
    icon: Bone,
    description:
      "Chỉnh hình là nhánh của y học liên quan đến hệ cơ xương khớp.",
    commonConditions: ["Viêm khớp", "Gãy xương", "Chấn thương thể thao"],
    procedures: ["Thay khớp", "Nội soi khớp", "Phẫu thuật hợp nhất cột sống"],
    specialists: ["Bác sĩ James Anderson", "Bác sĩ Maria Rodriguez"],
  },
  {
    name: "Nội khoa",
    icon: Stethoscope,
    description:
      "Bác sĩ nội khoa là những chuyên gia sử dụng kiến thức khoa học và kỹ năng lâm sàng để chẩn đoán, điều trị và chăm sóc bệnh nhân trưởng thành.",
    commonConditions: ["Tiểu đường", "Tăng huyết áp", "Hen suyễn"],
    procedures: ["Khám sức khỏe tổng quát", "Sinh thiết", "Nội soi"],
    specialists: ["Bác sĩ John Smith", "Bác sĩ Emma Brown"],
  },
  {
    name: "Nhi khoa",
    icon: Baby,
    description:
      "Nhi khoa là nhánh của y học liên quan đến sức khỏe và chăm sóc y tế cho trẻ sơ sinh, trẻ em và thanh thiếu niên.",
    commonConditions: ["Hen suyễn", "Nhiễm trùng tai", "Rối loạn phát triển"],
    procedures: ["Tiêm chủng", "Đánh giá tăng trưởng", "Đánh giá hành vi"],
    specialists: ["Bác sĩ Anna Lee", "Bác sĩ Thomas Wilson"],
  },
  {
    name: "Ngoại khoa",
    icon: Scissors,
    description:
      "Ngoại khoa là chuyên ngành y học sử dụng các kỹ thuật phẫu thuật thủ công và dụng cụ để điều trị các tình trạng bệnh lý.",
    commonConditions: ["Viêm ruột thừa", "Thoát vị", "Sỏi mật"],
    procedures: ["Cắt ruột thừa", "Nội soi ổ bụng", "Ghép tạng"],
    specialists: ["Bác sĩ Richard Davis", "Bác sĩ Sophia Martinez"],
  },
  {
    name: "Dược lý học",
    icon: Pill,
    description:
      "Dược lý học là nhánh của y học liên quan đến việc nghiên cứu, tác động và cơ chế hoạt động của thuốc.",
    commonConditions: [
      "Tương tác thuốc",
      "Tác dụng phụ của thuốc",
      "Điều chỉnh liều lượng",
    ],
    procedures: [
      "Đánh giá thuốc",
      "Thử nghiệm thuốc",
      "Theo dõi thuốc điều trị",
    ],
    specialists: ["Bác sĩ Elizabeth Clark", "Bác sĩ William Nguyen"],
  },
];

export default function Specialties() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);

  const filteredSpecialties = specialties.filter(
    (specialty) =>
      specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialty.commonConditions.some((condition) =>
        condition.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      specialty.procedures.some((procedure) =>
        procedure.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div>
      <div className="mb-6">
        <Label htmlFor="search" className="sr-only">
          Search Specialties
        </Label>
        <div className="relative">
          <Search className="h-4 w-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            id="search"
            type="search"
            placeholder="Tìm kiếm chuyên khoa, tình trạng hoặc quy trình..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredSpecialties.map((specialty, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <specialty.icon className="w-6 h-6 text-blue-500 mr-2" />
                    <p className="text-blue-500 text-md">{specialty.name}</p>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Xem chi tiết về {specialty.name.toLowerCase()}
                  </CardDescription>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center text-2xl">
                  <specialty.icon className="w-8 h-8 text-blue-500 mr-2" />
                  {specialty.name}
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="mt-4 max-h-[60vh] overflow-auto pr-4">
                <DialogDescription>
                  <p className="mb-4">{specialty.description}</p>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="conditions">
                      <AccordionTrigger>Các bệnh thường gặp</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5">
                          {specialty.commonConditions.map((condition, idx) => (
                            <li key={idx}>{condition}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="procedures">
                      <AccordionTrigger>
                        Phương pháp xử lý phổ biến
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5">
                          {specialty.procedures.map((procedure, idx) => (
                            <li key={idx}>{procedure}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="specialists">
                      <AccordionTrigger>
                        Bác sĩ thuộc chuyên ngành
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5">
                          {specialty.specialists.map((specialist, idx) => (
                            <li key={idx}>{specialist}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </DialogDescription>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        ))}
      </div>
      {filteredSpecialties.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No specialties found matching your search.
        </p>
      )}
    </div>
  );
}

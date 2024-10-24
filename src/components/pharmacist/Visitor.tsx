"use client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { medicationData } from "../doctor/medicationData";
import { MedicationRow } from "../../../lib/entity-types";

const medicationSchema = z.object({
  medicationName: z.string().min(1, "Vui lòng chọn thuốc"),
  dose: z.string().min(1, "Liều lượng không được để trống"),
  quantity: z.coerce.number().min(1, "Số lượng phải lớn hơn 0"),
  instructions: z.string().optional(),
});
const formSchema = z.object({
  medications: z.array(medicationSchema),
});
export default function Visitor() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState<MedicationRow[]>([
    {
      id: 1,
      medicationName: "",
      dose: "",
      quantity: 0,
      instructions: "",
      price: 0,
    },
  ]);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medications: [
        {
          medicationName: "",
          dose: "",
          quantity: 0,
          instructions: "",
        },
      ],
    },
  });

  // Fill value trên các row
  const handleSelectMedicationName = (value: string, rowId: number) => {
    const findMedication = medicationData.find(
      (item) => item.medicationName === value
    );
    setRows(
      rows.map((row) =>
        row.id === rowId ? { ...row, ...findMedication } : row
      )
    );
  };

  // Cập nhật row
  const updateRow = (
    id: number,
    field: keyof MedicationRow,
    value: string | number
  ) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%]">
      <p className="text-base font-semibold text-blue-500">
        BÁN THUỐC CHO KHÁCH VÃNG LAI
      </p>

      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="search"
          placeholder="Nhập mã bệnh nhân (BN-XXXXXX). Ví dụ: BN-JCXX2B"
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <div className="">
          <h3 className="text-md font-semibold mb-4">Tạo đơn thuốc</h3>
          <Form {...form}>
            <form className="space-y-4">
              <div className="grid grid-cols-5 gap-4 font-medium border p-3 rounded-md">
                <Label className="align-middle text-center">Tên thuốc</Label>
                <Label className="align-middle text-center">Liều lượng</Label>
                <Label className="align-middle text-center">Số lượng</Label>
                <Label className="align-middle text-center">
                  Đơn giá (VNĐ)
                </Label>
                <Label className="align-middle text-center">Hướng dẫn</Label>
              </div>
              {rows.map((row) => (
                <div key={row.id} className="grid grid-cols-5 gap-4">
                  <Select
                    onValueChange={(value) => {
                      handleSelectMedicationName(value, row.id);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn tên thuốc" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {medicationData.map((medication, index) => (
                        <SelectItem
                          key={medication.medicationName}
                          value={medication.medicationName}
                        >
                          {medication.medicationName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={row.dose}
                    onChange={(e) => updateRow(row.id, "dose", e.target.value)}
                    placeholder="Liều lượng"
                  />
                  <Input
                    type="number"
                    value={row.quantity}
                    onChange={(e) =>
                      updateRow(row.id, "quantity", parseInt(e.target.value))
                    }
                    placeholder="Số lượng"
                  />
                  <Input
                    value={row.price}
                    onChange={(e) => updateRow(row.id, "price", e.target.value)}
                    placeholder="Đơn giá"
                  />
                  <Textarea
                    value={row.instructions}
                    onChange={(e) =>
                      updateRow(row.id, "instructions", e.target.value)
                    }
                    placeholder="Hướng dẫn (có thể bỏ trống)"
                  />
                </div>
              ))}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

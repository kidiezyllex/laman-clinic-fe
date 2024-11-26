import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Pill, Plus, X } from "lucide-react";
import { Medication, MedicationRow } from "../../../../lib/entity-types";

const medicationSchema = z.object({
  medicationName: z.string().min(1, "Vui lòng chọn thuốc"),
  dosage: z.string().min(1, "Liều lượng không được để trống"),
  quantity: z.coerce.number().min(1, "Số lượng phải lớn hơn 0"),
  instructions: z.string().optional(),
});

const formSchema = z.object({
  medications: z.array(medicationSchema),
});

interface PrescriptionFormProps {
  medications: Medication[];
  handleCreatePrescription: () => Promise<void>;
  handleCancel: () => void;
  isLoading: boolean;
}

export default function PrescriptionForm({
  medications,
  handleCreatePrescription,
  handleCancel,
  isLoading,
}: PrescriptionFormProps) {
  const [rows, setRows] = useState<MedicationRow[]>([
    {
      id: 1,
      medicationName: "",
      dosage: "",
      quantity: 0,
      quantityRemaining: 0,
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
          dosage: "",
          quantity: 0,
          instructions: "",
          quantityRemaining: 0,
        },
      ],
    },
  });

  const addRow = () => {
    const newRow: MedicationRow = {
      id: rows.length + 1,
      medicationName: "",
      dosage: "",
      quantity: 0,
      price: 0,
      instructions: "",
      quantityRemaining: 0,
    };
    setRows([...rows, newRow]);
  };

  const updateRow = (
    id: number,
    field: keyof MedicationRow,
    value: string | number
  ) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleSelectMedicationName = (value: string, rowId: number) => {
    const findMedication = medications.find(
      (item) => item.medicationName === value
    );
    setRows(
      rows.map((row) =>
        row.id === rowId ? { ...row, ...findMedication } : row
      )
    );
  };

  return (
    <div className="flex flex-col gap-4 h-full mr-4 border rounded-md p-4 bg-primary-foreground text-slate-600 dark:text-slate-300">
      <h3 className="text-md font-semibold self-center">Tạo đơn thuốc</h3>
      <Form {...form}>
        <form className="space-y-2">
          <div className="grid grid-cols-5 gap-4 font-medium border p-3 rounded-md bg-secondary">
            <Label className="align-middle text-center">Tên thuốc</Label>
            <Label className="align-middle text-center">Liều lượng</Label>
            <Label className="align-middle text-center">Số lượng</Label>
            <Label className="align-middle text-center">Đơn giá (VNĐ)</Label>
            <Label className="align-middle text-center">Hướng dẫn</Label>
          </div>
          {rows.map((row) => (
            <div key={row.id} className="grid grid-cols-5 gap-2">
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
                  {medications.map((medication: any, index: any) => (
                    <SelectItem
                      key={medication.medicationName + index}
                      value={medication.medicationName}
                    >
                      {medication.medicationName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={row.dosage + ""}
                onChange={(e) => updateRow(row.id, "dosage", e.target.value)}
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
              <Input
                value={row.instructions + ""}
                onChange={(e) =>
                  updateRow(row.id, "instructions", e.target.value)
                }
                placeholder="Có thể bỏ trống..."
              />
            </div>
          ))}
        </form>
      </Form>
      <div className="flex flex-row gap-4 w-full justify-end items-end flex-grow">
        <Button type="button" onClick={addRow} variant="outline">
          Thêm dòng
          <Plus className="w-4 h-4" />
        </Button>
        <Button variant="destructive" onClick={handleCancel}>
          Huỷ đơn
          <X className="w-4 h-4" />
        </Button>
        <Button
          onClick={handleCreatePrescription}
          disabled={isLoading}
          className="w-fit flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {isLoading ? (
            <>
              Đang xử lý
              <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              Tạo đơn thuốc
              <Pill className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

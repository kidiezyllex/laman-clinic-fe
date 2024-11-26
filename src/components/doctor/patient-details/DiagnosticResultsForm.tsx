import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CircleCheckBig, X } from "lucide-react";

interface DiagnosticResultsFormProps {
  handleCreateDiagnosticResults: (e: React.FormEvent) => Promise<void>;
  handleCancel: () => void;
  isLoading: boolean;
}

const medicationSchema = z.object({
  medicationName: z.string().min(1, "Vui lòng chọn thuốc"),
  dosage: z.string().min(1, "Liều lượng không được để trống"),
  quantity: z.coerce.number().min(1, "Số lượng phải lớn hơn 0"),
  instructions: z.string().optional(),
});

const formSchema = z.object({
  medications: z.array(medicationSchema),
});
export default function DiagnosticResultsForm({
  handleCreateDiagnosticResults,
  handleCancel,
  isLoading,
}: DiagnosticResultsFormProps) {
  const [formData, setFormData] = useState({
    medicalHistory: "",
    diagnosis: "",
    treatment: "",
    otherTreatment: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      treatment: value,
    }));
  };
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
  return (
    <div className="flex flex-col gap-4 h-full mr-4 border rounded-md p-4 bg-primary-foreground text-slate-600 dark:text-slate-300">
      <h3 className="text-md font-semibold mr-4 self-center">
        Nhập kết quả khám bệnh/chẩn đoán bệnh
      </h3>
      <Form {...form}>
        <form onSubmit={handleCreateDiagnosticResults} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="medicalHistory">Tiền sử bệnh</Label>
            <Textarea
              id="medicalHistory"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              placeholder="Nhập tiền sử bệnh của bạn"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diagnosis">Chẩn đoán bệnh</Label>
            <Textarea
              id="diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              placeholder="Nhập chẩn đoán bệnh"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="treatment">Điều trị</Label>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn phương pháp điều trị" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sử dụng thuốc">Sử dụng thuốc</SelectItem>
                <SelectItem value="Phẫu thuật">Phẫu thuật</SelectItem>
                <SelectItem value="Trị liệu">Trị liệu</SelectItem>
                <SelectItem value="Khác">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.treatment === "Khác" && (
            <div className="space-y-2">
              <Label htmlFor="otherTreatment">Phương pháp điều trị khác</Label>
              <Input
                id="otherTreatment"
                name="otherTreatment"
                value={formData.otherTreatment}
                onChange={handleChange}
                placeholder="Nhập phương pháp điều trị khác"
              />
            </div>
          )}
          <div className="flex flex-row gap-4 w-full justify-end">
            <Button variant="destructive" onClick={handleCancel}>
              Huỷ
              <X className="w-4 h-4" />
            </Button>
            <Button
              type="submit"
              className="w-fit flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
              variant={"secondary"}
            >
              {isLoading ? (
                <>
                  Đang xử lý
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  Hoàn thành
                  <CircleCheckBig className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

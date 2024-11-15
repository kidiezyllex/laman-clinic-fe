"use client";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Cat,
  Dog,
  Pill,
  Plus,
  Receipt,
  RotateCcw,
  SearchIcon,
} from "lucide-react";
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
import { medicationData } from "../../../lib/hardcoded-data";
import { MedicationRow, Patient } from "../../../lib/entity-types";
import { Card } from "../ui/card";
import PatientPrescriptionInvoice from "./prescription/PatientPrescriptionInvoice";

const medicationSchema = z.object({
  medicationName: z.string().min(1, "Vui lòng chọn thuốc"),
  dosage: z.string().min(1, "Liều lượng không được để trống"),
  quantity: z.coerce.number().min(1, "Số lượng phải lớn hơn 0"),
  instructions: z.string().optional(),
});
const formSchema = z.object({
  medications: z.array(medicationSchema),
});

const customerInfoSchema = z.object({
  fullName: z.string().min(1, "Họ tên không được để trống"),
  phone: z.string().min(1, "Số điện thoại không được để trống"),
});

export default function Visitor() {
  const { toast } = useToast();
  const [showInvoice, setShowInvoice] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

  const [rows, setRows] = useState<MedicationRow[]>([
    {
      id: 1,
      medicationName: "",
      dosage: "",
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
          dosage: "",
          quantity: 0,
          instructions: "",
        },
      ],
    },
  });

  const customerInfoForm = useForm({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      fullName: "",
      phone: "",
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

  // Thêm 1 row
  const addRow = () => {
    const newRow: MedicationRow = {
      id: rows.length + 1,
      medicationName: "",
      dosage: "",
      quantity: 0,
      price: 0,
      instructions: "",
    };
    setIsShow(true);
    setRows([...rows, newRow]);
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

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients`
      );
      setPatients(response.data);
    };
    fetchData();
  }, [searchTerm]);

  const handleSearchPatientProfile = () => {
    const searchTermLower = searchTerm.toLowerCase();
    if (searchTermLower.toString().trim() === "") {
      toast({
        variant: "destructive",
        title: "Lỗi!",
        description: "Vui lòng nhập thông tin tìm kiếm!",
      });
      return;
    }
    const filteredP = patients.filter((patient) => {
      return (
        patient.fullName?.toLowerCase().includes(searchTermLower) ||
        (patient.phone && patient.phone.includes(searchTerm)) ||
        (patient.email &&
          patient.email.toLowerCase().includes(searchTermLower)) ||
        (patient._id && patient._id.toLowerCase().includes(searchTermLower))
      );
    });
    if (filteredP.length === 0) {
      toast({
        variant: "destructive",
        title: "Không tìm thấy!",
        description: "Vui lòng Tạo hồ sơ bệnh nhân mới!",
      });
    }
    setFilteredPatients(filteredP);
  };

  const handlePatientCardClick = (patient: Patient) => {
    setSelectedPatientId(patient?._id + "");
    customerInfoForm.setValue("fullName", patient.fullName || "");
    customerInfoForm.setValue("phone", patient.phone || "");
  };

  // Tạo đơn thuốc
  const handleCreatePrescription = async () => {
    try {
      if (customerInfoForm.getValues().fullName.trim() !== "") {
        const payload = {
          patientId: selectedPatientId || `BN-VL0000`,
          doctorId: "BS-VL0000",
          medications: rows,
          status: "Completed",
          dateIssued: new Date(),
        };
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/prescriptions`,
          payload
        );
        toast({
          variant: "default",
          title: "Thành công!",
          description: "Đã tạo 1 đơn thuốc cho khách vãng lai!",
        });
      } else
        toast({
          variant: "destructive",
          title: "Thất bại!",
          description: "Vui lòng nhập thông tin khách hàng!",
        });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Thất bại!",
        description: err + "",
      });
    } finally {
      setFilteredPatients([]);
      setRows([
        {
          id: 0,
          medicationName: "",
          dosage: "",
          quantity: 0,
          instructions: "",
          price: 0,
        },
      ]);
      customerInfoForm.reset();
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%]">
      <p className="text-base font-semibold text-blue-500">
        DÀNH CHO KHÁCH VÃNG LAI
      </p>
      <div className="flex flex-col gap-4 border rounded-md p-4 bg-primary-foreground">
        <h3 className="text-md font-semibold text-blue-500">
          Thông tin khách hàng
        </h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row w-full gap-3">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Nhập mã bệnh nhân, tên, hoặc email"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant={"secondary"}
              onClick={() => handleSearchPatientProfile()}
            >
              Tìm hồ sơ bệnh nhân
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-1 lg:grid-cols-2 mb-4">
            {filteredPatients.map((patient) => (
              <Card
                key={patient?._id + ""}
                className="flex flex-col gap-6 justify-center items-center p-4 hover:border-blue-500"
                onClick={() => handlePatientCardClick(patient)}
              >
                <div className="flex flex-row gap-2 items-center w-full">
                  {patient?.gender?.toLowerCase() === "male" ||
                  patient?.gender?.toLowerCase() === "nam" ? (
                    <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-blue-200">
                      <Dog className="text-blue-500" />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-pink-200">
                      <Cat className="text-pink-500" />
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-slate-500">
                      <span className="font-semibold text-sm">
                        Mã bệnh nhân:{" "}
                      </span>{" "}
                      {patient._id}
                    </p>
                    <p className="text-base">
                      <span className="font-semibold text-base">Tên: </span>{" "}
                      {patient.fullName}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Form {...customerInfoForm}>
            <form className="grid grid-cols-2 gap-4">
              <FormField
                control={customerInfoForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ tên</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={customerInfoForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-1 bg-primary-foreground rounded-md">
        <div className="flex flex-col gap-4 border rounded-md p-4">
          <h3 className="text-md font-semibold text-blue-500">Tạo đơn thuốc</h3>
          <Form {...form}>
            <form className="space-y-4">
              <div className="grid grid-cols-5 gap-4 font-medium border p-3 rounded-md bg-background">
                <Label className="align-middle text-center">Tên thuốc</Label>
                <Label className="align-middle text-center">Liều lượng</Label>
                <Label className="align-middle text-center">Số lượng</Label>
                <Label className="align-middle text-center">
                  Đơn giá (VNĐ)
                </Label>
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
                    value={row.dosage + ""}
                    onChange={(e) =>
                      updateRow(row.id, "dosage", e.target.value)
                    }
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
        </div>
      </div>
      <div className="flex flex-row gap-3 w-full justify-end mt-4">
        <Button
          type="button"
          onClick={() => {
            setRows([
              {
                id: 0,
                medicationName: "",
                dosage: "",
                quantity: 0,
                instructions: "",
                price: 0,
              },
            ]);
            setIsShow(false);
            setShowInvoice(false);
          }}
          variant="destructive"
          className={isShow ? "" : "hidden"}
        >
          Đặt lại
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          onClick={addRow}
          variant="outline"
          className="self-start"
        >
          Thêm dòng
          <Plus className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          onClick={() => {
            if (rows[0].quantity !== 0) {
              setShowInvoice(true);
            } else
              toast({
                variant: "destructive",
                title: "Thất bại!",
                description: "Hoá đơn rỗng. Vui lòng Tạo đơn thuốc!",
              });
          }}
          variant="default"
          className="self-start flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Xem hoá đơn
          <Receipt className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={handleCreatePrescription}
          variant="default"
          className="self-start flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Tạo đơn thuốc
          <Pill className="h-4 w-4" />
        </Button>
      </div>
      {showInvoice && (
        <div className="border rounded-md">
          <PatientPrescriptionInvoice
            prescription={{
              _id: "",
              patientId: "",
              doctorId: "",
              medications: [],
              dateIssued: new Date(),
            }}
            newMedication={[...rows] as any}
          />
        </div>
      )}
    </div>
  );
}

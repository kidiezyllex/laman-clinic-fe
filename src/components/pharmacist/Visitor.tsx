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
import { Cat, Dog, SearchIcon } from "lucide-react";
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
  dose: z.string().min(1, "Liều lượng không được để trống"),
  quantity: z.coerce.number().min(1, "Số lượng phải lớn hơn 0"),
  instructions: z.string().optional(),
});
const formSchema = z.object({
  medications: z.array(medicationSchema),
});

const customerInfoSchema = z.object({
  fullName: z.string().min(1, "Họ tên không được để trống"),
  gender: z.enum(["Male", "Female"]),
  phone: z.string().min(1, "Số điện thoại không được để trống"),
  email: z.string().email("Email không hợp lệ"),
});

export default function Visitor() {
  const { toast } = useToast();
  const [showInvoice, setShowInvoice] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showCreatePatientProfile, setShowCreatePatientProfile] =
    useState(false);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

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

  const customerInfoForm = useForm({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      fullName: "",
      gender: "",
      phone: "",
      email: "",
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
      dose: "",
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
    const filteredP = patients.filter((patient) => {
      const searchTermLower = searchTerm.toLowerCase();
      if (searchTermLower === "") {
        return;
      }
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
        variant: "default",
        title: "Không tìm thấy!",
        description: "Vui lòng Tạo hồ sơ bệnh nhân mới!",
      });
      setShowCreatePatientProfile(true);
    }
    setFilteredPatients(filteredP);
  };

  const handlePatientCardClick = (patient: Patient) => {
    customerInfoForm.setValue("fullName", patient.fullName || "");
    customerInfoForm.setValue("gender", patient.gender || "Male");
    customerInfoForm.setValue("phone", patient.phone || "");
    customerInfoForm.setValue("email", patient.email || "");
  };

  const handleCreatePrescription = () => {
    if (customerInfoForm.getValues().fullName.trim() !== "") {
      console.log("Customer Information:", customerInfoForm.getValues());
      console.log("Prescription Information:", form.getValues());
    } else
      toast({
        variant: "destructive",
        title: "Thất bại!",
        description: "Vui lòng nhập thông tin khách hàng!",
      });
  };

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%]">
      <p className="text-base font-semibold text-blue-500">
        DÀNH CHO KHÁCH VÃNG LAI
      </p>
      <div className="flex flex-col gap-4 border rounded-md p-4">
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
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {filteredPatients.map((patient) => (
              <Card
                key={patient?._id + ""}
                className="flex flex-col gap-6 justify-center items-center p-4"
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
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính (Nam: "Male", Nữ: "Female")</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* <FormField
                control={customerInfoForm.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Nam</SelectItem>
                        <SelectItem value="Female">Nữ</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              /> */}
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
              <FormField
                control={customerInfoForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
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
      <div className="grid gap-6 md:grid-cols-1">
        <div className="flex flex-col gap-4 border rounded-md p-4">
          <h3 className="text-md font-semibold text-blue-500">Tạo đơn thuốc</h3>
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
          <div className="flex flex-row gap-3 w-full justify-end mt-6">
            <Button
              type="button"
              onClick={() => {
                setRows([
                  {
                    id: 0,
                    medicationName: "",
                    dose: "",
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
              // className="self-start "
            >
              Đặt lại
            </Button>
            <Button
              type="button"
              onClick={addRow}
              variant="outline"
              className="self-start"
            >
              Thêm dòng
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
              className="self-start"
            >
              Xem hoá đơn
            </Button>
            <Button
              type="button"
              onClick={handleCreatePrescription}
              variant="default"
              className="self-start"
            >
              Tạo đơn thuốc
            </Button>
          </div>
        </div>
      </div>
      {showInvoice && (
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
      )}
    </div>
  );
}

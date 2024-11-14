"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { CircleArrowUp, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { usePathname, useRouter } from "next/navigation";
import { Doctor, Patient } from "../../../../lib/entity-types";

const PaymentForm = ({
  setActiveSection,
  selectedDate,
  selectedSpe,
  patient,
  selectedDoctor,
}: {
  setActiveSection: (section: string) => void;
  selectedDate: Date | undefined;
  selectedSpe: number | null;
  patient: Patient;
  selectedDoctor: Doctor | null;
}) => {
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();
  const patientId = usePathname().split("/")[1];
  const [isLoading, setIsLoading] = useState(false);
  const paymentMethods = [
    {
      id: "card",
      label: "Thanh toán bằng thẻ khám bệnh",
    },
    { id: "momo", label: "Thanh toán bằng ví Momo" },
    { id: "cash", label: "Thanh toán bằng tiền mặt" },
  ];

  const handleBooking = async () => {
    setIsLoading(true);
    const payload = {
      patientId: patient._id + "",
      appointmentDateByPatient: selectedDate,
      specialization: selectedDoctor?.specialization || selectedSpe,
      fullName: patient.fullName,
      dateOfBirth: patient.dateOfBirth || new Date(),
      gender: patient.gender || "",
      address: patient.address,
      phone: patient.phone || "",
      email: patient.email,
      doctorId: selectedDoctor?._id || "",
      doctorName: selectedDoctor?.fullName || "",
    };
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/appointmentsByPatient`,
        payload
      );
      toast({
        variant: "default",
        title: "Thành công!",
        description: "Lịch khám đang chờ xác nhận!",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: "Thất bại!",
          description: "Trùng hồ sơ. Vui lòng dùng hồ sơ khác!",
        });
        console.error(error.response?.data || error.message);
      }
    } finally {
      setIsLoading(false);
      router.push(`/${patientId}/patient/dashboard`);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 bg-background rounded-md p-4 border h-full">
      <p className="text-base font-semibold text-blue-500">
        VUI LÒNG CHỌN HÌNH THỨC BHYT
      </p>
      <Select>
        <SelectTrigger className="w-[50%]">
          <SelectValue placeholder="Chọn hình thức BHYT" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Chọn hình thức BHYT</SelectLabel>
            <SelectItem value="ht1">
              Có giấy chuyển BHYT của Đa khoa Laman
            </SelectItem>
            <SelectItem value="ht2">
              Tái khám theo hẹn của Đa khoa Laman
            </SelectItem>
            <SelectItem value="ht3">
              Không phải các trường hợp trên / Không có BHYT
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <p className="text-base font-semibold text-blue-500 mb-4">
        VUI LÒNG CHỌN HÌNH THỨC THANH TOÁN
      </p>
      <div className="grid grid-cols-2 gap-4 h-[50%]">
        <RadioGroup
          value={selectedPayment}
          onValueChange={setSelectedPayment}
          className="flex flex-col gap-4 items-start"
        >
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center">
              <RadioGroupItem
                value={method.id}
                id={method.id}
                className="mr-2 border-blue-500 focus:ring-blue-500"
              />
              <label htmlFor={method.id} className="flex items-center ">
                <span className="ml-2 text-slate-700 dark:text-slate-300">
                  {method.label}
                </span>
              </label>
            </div>
          ))}
        </RadioGroup>
        <div>
          {selectedPayment === "card" && (
            <div className="relative h-full z-0 border border-dashed rounded-md border-blue-500">
              <Image
                src="https://res.cloudinary.com/drqbhj6ft/image/upload/v1727562773/learning-webdev-blog/clinic/tkb_keepdk.png"
                alt={"image"}
                className="object-contain rounded"
                layout="fill" // Use fill for container sizing
              />
            </div>
          )}
          {selectedPayment === "momo" && (
            <div className="relative h-full z-0 border border-dashed rounded-md border-blue-500">
              <Image
                src="https://res.cloudinary.com/drqbhj6ft/image/upload/v1727562772/learning-webdev-blog/clinic/MoMo_Logo_b17qgk.png"
                alt={"image"}
                className="object-contain rounded"
                layout="fill"
              />
            </div>
          )}
          {selectedPayment === "cash" && ""}
        </div>
      </div>
      <div className="flex flex-row justify-between mt-4 flex-grow">
        <Button
          className="w-fit dark:hover:bg-slate-900 self-end"
          onClick={() => {
            selectedDoctor
              ? setActiveSection("calendarSelector")
              : setActiveSection("roomSelector");
          }}
          variant={"outline"}
        >
          Quay lại
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-fit self-end flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
          onClick={() => handleBooking()}
        >
          {isLoading ? (
            <>
              Đang xử lý
              <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              Đăng ký khám
              <CircleArrowUp className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PaymentForm;

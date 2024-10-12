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
import { CreditCard, Banknote, CircleSlashIcon, Wallet } from "lucide-react"; // react-icons for icons
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ArrowButton from "@/components/animata/button/arrow-button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { usePathname } from "next/navigation";

interface Patient {
  numberId?: string;
  fullName?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
}
const PaymentForm = ({
  setActiveSection,
  selectedDate,
  selectedSpe,
  patient,
}: {
  setActiveSection: (section: string) => void;
  selectedDate: Date | undefined;
  selectedSpe: number | null;
  patient: Patient;
}) => {
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const { toast } = useToast();
  const pathname = usePathname();

  // Các phương thức thanh toán
  const paymentMethods = [
    {
      id: "card",
      label: "Thanh toán bằng thẻ khám bệnh",
    },
    {
      id: "visa",
      label: "Thanh toán bằng Thẻ Visa, Master, JCB",
    },
    {
      id: "atm",
      label: "Thanh toán bằng Thẻ ATM nội địa/Internet Banking",
    },
    { id: "momo", label: "Thanh toán bằng ví Momo" },
    { id: "cash", label: "Thanh toán bằng tiền mặt" },
  ];

  const handleBooking = async () => {
    const payload = {
      id: patient.numberId,
      appointmentDateByPatient: selectedDate,
      specialization: selectedSpe,
      fullName: patient.fullName,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      address: patient.address,
      phone: patient.phone,
      email: patient.email,
      medicalHistory: [],
    };
    console.log(pathname);
    try {
      const response = await axios.post(
        `/api/appointment/appointment-by-patient`,
        payload
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 bg-background rounded-md p-4 border">
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

      <p className="text-base font-semibold text-blue-500">
        VUI LÒNG CHỌN HÌNH THỨC THANH TOÁN
      </p>
      <div className="grid grid-cols-2 gap-4">
        <RadioGroup
          value={selectedPayment}
          onValueChange={setSelectedPayment}
          className="space-y-4"
        >
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center">
              <RadioGroupItem
                value={method.id}
                id={method.id}
                className="mr-2 border-blue-500 focus:ring-blue-500"
              />
              <label htmlFor={method.id} className="flex items-center ">
                <span className="ml-2 text-slate-700">{method.label}</span>
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
          {selectedPayment === "visa" && (
            <Card>
              <CardContent>
                Bạn đã chọn thanh toán bằng Thẻ Visa, Master, JCB.
              </CardContent>
            </Card>
          )}
          {selectedPayment === "atm" && (
            <Card>
              <CardContent>
                Bạn đã chọn thanh toán bằng Thẻ ATM nội địa/Internet Banking.
              </CardContent>
            </Card>
          )}
          {selectedPayment === "momo" && (
            <div className="relative h-full z-0 border border-dashed rounded-md border-blue-500">
              <Image
                src="https://res.cloudinary.com/drqbhj6ft/image/upload/v1727562772/learning-webdev-blog/clinic/MoMo_Logo_b17qgk.png"
                alt={"image"}
                className="object-contain rounded"
                layout="fill" // Use fill for container sizing
              />
            </div>
          )}
          {selectedPayment === "cash" && ""}
        </div>
      </div>
      <div className="flex flex-row justify-between mt-4">
        <Button
          className="w-fit"
          onClick={() => {
            setActiveSection("roomSelector");
          }}
          variant={"outline"}
        >
          Quay lại
        </Button>
        <ArrowButton
          className="w-fit"
          text={"Hoàn tất"}
          onClick={() => {
            handleBooking();
          }}
        ></ArrowButton>
      </div>
    </div>
  );
};

export default PaymentForm;

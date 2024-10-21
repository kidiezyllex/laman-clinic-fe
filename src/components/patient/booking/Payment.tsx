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
import { Loader2 } from "lucide-react"; // react-icons for icons
import Image from "next/image";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { usePathname } from "next/navigation";

interface Patient {
  _id?: string;
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
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    const payload = {
      id: patient._id + "",
      appointmentDateByPatient: selectedDate,
      specialization: selectedSpe,
      fullName: patient.fullName,
      dateOfBirth: patient.dateOfBirth || new Date(),
      gender: patient.gender || "",
      address: patient.address || "",
      phone: patient.phone || "",
      email: patient.email,
      medicalHistory: [],
    };
    console.log(patient._id + "");

    try {
      const response = await axios.post(
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
        console.error("Axios error:", error.response?.data || error.message);
      }
    } finally {
      setIsLoading(false);
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
        <Button
          type="submit"
          disabled={isLoading}
          className="w-fit"
          onClick={() => handleBooking()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            "Tạo hồ sơ"
          )}
        </Button>
      </div>
    </div>
  );
};

export default PaymentForm;

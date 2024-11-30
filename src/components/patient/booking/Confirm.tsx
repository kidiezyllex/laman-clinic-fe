"use client";
import React, { useState } from "react";
import {
  Calendar,
  Code,
  Loader2,
  Mail,
  MapPin,
  Phone,
  SquareActivity,
  Timer,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { usePathname, useRouter } from "next/navigation";
import { Doctor, Patient } from "../../../../lib/entity-types";
import {
  formatDate,
  formatDate3,
  generateExamination,
  renderSpecialty,
} from "../../../../lib/utils";
const Confirm = ({
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
  const { toast } = useToast();
  const router = useRouter();
  const patientId = usePathname().split("/")[1];
  const [isLoading, setIsLoading] = useState(false);

  const handleBooking = async () => {
    setIsLoading(true);
    const payload = {
      patientId: patient._id + "",
      appointmentDateByPatient: selectedDate,
      specialization: selectedDoctor?.specialization || selectedSpe,
      fullName: patient.fullName,
      dateOfBirth: patient?.dateOfBirth,
      gender: patient?.gender,
      address: patient.address,
      phone: patient?.phone,
      email: patient.email,
      doctorId: selectedDoctor?._id,
      doctorName: selectedDoctor?.fullName,
    };
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/appointmentsByPatient`,
        payload
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Thất bại!",
        description: "Trùng hồ sơ. Vui lòng dùng hồ sơ khác!",
      });
    } finally {
      toast({
        variant: "default",
        title: "Thành công!",
        description: "Lịch khám đang chờ xác nhận!",
      });
      setIsLoading(false);
      router.push(`/${patientId}/patient/dashboard`);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 bg-background rounded-md p-4 border h-full">
      <p className="text-base font-semibold text-blue-500">
        VUI LÒNG XÁC NHẬN THÔNG TIN HẸN KHÁM
      </p>
      <div className="grid grid-cols-2 space-x-4 border rounded-md p-4 text-slate-600 dark:text-slate-300 bg-primary-foreground">
        <div className="flex flex-col gap-3">
          <h3 className="text-md font-semibold">Thông tin bệnh nhân</h3>
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-blue-500" />
            <span className="text-sm">Mã bệnh nhân: {patient?._id}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            <span className="text-sm">Họ và tên: {patient?.fullName}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            <span className="text-sm">
              Giới tính:{" "}
              {patient?.gender?.toLowerCase() === "female" ? "Nữ" : "Nam"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-sm">
              Ngày sinh: {formatDate(patient?.dateOfBirth)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="text-sm">Địa chỉ: {patient?.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-500" />
            <span className="text-sm">Số ĐT: {patient?.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-500" />
            <span className="text-sm">Email: {patient?.email}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 ">
          <p className="text-md font-semibold">Thông tin lịch hẹn đăng ký</p>
          {selectedDoctor?._id ? (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              <span className="text-sm">
                Bác sĩ: {selectedDoctor?.fullName}
              </span>
            </div>
          ) : (
            ""
          )}

          <div className="flex items-center gap-2">
            <SquareActivity className="w-4 h-4 text-blue-500" />
            <span className="text-sm">
              Chuyên khoa:{" "}
              {renderSpecialty(
                selectedDoctor?.specialization + "" || selectedSpe + ""
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-sm">
              Ngày khám: {formatDate(selectedDate)}
            </span>
          </div>
          {!selectedDoctor?._id ? null : (
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-blue-500" />
              <span className="text-sm">
                Ca khám: {generateExamination(formatDate3(selectedDate))}
              </span>
            </div>
          )}
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
              Đặt khám
              <Calendar className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Confirm;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CalendarIcon, X } from "lucide-react";
import CalendarSelector from "./CalendarSelector";
import { Appointment } from "../../../../lib/entity-types";
import { useToast } from "@/hooks/use-toast";
import { usePathname } from "next/navigation";
import axios from "axios";

interface ReExaminationFormProps {
  handleCancel: () => void;
  isLoading: boolean;
  selectedAppointment: Appointment;
  setIsLoading: (isLoading: boolean) => void;
}

export default function ReExaminationForm({
  handleCancel,
  isLoading,
  selectedAppointment,
  setIsLoading,
}: ReExaminationFormProps) {
  const [reason, setReason] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { toast } = useToast();
  const doctorId = usePathname().split("/")[1];
  // Tạo tái khám
  const handleCreateReExamination = async (
    selectedAppointment: Appointment
  ) => {
    try {
      setIsLoading(true);
      const payload = {
        patientId: selectedAppointment?.patientId + "",
        appointmentDateByPatient: new Date(),
        specialization: selectedAppointment?.specialization,
        fullName: selectedAppointment.fullName,
        dateOfBirth: selectedAppointment.dateOfBirth || new Date(),
        gender: selectedAppointment.gender || "",
        address: selectedAppointment.address,
        phone: selectedAppointment.phone || "",
        email: selectedAppointment.email,
        doctorId: doctorId,
        reason: reason,
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/reExamination`,
        payload
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Thất bại!",
        description: error + "",
      });
    } finally {
      toast({
        variant: "default",
        title: "Thành công!",
        description: "Đã tạo tái khám cho bệnh nhân!",
      });
      setIsLoading(false);
      handleCancel();
    }
  };
  return (
    <div className="flex flex-col gap-4 h-full mr-4 border rounded-md p-4 bg-primary-foreground text-slate-600 dark:text-slate-300">
      <h3 className="text-md font-semibold mr-4 self-center">
        Thông tin tái khám
      </h3>
      <h3 className="text-md font-semibold">
        Vui lòng nhập lý do hẹn tái khám
      </h3>
      <div className="mr-4">
        <Input
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Nhập lý do hẹn tái khám"
        />
      </div>
      <h3 className="text-md font-semibold">Chọn ngày tái khám</h3>
      <CalendarSelector setSelectedDate={setSelectedDate}></CalendarSelector>
      <div className="flex flex-row gap-4 w-full justify-end">
        <Button variant="destructive" onClick={handleCancel}>
          Huỷ
          <X className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => handleCreateReExamination(selectedAppointment)}
          variant={"secondary"}
          className="w-fit flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600 text-white "
        >
          {isLoading ? (
            <>
              Đang xử lý
              <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              Tạo tái khám
              <CalendarIcon className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

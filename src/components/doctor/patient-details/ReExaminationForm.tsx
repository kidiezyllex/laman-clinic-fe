import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CalendarIcon, X } from "lucide-react";
import CalendarSelector from "./CalendarSelector";
import { Appointment } from "../../../../lib/entity-types";

interface ReExaminationFormProps {
  handleCreateReExamination: (
    selectedAppointment: Appointment
  ) => Promise<void>;
  handleCancel: () => void;
  isLoading: boolean;
  selectedAppointment: Appointment;
}

export default function ReExaminationForm({
  handleCreateReExamination,
  handleCancel,
  isLoading,
  selectedAppointment,
}: ReExaminationFormProps) {
  const [reason, setReason] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();

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

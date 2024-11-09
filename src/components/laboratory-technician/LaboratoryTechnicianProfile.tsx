import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  PhoneIcon,
  MailIcon,
  Trash2Icon,
  PencilIcon,
  Dog,
  Cat,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePathname } from "next/navigation";
import { Receptionist, Schedule } from "../../../lib/entity-types";
import { formatDate } from "../../../lib/utils";

export default function LaboratoryTechnicianProfile() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const userId = usePathname().split("/")[1];
  const [receptionist, setReceptionist] = useState<Partial<Receptionist>>({});

  function generateTimeSlots(startTime: string, endTime: string) {
    const slots = [];
    let currentTime = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);

    while (currentTime < end) {
      const slotStart = currentTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      currentTime.setHours(currentTime.getHours() + 1);
      const slotEnd = currentTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      slots.push(`${slotStart} - ${slotEnd}`);
    }

    return slots;
  }

  // Fetch Data Y tá xét nghiệm
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/laboratory-technicians/${userId}`
      );
      setReceptionist(response.data);
    };
    fetchData();
  }, []);

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%]">
      <p className="text-base font-semibold text-blue-500">HỒ SƠ LỄ TÂN</p>
      {Object.keys(receptionist).length !== 0 && (
        <div className="flex flex-col border rounded-md p-4 gap-3">
          <div className="flex gap-3 items-center">
            {receptionist.gender?.toLocaleLowerCase() === "male" ? (
              <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-blue-200">
                <Dog className="text-blue-500" />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-pink-200">
                <Cat className="text-pink-500" />
              </div>
            )}
            <div>
              <p className="text-base font-semibold">
                Lễ tân: {receptionist.fullName}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 ml-3">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="text-blue-500 h-4 w-4" />
              <span className="text-slate-600 text-base">
                Ngày sinh: {formatDate(receptionist.dateOfBirth)}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <PhoneIcon className="text-blue-500 h-4 w-4" />
              <span className="text-slate-600 text-base">
                Số ĐT: {receptionist.phone}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <MailIcon className="text-blue-500 h-4 w-4" />
              <span className="text-slate-600 text-base">
                Email: {receptionist.email}
              </span>
            </div>
          </div>
        </div>
      )}
      <p className="text-base font-semibold text-blue-500">LỊCH LÀM VIỆC</p>
      <div className="flex flex-col gap-3">
        {Object.keys(receptionist).length !== 0 &&
          (receptionist as any).schedule.map((scheduleItem: Schedule) => (
            <div key={scheduleItem._id} className="p-3 border">
              <h3 className="font-medium text-slate-500 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <p className="text-sm"> {scheduleItem.dayOfWeek}</p>
              </h3>
              <div className="grid grid-cols-4 gap-2 ">
                {generateTimeSlots(
                  scheduleItem.startTime,
                  scheduleItem.endTime
                ).map((slot) => (
                  <Button key={slot} variant={"secondary"}>
                    {slot}
                  </Button>
                ))}
              </div>
            </div>
          ))}
      </div>
      {Object.keys(receptionist).length !== 0 && (
        <div className="flex justify-end space-x-4">
          <Button
            variant="destructive"
            className="flex items-center space-x-2"
            onClick={() => setIsAlertOpen(true)}
          >
            <Trash2Icon className="w-4 h-4" />
            <span>Xoá</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center space-x-2 border-blue-500 text-blue-500 hover:bg-blue-50"
          >
            <PencilIcon className="w-4 h-4" />
            <span>Chỉnh sửa</span>
          </Button>
        </div>
      )}

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xoá?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Điều này sẽ xoá vĩnh viễn dữ
              liệu của bạn khỏi máy chủ của chúng tôi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction>Xác nhận xoá</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

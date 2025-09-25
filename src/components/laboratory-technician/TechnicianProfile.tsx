import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  PhoneIcon,
  MailIcon,
  Dog,
  Cat,
  Clock,
  ArrowUpFromLine,
  MapPinIcon,
  UserIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Staff, Schedule } from "../../../lib/entity-types";
import {
  formatDate,
  generateTimeSlots,
  renderDayOfWeek,
} from "../../../lib/utils";
import { Separator } from "../ui/separator";
import { useGetLaboratoryTechnicianById } from "@/hooks/useLaboratoryTechnician";
import { ILaboratoryTechnician } from "@/interface/response/laboratory-technician";

export default function TechnicianProfile() {
  const userId = usePathname().split("/")[1];
  const { data: technicianData, isLoading, error } = useGetLaboratoryTechnicianById(userId);
  const technician: Partial<ILaboratoryTechnician> = technicianData?.data || {};

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%]">
      <p className="text-base font-semibold text-blue-500 uppercase">
        HỒ SƠ Y tá xét nghiệm
      </p>
      {technician && (
        <div className="flex flex-col border rounded-md p-4 gap-3 bg-primary-foreground">
          <div className="flex gap-3 items-center">
            {technician.gender?.toLocaleLowerCase() === "male" ? (
              <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center border border-blue-500 bg-blue-200">
                <Dog className="text-blue-500" />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center border border-pink-500 bg-pink-200">
                <Cat className="text-pink-500" />
              </div>
            )}
            <div>
              <p className="text-base font-semibold text-slate-600 dark:text-slate-300">
                Y tá xét nghiệm: {technician.fullName}
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Mã Y tá: {technician?._id}
              </p>
            </div>
          </div>
          <Separator></Separator>
          <div className="flex flex-col gap-3 ml-3 text-slate-600 dark:text-slate-300">
            <div className="flex items-center space-x-2 ">
              <CalendarIcon className="text-blue-500 h-4 w-4" />
              <p className="text-sm font-medium text-start text-slate-600 dark:text-slate-300">
                Ngày sinh:
              </p>
              <p className="text-sm text-slate-600 text-start dark:text-slate-300">
                {technician.dateOfBirth ? formatDate(new Date(technician.dateOfBirth)) : 'N/A'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <UserIcon className="text-blue-500 h-4 w-4" />
              <p className="text-sm font-medium text-start text-slate-600 dark:text-slate-300">
                Giới tính:
              </p>
              <p className="text-sm text-slate-600 text-start dark:text-slate-300">
                {technician.gender?.toLowerCase() === "female" ? "Nữ" : "Nam"}
              </p>
            </div>
            <div className="flex items-center space-x-2 ">
              <MapPinIcon className="text-blue-500 h-4 w-4 " />
              <p className="text-sm font-medium text-start text-slate-600 dark:text-slate-300">
                Địa chỉ:
              </p>
              <p className="text-sm text-slate-600 text-start dark:text-slate-300">
                {technician.address}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <PhoneIcon className="text-blue-500 h-4 w-4" />
              <p className="text-sm font-medium text-start text-slate-600 dark:text-slate-300">
                Số ĐT:
              </p>
              <p className="text-sm text-slate-600 text-start dark:text-slate-300">
                {technician.phone}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <MailIcon className="text-blue-500 h-4 w-4" />
              <p className="text-sm font-medium text-start text-slate-600 dark:text-slate-300">
                Email:
              </p>
              <p className="text-sm text-slate-600 text-start dark:text-slate-300">
                {technician.email}
              </p>
            </div>
          </div>
        </div>
      )}
      <p className="text-base font-semibold text-blue-500">LỊCH LÀM VIỆC</p>
      <div className="flex flex-col gap-3 ">
        {Object.keys(technician).length !== 0 &&
          (technician as any).schedule.map((scheduleItem: Schedule) => (
            <div
              key={scheduleItem.dayOfWeek + scheduleItem.startTime}
              className="p-3 py-5 border bg-primary-foreground rounded-md"
            >
              <h3 className="font-medium text-blue-500 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <p className="text-sm">
                  {renderDayOfWeek(scheduleItem.dayOfWeek)}
                </p>
              </h3>
              <div className="grid grid-cols-4 gap-2 ">
                {generateTimeSlots(
                  (scheduleItem as any).startTime,
                  (scheduleItem as any).endTime
                ).map((slot) => (
                  <Button
                    key={slot}
                    variant={"outline"}
                    className="pointer-events-none"
                  >
                    <p className="text-slate-600 dark:text-slate-300">{slot}</p>
                  </Button>
                ))}
              </div>
            </div>
          ))}
      </div>
      {Object.keys(technician).length !== 0 && (
        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            className="w-fit flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Cập nhật
            <ArrowUpFromLine className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

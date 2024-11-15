"use client";
import { Button } from "@/components/ui/button";
import {
  ArrowUpFromLine,
  Cat,
  Clock,
  Dog,
  Mail,
  MapPin,
  Phone,
  SquareActivity,
  Trash2,
  User,
  UserCog,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  generateTimeSlots,
  renderDayOfWeek,
  renderRole,
  renderSpecialty,
} from "../../../lib/utils";
import { Schedule, Staff } from "../../../lib/entity-types";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import axios from "axios";

export default function StaffDetails({
  isOpen,
  setIsOpen,
  routes,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  routes: string;
}) {
  const [staff, setStaff] = useState<Staff | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(routes);
        console.log(routes);
        setStaff(response.data || response.data[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [routes]);
  return (
    <div>
      <Dialog open={isOpen || false} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[900px] w-[90%] h-[90%] overflow-y-auto">
          {staff && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-4 border rounded-md p-4 mr-4">
                {staff?.gender?.toLowerCase() === "male" ? (
                  <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-blue-200 border-2 border-blue-500">
                    <Dog className="text-blue-500" />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-pink-200 border-2 border-pink-500">
                    <Cat className="text-pink-500" />
                  </div>
                )}
                <div>
                  <p className="text-base font-semibold ">
                    {staff?.gender?.toLowerCase() === "male" ? (
                      <p className="text-blue-500">{staff?.fullName}</p>
                    ) : (
                      <p className="text-pink-500">{staff?.fullName}</p>
                    )}
                  </p>
                  <p className="text-slate-500">Mã bác sĩ: {staff?._id}</p>
                </div>
              </div>
              <div className="border rounded-md p-4 mr-4">
                <div className="gap-3 grid grid-cols-2">
                  <div className="flex items-center gap-2">
                    <UserCog className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Vai trò:{" "}
                      {staff?.isDepartmentHead
                        ? "Trưởng khoa"
                        : renderRole(staff?.role + "")}
                    </span>
                  </div>
                  {staff?.specialization ? (
                    <div className="flex items-center gap-2">
                      <SquareActivity className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">
                        Chuyên khoa:{" "}
                        {renderSpecialty(staff?.specialization + "")}
                      </span>
                    </div>
                  ) : null}
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Giới tính:{" "}
                      {staff?.gender?.toLowerCase() === "female" ? "Nữ" : "Nam"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Địa chỉ: {staff?.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Số ĐT: {staff?.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Email: {staff?.email}</span>
                  </div>
                </div>
              </div>
              <div className="border rounded-md p-4 mr-4">
                <h3 className="text-md font-semibold mb-3">Lịch làm việc</h3>
                <Separator></Separator>
                <div className="flex flex-col gap-3">
                  {(staff as any)?.schedule?.map((scheduleItem: Schedule) => (
                    <div key={scheduleItem._id + ""} className="mt-4">
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
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-row gap-4 mr-4 justify-end items-end flex-grow">
                <Button variant="destructive">
                  Xoá
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600">
                  Cập nhật
                  <ArrowUpFromLine className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

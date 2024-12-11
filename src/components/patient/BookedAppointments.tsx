import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePathname } from "next/navigation";
import { AppointmentByPatient, Patient } from "../../../lib/entity-types";
import { formatDate, formatDate2, renderSpecialty } from "../../../lib/utils";
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
import { Trash2 } from "lucide-react";
export default function BookedAppointments() {
  const pathname = usePathname();
  const patientId = pathname.split("/")[1];
  const [appointmentByPatients, setAppointmentByPatients] = useState<
    AppointmentByPatient[]
  >([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [apmtId, setApmtId] = useState("");
  const fetchData = async () => {
    if (!pathname.split("_").includes("/user")) {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/appointmentsByPatient`
      );
      const newBookedApmts = response.data
        .filter((item: AppointmentByPatient) => {
          return item.patientId === patientId;
        })
        .sort((a: any, b: any) => {
          return (
            new Date(a.appointmentDateByPatient).getTime() -
            new Date(b.appointmentDateByPatient).getTime()
          );
        });
      setAppointmentByPatients(newBookedApmts);
    } else {
      setAppointmentByPatients([]);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteAppointmentByPatient = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/appointmentsByPatient/?_id=${apmtId}`
      );
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-full">
      <p className="text-base font-semibold text-blue-500 uppercase">
        Danh sách lịch hẹn đã đặt
      </p>
      <div className="w-full border rounded-md p-4 bg-primary-foreground">
        {!appointmentByPatients || appointmentByPatients?.length === 0 ? (
          <p className="text-slate-500 text-sm">Chưa có lịch đã đặt</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-blue-500 font-semibold">
                  STT
                </TableHead>
                <TableHead className="text-blue-500 font-semibold">
                  Ngày đặt khám
                </TableHead>
                <TableHead className="text-blue-500 font-semibold">
                  Đặt lịch theo
                </TableHead>
                <TableHead className="text-blue-500 font-semibold">
                  Chuyên khoa
                </TableHead>
                <TableHead className="text-blue-500 font-semibold">
                  Đặt vào lúc
                </TableHead>
                <TableHead className="text-blue-500 font-semibold">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointmentByPatients &&
                appointmentByPatients?.map((item: any, index) => (
                  <TableRow key={item.diagnosisDate + index}>
                    <TableCell className="text-slate-600 dark:text-slate-300">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-300">
                      {formatDate(item?.appointmentDateByPatient)}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-300">
                      {item.doctorId ? "Đặt theo Bác sĩ" : "Đặt theo ngày"}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-300">
                      {renderSpecialty(item.specialization)}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-300">
                      {formatDate2(item?.createdAt)}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-300">
                      <Button
                        variant={"destructive"}
                        onClick={() => {
                          setApmtId(item._id);
                          setIsAlertOpen(true);
                        }}
                      >
                        Xoá
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </div>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="dark:bg-primary-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-slate-300 text-slate-600">
              Bạn có chắc chắn muốn xoá?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Điều này sẽ xoá vĩnh viễn dữ
              liệu của bạn khỏi máy chủ của chúng tôi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-none bg-red-500 dark:bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600 hover:text-white">
              Huỷ
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAppointmentByPatient}
              className="border-none bg-blue-500 dark:bg-blue-500 text-white dark:text-white hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white"
            >
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

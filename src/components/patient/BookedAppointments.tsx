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
      const newBookedApmts = response.data.filter(
        (item: AppointmentByPatient) => {
          return item.patientId === patientId;
        }
      );
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
                <TableHead>STT</TableHead>
                <TableHead>Ngày đặt khám</TableHead>
                <TableHead>Đặt lịch theo</TableHead>
                <TableHead>Chuyên khoa</TableHead>
                <TableHead>Đặt vào lúc</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointmentByPatients &&
                appointmentByPatients?.map((item: any, index) => (
                  <TableRow key={item.diagnosisDate + index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {formatDate(item?.appointmentDateByPatient)}
                    </TableCell>
                    <TableCell>
                      {item.doctorId ? "Đặt theo Bác sĩ" : "Đặt theo ngày"}
                    </TableCell>
                    <TableCell>
                      {renderSpecialty(item.specialization)}
                    </TableCell>
                    <TableCell>{formatDate2(item?.createdAt)}</TableCell>
                    <TableCell>
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
            <AlertDialogAction onClick={handleDeleteAppointmentByPatient}>
              Xác nhận xoá
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

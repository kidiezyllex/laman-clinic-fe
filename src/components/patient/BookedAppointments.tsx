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
import { formatDate, formatDate2 } from "../../../lib/utils";

export default function BookedAppointments() {
  const pathname = usePathname();
  const patientId = pathname.split("/")[1];
  const [appointmentByPatients, setAppointmentByPatients] = useState<
    AppointmentByPatient[]
  >([]);
  const fetchData = async () => {
    if (!pathname.split("_").includes("/user")) {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/appointmentsByPatient/?patientId=${patientId}`
      );
      setAppointmentByPatients(response.data);
    } else {
      setAppointmentByPatients([]);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-full">
      <p className="text-base font-semibold text-blue-500 uppercase">
        Danh sách lịch hẹn đã đặt
      </p>
      <div className="w-full border rounded-md p-4">
        {!appointmentByPatients || appointmentByPatients?.length === 0 ? (
          <p className="text-slate-500 text-sm">Chưa có lịch đã đặt</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Ngày đặt khám</TableHead>
                <TableHead>Bác sĩ</TableHead>
                <TableHead>Chuyên khoa</TableHead>
                <TableHead>Đặt vào lúc</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointmentByPatients &&
                appointmentByPatients?.map((item: any, index) => (
                  <TableRow key={item.diagnosisDate}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {formatDate(item?.appointmentDateByPatient)}
                    </TableCell>
                    <TableCell>{item.doctorId}</TableCell>
                    <TableCell>{item.specialization}</TableCell>
                    <TableCell>{formatDate2(item?.createdAt)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

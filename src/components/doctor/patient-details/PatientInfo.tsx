import { formatDate } from "../../../../lib/utils";
import { Appointment } from "../../../../lib/entity-types";
import {
  Calendar,
  Cat,
  Dog,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PatientInfoProps {
  selectedAppointment: Appointment;
}

export default function PatientInfo({ selectedAppointment }: PatientInfoProps) {
  return (
    <>
      <div className="flex items-center space-x-4 border rounded-md p-4 mr-4 bg-primary-foreground">
        {selectedAppointment?.gender?.toLowerCase() === "male" ? (
          <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-blue-200 border border-blue-500">
            <Dog className="text-blue-500" />
          </div>
        ) : (
          <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-pink-200 border border-pink-500">
            <Cat className="text-pink-500" />
          </div>
        )}
        <div>
          <p className="text-base font-semibold ">
            <span className="text-slate-600 dark:text-slate-300">
              {selectedAppointment?.fullName}
            </span>
          </p>
          <p className="text-slate-500">
            Mã bệnh nhân: {selectedAppointment?.patientId}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 border rounded-md p-4 mr-4 text-slate-600 dark:text-slate-300 bg-primary-foreground">
        <div className="flex flex-col gap-3">
          <h3 className="text-md font-semibold">Thông tin bệnh nhân</h3>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-sm">
              Ngày sinh: {formatDate(selectedAppointment?.dateOfBirth)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            <span className="text-sm">
              Giới tính:{" "}
              {selectedAppointment?.gender?.toLowerCase() === "female"
                ? "Nữ"
                : "Nam"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="text-sm">
              Địa chỉ: {selectedAppointment?.address}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-500" />
            <span className="text-sm">Số ĐT: {selectedAppointment?.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-500" />
            <span className="text-sm">Email: {selectedAppointment?.email}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-md font-semibold">Thông tin lịch hẹn đăng ký</p>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-sm">
              Ngày hẹn khám:{" "}
              {formatDate(
                new Date((selectedAppointment as any)?.appointmentDate)
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <span className="text-sm">Trạng thái: Đang chờ khám</span>
          </div>
        </div>
      </div>
      <div className="border rounded-md p-4 mr-4 text-slate-600 dark:text-slate-300 bg-primary-foreground">
        <div className="flex flex-col w-full">
          <h3 className="text-md font-semibold mb-2">Lịch sử khám bệnh</h3>
          {selectedAppointment?.medicalHistory?.length === 0 ? (
            <p className="text-slate-500 text-sm">Chưa có lịch sử khám bệnh</p>
          ) : (
            <Table className="border bg-background pointer-events-none">
              <TableHeader>
                <TableRow>
                  <TableHead>STT</TableHead>
                  <TableHead>Ngày khám</TableHead>
                  <TableHead>Tiền sử bệnh</TableHead>
                  <TableHead>Chẩn đoán bệnh</TableHead>
                  <TableHead>KQ Xét nghiệm</TableHead>
                  <TableHead>Phương pháp điều trị</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedAppointment?.medicalHistory?.map(
                  (history: any, index) => (
                    <TableRow key={history.diagnosisDate}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {formatDate(history?.diagnosisDate)}
                      </TableCell>
                      <TableCell>{history.disease.split("_")[0]}</TableCell>
                      <TableCell>{history.disease.split("_")[1]}</TableCell>
                      <TableCell>{history.disease.split("_")[2]}</TableCell>
                      <TableCell>
                        {history.treatment.split("_")[0] +
                          history.treatment.split("_")[1]}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </>
  );
}

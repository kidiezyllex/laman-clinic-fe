import { formatDate, formatDate2 } from "../../../../lib/utils";
import { Appointment, Prescription, Test } from "../../../../lib/entity-types";
import {
  Calendar,
  Cat,
  ChevronUp,
  Dog,
  Eye,
  FileText,
  FlaskConical,
  Mail,
  MapPin,
  Phone,
  Pill,
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
import { Button } from "@/components/ui/button";
import axios from "axios";
import PrescriptionDetails from "./PrescriptionDetails";
import { useState } from "react";
import TestResults from "./TestResults";

interface PatientInfoProps {
  selectedAppointment: Appointment;
}

export default function PatientInfo({ selectedAppointment }: PatientInfoProps) {
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [selectedTestIndex, setSelectedTestIndex] = useState(-1);
  const [selectedPresIndex, setSelectedPresIndex] = useState(-1);
  const handleViewPrescriptionDetails = async (appointmentId: string) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/prescriptions/?appointmentId=${appointmentId}`
    );
    setSelectedPrescription(res.data);
  };

  const handleViewTestDetails = async (appointmentId: string) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/tests/?appointmentId=${appointmentId}`
    );
    setSelectedTest(res.data);
  };
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
                  <TableHead>Ngày giờ khám</TableHead>
                  <TableHead>Tiền sử bệnh</TableHead>
                  <TableHead>Chẩn đoán bệnh</TableHead>
                  <TableHead>Phương pháp điều trị</TableHead>
                  <TableHead>Đơn thuốc</TableHead>
                  <TableHead>Kết quả XN</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedAppointment?.medicalHistory?.map(
                  (history: any, index) => (
                    <TableRow key={history.diagnosisDate}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {formatDate2(history?.diagnosisDate)}
                      </TableCell>
                      <TableCell>{history.disease.split("_")[0]}</TableCell>
                      <TableCell>{history.disease.split("_")[1]}</TableCell>
                      <TableCell>
                        {history.treatment.split("_")[0] +
                          history.treatment.split("_")[1]}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            setSelectedPresIndex(index);
                            handleViewPrescriptionDetails(
                              history?.appointmentId
                            );
                          }}
                          variant="secondary"
                          className={
                            index === selectedPresIndex
                              ? "w-fit flex items-center space-x-2 bg-blue-500 hover:text-white hover:bg-blue-600 text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                              : "border border-slate-00 dark:border-none pointer-events-auto"
                          }
                        >
                          Chi tiết
                          <Pill className="w-4 h-4" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            setSelectedTestIndex(index);
                            handleViewTestDetails(history?.appointmentId);
                          }}
                          variant="secondary"
                          className={
                            index === selectedTestIndex
                              ? "w-fit flex items-center space-x-2 bg-blue-500 hover:text-white hover:bg-blue-600 text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                              : "border border-slate-00 dark:border-none pointer-events-auto"
                          }
                        >
                          Chi tiết
                          <FlaskConical className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          )}
          {selectedPrescription && (
            <PrescriptionDetails
              selectedPrescription={selectedPrescription}
            ></PrescriptionDetails>
          )}
          {selectedTest && (
            <TestResults testResults={selectedTest}></TestResults>
          )}
          <Button
            onClick={() => {
              setSelectedTest(null);
              setSelectedPrescription(null);
              setSelectedTestIndex(-1);
              setSelectedPresIndex(-1);
            }}
            type="submit"
            className={
              selectedPrescription || selectedTest
                ? "mt-4 w-fit flex items-center self-end space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white text-white hover:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                : "hidden"
            }
          >
            Thu gọn
            <ChevronUp className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
}

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
import { Patient, Prescription } from "../../../lib/entity-types";
import { formatDate, formatDate2 } from "../../../lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { FlaskConical, Pill } from "lucide-react";
import PrescriptionDetails from "../doctor/patient-details/PrescriptionDetails";
export default function MedicalHistory() {
  const pathname = usePathname();
  const patientId = pathname.split("/")[1];
  const { toast } = useToast();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  useEffect(() => {
    const fetchPatientByAccountId = async () => {
      try {
        if (!pathname.split("_").includes("/user")) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/${patientId}`
          );
          setPatient(response.data);
        } else {
          setPatient(null);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPatientByAccountId();
  }, []);

  const handleViewPrescriptionDetails = async (appointmentId: string) => {
    console.log(appointmentId);
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/prescriptions/?appointmentId=${appointmentId}`
    );
    setSelectedPrescription(res.data);
  };
  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-full">
      <p className="text-base font-semibold text-blue-500 uppercase">
        Lịch sử khám bệnh
      </p>
      <div className="w-full border rounded-md p-4 bg-primary-foreground">
        {!patient || patient?.medicalHistory?.length === 0 ? (
          <p className="text-slate-500 text-sm">Chưa có lịch sử khám bệnh</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-blue-500 font-semibold">
                  STT
                </TableHead>
                <TableHead className="text-blue-500 font-semibold">
                  Ngày giờ khám
                </TableHead>
                <TableHead className="text-blue-500 font-semibold">
                  Tiền sử bệnh
                </TableHead>
                <TableHead className="text-blue-500 font-semibold">
                  Chẩn đoán bệnh
                </TableHead>
                <TableHead className="text-blue-500 font-semibold">
                  Phương pháp điều trị
                </TableHead>
                <TableHead className="text-blue-500 font-semibold">
                  Đơn thuốc
                </TableHead>
                <TableHead className="text-blue-500 font-semibold">
                  Kết quả xét nghiệm
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patient?.medicalHistory?.map((history: any, index) => (
                <TableRow key={history.diagnosisDate}>
                  <TableCell className="text-slate-600 dark:text-slate-300">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300">
                    {formatDate2(history?.diagnosisDate)}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300">
                    {history.disease.split("_")[0]}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300">
                    {history.disease.split("_")[1]}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300">
                    {history.treatment.split("_")[0] +
                      history.treatment.split("_")[1]}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300">
                    <Button
                      onClick={() =>
                        handleViewPrescriptionDetails(history?.appointmentId)
                      }
                      variant="secondary"
                      className="flex items-center space-x-2 hover:text-white text-white bg-blue-500 hover:bg-blue-600 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      Chi tiết
                      <Pill className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() =>
                        handleViewPrescriptionDetails(history?.appointmentId)
                      }
                      variant="secondary"
                      className="flex items-center space-x-2 hover:text-white text-white bg-blue-500 hover:bg-blue-600 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      Chi tiết
                      <FlaskConical className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      {selectedPrescription && (
        <PrescriptionDetails
          selectedPrescription={selectedPrescription}
        ></PrescriptionDetails>
      )}
    </div>
  );
}

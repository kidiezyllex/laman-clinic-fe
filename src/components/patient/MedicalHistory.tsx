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
                <TableHead>STT</TableHead>
                <TableHead>Ngày giờ khám</TableHead>
                <TableHead>Tiền sử bệnh</TableHead>
                <TableHead>Chẩn đoán bệnh</TableHead>
                <TableHead>Phương pháp điều trị</TableHead>
                <TableHead>Đơn thuốc</TableHead>
                <TableHead>Kết quả xét nghiệm</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patient?.medicalHistory?.map((history: any, index) => (
                <TableRow key={history.diagnosisDate}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{formatDate2(history?.diagnosisDate)}</TableCell>
                  <TableCell>{history.disease.split("_")[0]}</TableCell>
                  <TableCell>{history.disease.split("_")[1]}</TableCell>
                  <TableCell>
                    {history.treatment.split("_")[0] +
                      history.treatment.split("_")[1]}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() =>
                        handleViewPrescriptionDetails(history?.appointmentId)
                      }
                      variant="secondary"
                      className="border border-slate-00 dark:border-none pointer-events-auto"
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
                      className="border border-slate-00 dark:border-none pointer-events-auto"
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

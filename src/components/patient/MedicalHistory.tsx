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
import { Patient } from "../../../lib/entity-types";
import { formatDate } from "../../../lib/utils";
import { useToast } from "@/hooks/use-toast";
export default function MedicalHistory() {
  const pathname = usePathname();
  const patientId = pathname.split("/")[1];
  const { toast } = useToast();
  const [patient, setPatient] = useState<Patient | null>(null);
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

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-full">
      <p className="text-base font-semibold text-blue-500 uppercase">
        Lịch sử khám bệnh
      </p>
      <div className="w-full border rounded-md p-4">
        {patient && patient?.medicalHistory?.length === 0 ? (
          <p className="text-slate-500 text-sm">Chưa có lịch sử khám bệnh</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Ngày khám</TableHead>
                <TableHead>Chẩn đoán bệnh</TableHead>
                <TableHead>Phương pháp điều trị</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patient &&
                patient?.medicalHistory?.map((history: any, index) => (
                  <TableRow key={history.diagnosisDate}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{formatDate(history?.diagnosisDate)}</TableCell>
                    <TableCell>{history.disease}</TableCell>
                    <TableCell>{history.treatment}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

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
import { Patient } from "../../../lib/entity-types";
import { formatDate } from "../../../lib/utils";
import { useToast } from "@/hooks/use-toast";
const samplePatientData = {
  _id: "BN-PMQ7TS",
  fullName: "Hồ Đức Lâm",
  gender: "Male",
  password: "$2a$12$e3o.Enlcck9mtToe7iHnYugIFtL8/kD3jAFM63HqZSVVThDMZvsnO",
  phone: "+84352923442",
  email: "hoduclam24082002hight@gmail.com",
  medicalHistory: [
    {
      diagnosisDescription: "Cảm nhẹ, ho khan",
      diagnosisDate: "2024-10-22T12:44:56.869Z",
      treatment: "Sử dụng thuốc",
      _id: "67179e48c862a45935495460",
    },
    {
      diagnosisDescription: "Sỏi thận nhỏ 1-2 mm",
      diagnosisDate: "2024-10-25T11:35:18.592Z",
      treatment: "Giải phẫu",
      _id: "671b827608fc3853ac883d02",
    },
  ],
  createdAt: "2024-10-20T10:25:36.230Z",
  updatedAt: "2024-10-25T11:35:18.598Z",
  __v: 0,
};
export default function MedicalHistory() {
  const pathname = usePathname();
  const patientId = pathname.split("/")[1];
  const { toast } = useToast();
  const [patient, setPatient] = useState<Patient | null>(null);
  useEffect(() => {
    const fetchPatientByAccountId = async () => {
      try {
        // if (!pathname.split("_").includes("/user")) {
        //   const response = await axios.get(
        //     `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/${patientId}`
        //   );
        //   setPatient(response.data);
        // } else {
        //   setPatient(null);
        // }
        setPatient(samplePatientData as any);
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
                    <TableCell>{history.diagnosisDescription}</TableCell>
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

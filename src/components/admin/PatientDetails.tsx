"use client";
import { useState, useEffect } from "react";
import * as z from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Cat, Dog, Mail, MapPin, Phone, User } from "lucide-react";
import axios from "axios";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePathname } from "next/navigation";
import { formatDate } from "../../../lib/utils";
import { Patient } from "../../../lib/entity-types";

export default function PatientDetails({
  isOpen,
  setIsOpen,
  selectedUserEmail,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedUserEmail: string;
}) {
  const pathname = usePathname();
  // state
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        if (!pathname.split("_").includes("/user")) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/?email=${selectedUserEmail}`
          );
          setPatient(response.data);
        } else {
          setPatient(null);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPatientData();
  }, [selectedUserEmail]);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[900px] w-[90%] h-[90%] overflow-y-auto">
          {patient && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-4 border rounded-md p-4 mr-4">
                {patient?.gender?.toLowerCase() === "male" ? (
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
                    {patient?.gender?.toLowerCase() === "male" ? (
                      <p className="text-blue-500">{patient?.fullName}</p>
                    ) : (
                      <p className="text-pink-500">{patient?.fullName}</p>
                    )}
                  </p>
                  <p className="text-slate-500">Mã bệnh nhân: {patient?._id}</p>
                </div>
              </div>
              <div className="border rounded-md p-4 mr-4">
                <div className="flex flex-col gap-3">
                  <h3 className="text-md font-semibold">Thông tin bệnh nhân</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Ngày sinh: {formatDate(patient?.dateOfBirth)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Giới tính:{" "}
                      {patient?.gender?.toLowerCase() === "female"
                        ? "Nữ"
                        : "Nam"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Địa chỉ: {patient?.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Số ĐT: {patient?.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Email: {patient?.email}</span>
                  </div>
                </div>
              </div>
              <div className="border rounded-md p-4 mr-4">
                <div className="flex flex-col gap-1 w-full">
                  <h3 className="text-md font-semibold">Lịch sử khám bệnh</h3>
                  {patient?.medicalHistory?.length === 0 ? (
                    <p className="text-slate-500 text-sm">
                      Chưa có lịch sử khám bệnh
                    </p>
                  ) : (
                    <Table>
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
                        {patient?.medicalHistory?.map((history: any, index) => (
                          <TableRow key={history.diagnosisDate}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              {formatDate(history?.diagnosisDate)}
                            </TableCell>
                            <TableCell>
                              {history.disease.split("_")[0]}
                            </TableCell>
                            <TableCell>
                              {history.disease.split("_")[1]}
                            </TableCell>
                            <TableCell>
                              {history.disease.split("_")[2]}
                            </TableCell>
                            <TableCell>
                              {history.treatment.split("_")[0] +
                                history.treatment.split("_")[1]}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

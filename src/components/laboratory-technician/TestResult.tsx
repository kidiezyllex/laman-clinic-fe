import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { formatDate, renderSpecialty } from "../../../lib/utils";
import { FileImage, FileText } from "lucide-react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Doctor, Patient, Test } from "../../../lib/entity-types";
import { useEffect, useState } from "react";
import axios from "axios";
export default function TestResult({
  isOpen,
  setIsOpen,
  selectedTest,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedTest: Test | null;
}) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      if (selectedTest?.doctorId && selectedTest?.patientId) {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/${selectedTest?.doctorId}`
        );
        const res2 = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/${selectedTest?.patientId}`
        );
        setDoctor(res.data);
        setPatient(res2.data);
      }
    };
    fetchData();
  }, [selectedTest]);
  const exportToPDF = async () => {
    try {
      const input = document.getElementById("preview");
      if (!input) throw new Error("Preview element not found");

      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("portrait");
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("export.pdf");
    } catch (err) {
      console.error(err);
    }
  };

  const exportToImage = async () => {
    try {
      const input = document.getElementById("preview");
      if (!input) throw new Error("Preview element not found");

      const canvas = await html2canvas(input);
      const link = document.createElement("a");
      link.download = "export.png";
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Dialog open={isOpen || false} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[900px] w-[90%] h-[90%] overflow-y-auto">
          <div
            id="preview"
            className="p-6 m-4 my-6 dark:bg-white dark:text-slate-950 rounded-md"
          >
            <div className="border">
              <div className="flex flex-row items-center justify-between h-full my-4 px-5">
                <div className="w-32 h-32 relative z-0 rounded-full border-4 border-blue-500">
                  <Image
                    src="https://res.cloudinary.com/drqbhj6ft/image/upload/v1726685609/learning-webdev-blog/clinic/medical-care-logo-icon-design-vector-22560842_j6xhlk.jpg"
                    alt="logo-image"
                    className="object-cover rounded-full"
                    layout="fill"
                  />
                </div>
                <div className="flex flex-col gap-1 items-center">
                  <p className="text-2xl font-bold font-['Times_New_Roman',_Times,_serif]">
                    BỆNH VIÊN ĐA KHOA LAMAN
                  </p>
                  <p className="text-2xl font-['Times_New_Roman',_Times,_serif] italic">
                    (KHOA XÉT NGHIỆM)
                  </p>
                  <p className="text-sm text-center font-bold font-['Times_New_Roman',_Times,_serif]">
                    Địa chỉ: 20/12 Phạm Huy Thông, Phường 17, Gò Vấp, T.P HCM
                  </p>
                  <p className="text-sm font-bold font-['Times_New_Roman',_Times,_serif]">
                    Số Điện thoại: 098765674323 | Ngày lập phiếu:{" "}
                    {formatDate(new Date())}
                  </p>
                </div>
                <div>
                  <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                    Ký hiệu (Serial):
                  </p>
                  <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                    Số (No.):
                  </p>
                </div>
              </div>
              <p className="text-2xl text-center font-bold font-['Times_New_Roman',_Times,_serif] mb-4">
                PHIẾU KẾT QUẢ XÉT NGHIỆM
              </p>
              <Separator className="bg-slate-950"></Separator>
              <div className="p-4 flex flex-col gap-2">
                <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                  Tên bệnh nhân: {patient?.fullName}
                </p>
                <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                  Ngày sinh: {formatDate(patient?.dateOfBirth)}
                </p>
                <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                  Giới tính:{" "}
                  {patient?.gender?.toLocaleLowerCase() === "male"
                    ? "Nam"
                    : "Nữ"}
                </p>
                <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                  Số điện thoại: {patient?.phone}
                </p>
                <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                  Địa chỉ: {patient?.address}
                </p>
                <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                  Khoa/phòng chỉ định:{" "}
                  {renderSpecialty((doctor as any)?.specialization)}
                </p>
                <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                  Bác sĩ chỉ định: {doctor?.fullName}
                </p>
                <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                  Chẩn đoán:
                </p>
              </div>
            </div>
            <Table className="border">
              <TableHeader>
                <TableRow className="pointer-events-none">
                  <TableHead className="dark:text-black">STT</TableHead>
                  <TableHead className="dark:text-black">
                    Tên xét nghiệm
                  </TableHead>
                  <TableHead className="dark:text-black">Kết quả</TableHead>
                  <TableHead className="dark:text-black">
                    Khoảng tham chiếu
                  </TableHead>
                  <TableHead className="dark:text-black">Đơn vị</TableHead>
                  <TableHead className="dark:text-black">Thiết bị</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedTest?.results?.map((result, index) => (
                  <TableRow key={index} className="pointer-events-none">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{result.testName}</TableCell>
                    <TableCell>{result.testResult}</TableCell>
                    <TableCell>{result.referenceRange}</TableCell>
                    <TableCell>{result.measurementUnit}</TableCell>
                    <TableCell>{result.equipment}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end mr-4 gap-3">
            <Button
              onClick={exportToPDF}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Xuất File PDF
              <FileText className="mr-2 h-4 w-4" />
            </Button>
            <Button
              onClick={exportToImage}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Xuất File Ảnh
              <FileImage className="mr-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

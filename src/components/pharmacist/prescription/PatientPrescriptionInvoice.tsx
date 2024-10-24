import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { formatDate } from "../../../../lib/utils";

interface Medication {
  medicationName: string;
  dose: string;
  quantity: number;
  price: number;
  instructions: string;
  _id: string;
}

interface Prescription {
  _id: string;
  patientId: string;
  doctorId: string;
  medications: Medication[];
  dateIssued: Date;
}

interface PatientPrescriptionInvoiceProps {
  prescription: Prescription;
  newMedication: Medication[];
}

export default function PatientPrescriptionInvoice({
  prescription,
  newMedication,
}: PatientPrescriptionInvoiceProps) {
  const [isLoading, setIsLoading] = useState(false);

  const exportToPDF = async () => {
    setIsLoading(true);
    try {
      const input = document.getElementById("preview");
      if (!input) throw new Error("Preview element not found");

      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape");
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("export.pdf");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToImage = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Card
        className="p-6 m-4 dark:bg-secondary dark:text-slate-400"
        id="preview"
      >
        <div className="border border-slate-500">
          <div className="flex flex-row gap-16 items-center justify-center h-full my-4">
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
                HÓA ĐƠN GIÁ TRỊ GIA TĂNG
              </p>
              <p className="text-2xl font-['Times_New_Roman',_Times,_serif] italic">
                (VAT INVOICE)
              </p>
              <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                Bản thể hiện của hoá đơn điện tử
              </p>
              <p className="text-base italic font-['Times_New_Roman',_Times,_serif]">
                (Electric invoice display)
              </p>
              <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                Ngày: {formatDate(new Date())}
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
          <Separator className="bg-slate-500"></Separator>
          <div className="p-4 flex flex-col gap-2">
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Đơn vị bán hàng (Seller): CÔNG TY TRÁCH NHIỆM HỮU HẠN LAMAN CLINIC
            </p>
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Mã số thuế (Tax code): 330187899
            </p>
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Địa chỉ (Address): 2012 Phạm Huy Thông, Phường 17, Gò Vấp, T.P Hồ
              Chí Minh
            </p>
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Điện thoại (Tel): 098765674323
            </p>
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Số tài khoản (Account No.): 179232999
            </p>
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Ngân hàng (Bank): Ngân hàng BIDV Đầu tư và Phát triển Việt Nam
            </p>
          </div>
          <Separator className="bg-slate-500"></Separator>
          <div className="p-4 flex flex-col gap-2">
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Họ tên người mua (CustomerName):
            </p>
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Tên đơn vị (CompanyName):
            </p>
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Mã số thuế (Tax code):
            </p>
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Địa chỉ (Address): 2012 Phạm Huy Thông, Phường 17, Gò Vấp, T.P Hồ
              Chí Minh
            </p>
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Hình thức thanh toán (Payment Method): TM
            </p>
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Ghi chú (Note):
            </p>
          </div>
          <Separator className="bg-slate-500"></Separator>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Tên thuốc</TableHead>
                <TableHead>Liều lượng</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Đơn giá (VNĐ)</TableHead>
                <TableHead>Thành tiền (VNĐ)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newMedication.length !== 0 &&
                newMedication.map((medication, index) => (
                  <TableRow key={medication._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{medication?.medicationName}</TableCell>
                    <TableCell>{medication?.dose}</TableCell>
                    <TableCell>{medication?.quantity}</TableCell>
                    <TableCell>{medication?.price}</TableCell>
                    <TableCell>
                      {medication.price * medication.quantity}
                    </TableCell>
                  </TableRow>
                ))}
              {newMedication.length === 0 &&
                prescription.medications.map((medication, index) => (
                  <TableRow key={medication._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{medication?.medicationName}</TableCell>
                    <TableCell>{medication?.dose}</TableCell>
                    <TableCell>{medication?.quantity}</TableCell>
                    <TableCell>{medication?.price}</TableCell>
                    <TableCell>
                      {medication.price * medication.quantity}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <p className="font-bold m-4">
            Tổng cộng:{" "}
            {newMedication.length !== 0 &&
              newMedication
                .reduce((total, med) => total + med.quantity * med.price, 0)
                .toLocaleString("vi-VN")}{" "}
            {newMedication.length === 0 &&
              prescription.medications
                .reduce((total, med) => total + med.quantity * med.price, 0)
                .toLocaleString("vi-VN")}{" "}
            VNĐ
          </p>
        </div>
      </Card>
      <div className="flex justify-end m-4 gap-3">
        <Button onClick={exportToPDF} disabled={isLoading}>
          Xuất File PDF
        </Button>
        <Button onClick={exportToImage} disabled={isLoading}>
          Xuất File Ảnh
        </Button>
      </div>
    </div>
  );
}

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
import { formatDate } from "../../../../lib/utils";
import { PatientPrescriptionInvoiceProps } from "../../../../lib/entity-types";
import { FileImage, FileText } from "lucide-react";

export default function PatientPrescriptionInvoice({
  prescription,
  newMedication,
}: PatientPrescriptionInvoiceProps) {
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
      <div
        className="p-6 m-4 my-6 dark:bg-white dark:text-slate-950 rounded-md"
        id="preview"
      >
        <div className="border border-slate-950">
          <div className="flex flex-row gap-16 items-center justify-center h-full my-4">
            <div className="w-32 h-32 relative z-0 rounded-full border-2 border-blue-500">
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
          <Separator className="bg-slate-950"></Separator>
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
          <Separator className="bg-slate-950"></Separator>
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
              Địa chỉ (Address):
            </p>
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Hình thức thanh toán (Payment Method): Tiền mặt
            </p>
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Ghi chú (Note):
            </p>
          </div>
          <Separator className="bg-slate-950"></Separator>
          <Table className="pointer-events-none">
            <TableHeader>
              <TableRow>
                <TableHead className="text-slate-950 dark:text-slate-950">
                  STT
                </TableHead>
                <TableHead className="text-slate-950 dark:text-slate-950">
                  Tên thuốc
                </TableHead>
                <TableHead className="text-slate-950 dark:text-slate-950">
                  Liều lượng
                </TableHead>
                <TableHead className="text-slate-950 dark:text-slate-950">
                  Số lượng
                </TableHead>
                <TableHead className="text-slate-950 dark:text-slate-950">
                  Đơn giá (VNĐ)
                </TableHead>
                <TableHead className="text-slate-950 dark:text-slate-950">
                  Thành tiền (VNĐ)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newMedication.length !== 0 &&
                newMedication.map((medication, index) => (
                  <TableRow key={medication._id + ""}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{medication?.medicationName}</TableCell>
                    <TableCell>{medication?.dosage}</TableCell>
                    <TableCell>{medication?.quantity}</TableCell>
                    <TableCell>{medication?.price}</TableCell>
                    <TableCell>
                      {(medication.price * medication.quantity).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      VNĐ
                    </TableCell>
                  </TableRow>
                ))}
              {newMedication.length === 0 &&
                prescription.medications.map((medication, index) => (
                  <TableRow key={medication._id + ""}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{medication?.medicationName}</TableCell>
                    <TableCell>{medication?.dosage}</TableCell>
                    <TableCell>{medication?.quantity}</TableCell>
                    <TableCell>{medication?.price}</TableCell>
                    <TableCell>
                      {medication.price * medication.quantity}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <Separator className="bg-slate-950"></Separator>
          <p className="font-bold m-4 self-end text-end">
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
      </div>
      <div className="flex justify-end m-4 gap-3">
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
    </div>
  );
}

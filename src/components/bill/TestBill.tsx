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
import { formatDate } from "../../../lib/utils";
import { FileImage, FileText } from "lucide-react";
import { RequestTest } from "../../../lib/entity-types";
import axios from "axios";

export default function TestBill({
  selectedTest,
  fetchData,
}: {
  selectedTest: RequestTest | null;
  fetchData: () => void;
}) {
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
      pdf.save(
        `TB-${selectedTest?.patientId._id}-${formatDate(new Date())}.pdf`
      );
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/request-tests/${selectedTest?._id}`,
        {
          isTestInvoiceCreated: true,
        }
      );
      fetchData();
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
      link.download = `TB-${selectedTest?.patientId._id}-${formatDate(
        new Date()
      )}.png`;
      link.href = canvas.toDataURL();
      link.click();
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/request-tests/${selectedTest?._id}`,
        {
          isTestInvoiceCreated: true,
        }
      );
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div
        className="p-6 m-4 my-6 dark:bg-white dark:text-slate-950 rounded-md border"
        id="preview"
      >
        <div className="border border-slate-950">
          <div className="flex flex-row items-start justify-between h-full my-4 px-5">
            <div className="w-32 h-32 relative z-0 rounded-full border-2 border-blue-500">
              <Image
                src="https://res.cloudinary.com/drqbhj6ft/image/upload/v1726685609/learning-webdev-blog/clinic/medical-care-logo-icon-design-vector-22560842_j6xhlk.jpg"
                alt="logo-image"
                className="object-cover rounded-full"
                layout="fill"
              />
            </div>
            <div className="flex flex-col items-center">
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
          <p className="text-2xl text-center font-bold font-['Times_New_Roman',_Times,_serif] mb-4">
            HOÁ ĐƠN XÉT NGHIỆM
          </p>
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
              Mã bệnh nhân (Patient Id): {selectedTest?.patientId?._id}
            </p>
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Tên bệnh nhân (Patient): {selectedTest?.patientId?.fullName}
            </p>
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Số điện thoại (Phone): {selectedTest?.patientId?.phone}
            </p>
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Địa chỉ (Address): {selectedTest?.patientId?.address}
            </p>
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Hình thức thanh toán: Chuyển khoản/Tiền mặt
            </p>
          </div>
          <Separator className="bg-slate-950"></Separator>
          <div className="p-4 flex flex-col gap-2">
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Mã bác sĩ (Doctor): {selectedTest?.doctorId}
            </p>
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Ngày yêu cầu (Date requested):{" "}
              {formatDate(selectedTest?.requestDate)}
            </p>
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Lý do xét nghiệm (Reason): {selectedTest?.reason}
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
                  Tên xét nghiệm
                </TableHead>
                <TableHead className="text-slate-950 dark:text-slate-950">
                  Mô tả
                </TableHead>
                <TableHead className="text-slate-950 dark:text-slate-950">
                  Đơn giá (VNĐ)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedTest?.testTypes.length !== 0 &&
                selectedTest?.testTypes.map((test, index) => (
                  <TableRow key={test._id + ""}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{test?.testName}</TableCell>
                    <TableCell>{test?.description}</TableCell>
                    <TableCell>{test?.price.toLocaleString("vi-VN")}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <Separator className="bg-slate-950"></Separator>
          <p className="font-bold m-4 self-end text-end">
            Tổng cộng:{" "}
            {selectedTest?.testTypes.length !== 0 &&
              selectedTest?.testTypes
                .reduce((sum, item) => sum + item.price, 0)
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

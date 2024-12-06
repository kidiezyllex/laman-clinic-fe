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
import { formatDate, formatDate2 } from "../../../lib/utils";
import {
  Patient,
  PatientPrescriptionInvoiceProps,
} from "../../../lib/entity-types";
import { FileImage, FileText, Loader2, Receipt } from "lucide-react";
import { useUploadThing } from "@/utils/uploadthing";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

export default function PrescriptionBill({
  prescription,
  newMedication,
}: PatientPrescriptionInvoiceProps) {
  const { startUpload } = useUploadThing("imageUploader");
  const pathname = usePathname();
  const userId = pathname.split("/")[1];
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [patient, setPatient] = useState<Patient | null>(null);
  useEffect(() => {
    const fetchPatientByAccountId = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/${prescription.patientId}`
      );
      setPatient(response.data);
    };

    fetchPatientByAccountId();
  }, []);
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
      pdf.save(`HDT-${prescription.patientId}-${formatDate(new Date())}.pdf`);
    } catch (err) {
      console.error(err);
    }
  };

  const exportAndUploadImage = async () => {
    try {
      const input = document.getElementById("preview");
      if (!input) throw new Error("Preview element not found");

      const canvas = await html2canvas(input);

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve: any) =>
        canvas.toBlob(resolve, "image/png")
      );

      // Create a File object from the blob
      const file = new File(
        [blob],
        `HDT-${prescription.patientId}-${formatDate2(new Date())}.png`,
        { type: "image/png" }
      );

      // Upload the file
      const res = await startUpload([file]);

      if (res && res[0]) {
        const payload = {
          paymentMethod: "Cash",
          status: "Paid",
          type: "presInvoice",
          image: res[0].url,
          staffId: userId,
          staffRole: "Y tá xét nghiệm",
          issueDate: new Date(),
          patientId: prescription?.patientId,
        };
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/invoices`,
          payload
        );
        console.log(response.data);
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTestBill = async () => {
    setIsLoading(true);
    await exportAndUploadImage();
    await exportToPDF();
    setIsLoading(false);
    toast({
      variant: "default",
      title: "Thành công!",
      description: "Đã tạo hoá đơn đơn thuốc!",
    });
  };

  return (
    <div>
      <div
        className="p-6 m-4 my-6 dark:bg-white dark:text-slate-950 rounded-md"
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
            HOÁ ĐƠN THUỐC
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
              Mã bệnh nhân (Patient Id): {patient?._id}
            </p>
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Tên bệnh nhân (Patient): {patient?.fullName}
            </p>
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Số điện thoại (Phone): {patient?.phone}
            </p>
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Địa chỉ (Address): {patient?.address}
            </p>
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Hình thức thanh toán: Chuyển khoản/Tiền mặt
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
          disabled={isLoading}
          onClick={handleCreateTestBill}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {isLoading ? (
            <>
              Đang xử lý
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              Tạo hoá đơn
              <Receipt className="h-4 w-4" />{" "}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

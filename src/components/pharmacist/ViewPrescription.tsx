"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  SearchIcon,
  Stethoscope,
  User,
  FileImage,
  Files,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
interface Medication {
  medicationName: string;
  dose: string;
  quantity: number;
  price: number;
  instructions: string;
  _id: string;
}

interface Patient {
  _id: String;
  fullName?: string;
  phone?: string;
  email?: string;
}
interface Prescription {
  _id: string;
  patientId: string;
  doctorId: string;
  medications: Medication[];
  dateIssued: Date;
  patient: Patient;
}

export default function ViewPrescription() {
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  useState<Prescription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showInvoice, setShowInvoice] = useState({ isShow: false, id: "" });
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const searchTermLower = searchTerm.toLowerCase();
    return prescription.patientId.toLowerCase().includes(searchTermLower);
  });
  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return format(date, "dd/MM/yyyy");
  };

  // const exportAsImage = async () => {
  //   const element = document.getElementById("invoice");
  //   if (element) {
  //     const canvas = await Html2CanvasOptions(element);
  //     const image = canvas.toDataURL("image/png", 1.0);
  //     downloadImage(image, "invoice.png");
  //   }
  // };

  // const exportAsPDF = async () => {
  //   const element = document.getElementById("invoice");
  //   if (element) {
  //     const canvas = await html2canvas(element);
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF();
  //     pdf.addImage(imgData, "PNG", 0, 0);
  //     pdf.save("invoice.pdf");
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/prescriptions`
      );
      setPrescriptions(
        response.data.sort(
          (a: { dateIssued: Date }, b: { dateIssued: Date }) =>
            new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime()
        )
      );
    };

    fetchData();
  }, []);

  const exportToPDF = async () => {
    setIsLoading(true);
    try {
      const input = document.getElementById("preview");
      if (!input) throw new Error("Preview element not found");

      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
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
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%]">
      <p className="text-base font-semibold text-blue-500">
        DANH SÁCH ĐƠN THUỐC CỦA BỆNH NHÂN ĐÃ KHÁM
      </p>

      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="search"
          placeholder="Nhập mã bệnh nhân (BN-XXXXXX). Ví dụ: BN-JCXX2B"
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        {filteredPrescriptions.map((prescription) => (
          <Card key={prescription._id} className="mb-6">
            <div className="grid grid-cols-3 items-center gap-3 justify-between p-4 bg-secondary rounded-t-md">
              <p className="flex items-center text-base">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(prescription.dateIssued).toLocaleDateString("vi-VN")}
              </p>
              <p className="flex items-center text-base">
                <User className="h-4 w-4 mr-2" />
                Mã Bệnh nhân: {prescription.patientId}
              </p>
              <p className="flex items-center text-base">
                <Stethoscope className="h-4 w-4 mr-2" />
                Mã Bác sĩ: {prescription.doctorId}
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên thuốc</TableHead>
                  <TableHead>Liều lượng</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Đơn giá (VNĐ)</TableHead>
                  <TableHead>Cách dùng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescription.medications.map((medication) => (
                  <TableRow key={medication._id}>
                    <TableCell>{medication.medicationName}</TableCell>
                    <TableCell>{medication.dose}</TableCell>
                    <TableCell>{medication.quantity}</TableCell>
                    <TableCell>{medication.price}</TableCell>
                    <TableCell className="w-[35%]">
                      {medication.instructions}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex lfex-row gap-3 p-4 justify-end">
              <Button variant={"outline"}>Xem lịch sử khám</Button>
              {showInvoice.id === prescription._id && showInvoice.isShow && (
                <Button
                  variant="destructive"
                  onClick={() =>
                    setShowInvoice({ isShow: false, id: prescription._id })
                  }
                >
                  Thu gọn
                </Button>
              )}
              {!showInvoice.isShow && (
                <Button
                  variant="secondary"
                  onClick={() =>
                    setShowInvoice({ isShow: true, id: prescription._id })
                  }
                >
                  Xem hoá đơn
                </Button>
              )}
            </div>
            {showInvoice.id === prescription._id && showInvoice.isShow && (
              <div>
                <Card
                  className="p-6 m-4 dark:bg-secondary dark:text-slate-400"
                  id="preview"
                >
                  <div className="border border-slate-500">
                    <div className="flex flex-row gap-16 items-center justify-center h-full my-4">
                      <div className="w-32 h-32 relative z-0 rounded-full border-4 border-blue-500">
                        <Image
                          src={
                            "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726685609/learning-webdev-blog/clinic/medical-care-logo-icon-design-vector-22560842_j6xhlk.jpg"
                          }
                          alt={"logo-image"}
                          className="object-cover rounded-full "
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
                        Đơn vị bán hàng (Seller): CÔNG TY TRÁCH NHIỆM HỮU HẠN
                        LAMAN CLINIC
                      </p>
                      <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                        Mã số thuế (Tax code): 330187899
                      </p>
                      <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                        Địa chỉ (Address): 2012 Phạm Huy Thông, Phường 17, Gò
                        Vấp, T.P Hồ Chí Minh
                      </p>
                      <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                        Điện thoại (Tel): 098765674323
                      </p>
                      <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                        Số tài khoản (Account No.): 179232999
                      </p>
                      <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                        Ngân hàng (Bank): Ngân hàng BIDV Đầu tư và Phát triển
                        Việt Nam
                      </p>
                    </div>
                    <Separator className="bg-slate-500"></Separator>
                    <div className="p-4 flex flex-col gap-2">
                      <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                        Họ tên người mua (Customer's name):
                      </p>
                      <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                        Tên đơn vị (Company's name):
                      </p>
                      <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                        Mã số thuế (Tax code):
                      </p>
                      <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
                        Địa chỉ (Address): 2012 Phạm Huy Thông, Phường 17, Gò
                        Vấp, T.P Hồ Chí Minh
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
                        {prescription.medications.map((medication, index) => (
                          <TableRow key={medication._id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{medication.medicationName}</TableCell>
                            <TableCell>{medication.dose}</TableCell>
                            <TableCell>{medication.quantity}</TableCell>
                            <TableCell>{medication.price}</TableCell>
                            <TableCell>
                              {medication.price * medication.quantity}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <p className="font-bold m-4">
                      Tổng cộng:{" "}
                      {prescription.medications
                        .reduce(
                          (total, med) => total + med.quantity * med.price,
                          0
                        )
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
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

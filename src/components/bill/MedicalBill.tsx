import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { AppointmentByPatient, Patient } from "../../../lib/entity-types";
import {
  formatDate,
  formatDate3,
  generateExamination,
  renderPriceBySpeAndService,
  renderSpecialty,
} from "../../../lib/utils";

interface MedicalBillProps {
  selectedPatient: Patient | null;
  selectedAppointment: AppointmentByPatient | null;
  reason: string;
  selectedService: string;
  inputSpecialization: string | null;
}

export default function MedicalBill({
  selectedPatient,
  selectedAppointment,
  reason,
  selectedService,
  inputSpecialization,
}: MedicalBillProps) {
  const serviceName = [
    "Khám tổng quát",
    "Khám sức khỏe định kỳ",
    "Khám chuyên khoa",
    "Gói khám sức khỏe toàn diện",
    "Khám chẩn đoán hình ảnh",
  ];

  return (
    <div
      id="preview"
      className="p-6 m-4 my-6 dark:bg-white dark:text-slate-950 rounded-md"
    >
      <div className="border border-black">
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
          HOÁ ĐƠN KHÁM BỆNH
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
            Mã bệnh nhân (Patient Id):{" "}
            {selectedAppointment?.patientId || selectedPatient?._id}
          </p>
          <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
            Tên bệnh nhân (Patient):{" "}
            {selectedAppointment?.fullName || selectedPatient?.fullName}
          </p>
          <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
            Số điện thoại (Phone):{" "}
            {selectedAppointment?.phone || selectedPatient?.phone}
          </p>
          <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
            Địa chỉ (Address):{" "}
            {selectedAppointment?.address || selectedPatient?.address}
          </p>
          <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
            Hình thức thanh toán: Chuyển khoản/Tiền mặt
          </p>
        </div>
        <Separator className="bg-slate-950"></Separator>
        <div className="p-4 flex flex-col gap-2">
          {selectedAppointment?.doctorId ? (
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Mã bác sĩ (Doctor): {selectedAppointment?.doctorId}
            </p>
          ) : null}

          <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
            Chuyên khoa (Specialization):{" "}
            {renderSpecialty(selectedAppointment?.specialization + "") ||
              renderSpecialty(inputSpecialization + "")}
          </p>
          {selectedAppointment?.doctorId ? (
            <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
              Ca khám (Examination):{" "}
              {generateExamination(
                formatDate3(selectedAppointment?.appointmentDateByPatient)
              )}
            </p>
          ) : null}
          <p className="text-base font-bold font-['Times_New_Roman',_Times,_serif]">
            Lý do khám (Reason): {reason}
          </p>
        </div>
        <Separator className="bg-slate-950"></Separator>
        <Table>
          <TableHeader>
            <TableRow className="pointer-events-none">
              <TableHead className="text-black dark:text-black">
                Chuyên khoa
              </TableHead>
              <TableHead className="text-black dark:text-black">
                Loại dịch vụ
              </TableHead>
              <TableHead className="text-black dark:text-black">
                Đơn giá (VNĐ)
              </TableHead>
              <TableHead className="text-black dark:text-black">
                Bảo hiểm y tế
              </TableHead>
              <TableHead className="text-black dark:text-black">
                Thành tiền (VNĐ)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="pointer-events-none">
              <TableHead className="text-black dark:text-black">
                {" "}
                {renderSpecialty(selectedAppointment?.specialization + "") ||
                  renderSpecialty(inputSpecialization + "")}
              </TableHead>
              <TableHead className="text-black dark:text-black">
                {" "}
                {serviceName[parseInt(selectedService)]}
              </TableHead>
              <TableHead className="text-black dark:text-black">
                {inputSpecialization
                  ? renderPriceBySpeAndService(
                      inputSpecialization + "",
                      parseInt(selectedService)
                    ).toLocaleString("vi-VN")
                  : renderPriceBySpeAndService(
                      selectedAppointment?.specialization + "",
                      parseInt(selectedService)
                    ).toLocaleString("vi-VN")}
              </TableHead>
              <TableHead className="text-black dark:text-black">
                Không
              </TableHead>
              <TableHead className="text-black dark:text-black">
                {inputSpecialization
                  ? renderPriceBySpeAndService(
                      inputSpecialization + "",
                      parseInt(selectedService)
                    ).toLocaleString("vi-VN")
                  : renderPriceBySpeAndService(
                      selectedAppointment?.specialization + "",
                      parseInt(selectedService)
                    ).toLocaleString("vi-VN")}
              </TableHead>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

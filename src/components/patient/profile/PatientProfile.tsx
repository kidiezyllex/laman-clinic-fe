import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  UserIcon,
  Trash2Icon,
  PencilIcon,
  Dog,
  Cat,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import PatientProfileForm from "./PatientProfileForm";
import { usePathname } from "next/navigation";
interface MedicalHistory {
  disease: string;
  diagnosisDate: Date;
  treatment: string;
  _id: string;
}
interface Patient {
  _id: string;
  numberId?: string;
  fullName?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
  medicalHistory?: MedicalHistory[];
}

export default function PatientProfile() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const pathname = usePathname();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return format(new Date(date), "dd/MM/yyyy");
  };

  useEffect(() => {
    const fetchPatientByAccountId = async () => {
      try {
        setLoading(true);
        if (!pathname.split("_").includes("/user")) {
          const currentEmail = localStorage.getItem("currentEmail");
          if (!currentEmail) {
            throw new Error("No email found in localStorage");
          }
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/?email=${currentEmail}`
          );
          setPatient(response.data);
        } else {
          setPatient(null);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setError("Failed to fetch patient data");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientByAccountId();
  }, []);

  const handleDelete = async () => {
    try {
      // Implement delete functionality here
      console.log("Delete functionality not implemented");
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
    setIsAlertOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-full">
      <p className="text-base font-semibold text-blue-500">
        {!patient ? "VUI LÒNG TẠO HỒ SƠ" : "HỒ SƠ BỆNH NHÂN"}
      </p>
      {patient && (
        <>
          <div className="flex items-center space-x-4 border rounded-md p-4 ">
            {patient.gender?.toLowerCase() === "male" ? (
              <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-blue-200">
                <Dog className="text-blue-500" />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-pink-200">
                <Cat className="text-pink-500" />
              </div>
            )}
            <div>
              <p className="text-base font-semibold">{patient.fullName}</p>
              <p className="text-slate-500">Mã bệnh nhân: {patient._id}</p>
            </div>
          </div>
          <div className="space-y-4 border rounded-md p-4">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="text-blue-500 h-4 w-4" />
              <span className=" text-base">
                Ngày sinh: {formatDate(patient.dateOfBirth)}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <UserIcon className="text-blue-500 h-4 w-4" />
              <span className=" text-base">
                Giới tính:{" "}
                {patient.gender?.toLowerCase() === "female" ? "Nữ" : "Nam"}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPinIcon className="text-blue-500 h-4 w-4" />
              <span className=" text-base">Địa chỉ: {patient.address}</span>
            </div>
            <div className="flex items-center space-x-3">
              <PhoneIcon className="text-blue-500 h-4 w-4" />
              <span className=" text-base">Số ĐT: {patient.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <MailIcon className="text-blue-500 h-4 w-4" />
              <span className=" text-base">Email: {patient.email}</span>
            </div>
          </div>
          <div className="w-full border rounded-md p-4">
            <h3 className="text-md font-semibold">Lịch sử khám bệnh</h3>
            {(patient as any).medicalHistory.length === 0 ? (
              <p className="text-slate-500 text-sm">
                Chưa có lịch sử khám bệnh
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ngày khám</TableHead>
                    <TableHead>Tiền sử bệnh</TableHead>
                    <TableHead>Chẩn đoán bệnh</TableHead>
                    <TableHead>Kết quả xét nghiệm (nếu có)</TableHead>
                    <TableHead>Điều trị</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(patient as any).medicalHistory.map((history: any) => (
                    <TableRow key={history.diagnosisDate}>
                      <TableCell>
                        {formatDate(history?.diagnosisDate)}
                      </TableCell>
                      <TableCell>{history.disease.split("_")[1]}</TableCell>
                      <TableCell>{history.disease.split("_")[0]}</TableCell>
                      <TableCell>{history.disease.split("_")[2]}</TableCell>
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
          <div className="flex justify-end space-x-4">
            <Button
              variant="destructive"
              className="flex items-center space-x-2"
              onClick={() => setIsAlertOpen(true)}
            >
              <Trash2Icon className="w-4 h-4" />
              <span>Xoá</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center space-x-2 border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              <PencilIcon className="w-4 h-4" />
              <span>Chỉnh sửa</span>
            </Button>
          </div>
        </>
      )}
      {!patient && (
        <PatientProfileForm
          setSearchTerm={() => {}}
          setShowCreatePatientProfile={() => {}}
        />
      )}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xoá?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Điều này sẽ xoá vĩnh viễn dữ
              liệu của bạn khỏi máy chủ của chúng tôi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Xác nhận xoá
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

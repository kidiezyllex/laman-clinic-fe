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
import PatientProfileForm from "./PatientProfileForm";
import { usePathname } from "next/navigation";
import { Patient } from "../../../../lib/entity-types";
import { formatDate } from "../../../../lib/utils";
import UpdateProfileForm from "./UpdateProfileForm";
import { useToast } from "@/hooks/use-toast";

export default function PatientProfile() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const pathname = usePathname();
  const patientId = pathname.split("/")[1];
  const { toast } = useToast();
  const [patient, setPatient] = useState<Patient | null>(null);
  useEffect(() => {
    const fetchPatientByAccountId = async () => {
      try {
        if (!pathname.split("_").includes("/user")) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/${patientId}`
          );
          setPatient(response.data);
        } else {
          setPatient(null);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPatientByAccountId();
  }, [showUpdateForm]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/${patientId}`
      );
      toast({
        variant: "default",
        title: "Thành công!",
        description: "Bạn đã xoá hồ sơ của mình!",
      });
      setPatient(null);
    } catch (error) {
      console.error(error);
    }
    setIsAlertOpen(false);
  };

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
          <div
            className={showUpdateForm ? "hidden" : "flex justify-end space-x-4"}
          >
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
              onClick={() => setShowUpdateForm(true)}
            >
              <PencilIcon className="w-4 h-4" />
              <span>Cập nhật</span>
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
      {showUpdateForm && (
        <UpdateProfileForm setShowUpdateForm={setShowUpdateForm} />
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

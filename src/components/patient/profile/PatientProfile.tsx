import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  UserIcon,
  Trash2Icon,
  PencilIcon,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
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
import { format } from "date-fns";
interface Patient {
  _id: String;
  numberId?: string;
  fullName?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
}
export default function PatientProfile() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { userId } = useAuth();
  // const [patient, setPatient] = useState<Patient>({});
  const [patient, setPatient] = useState<Partial<Patient>>({});

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return format(date, "dd/MM/yyyy");
  };
  useEffect(() => {
    const fetchPatientByAccountId = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/patients/by-account/${userId}`
        );
        console.log(response.data);
        setPatient(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error:", error.response?.data || error.message);
        } else {
          console.error("An unexpected error occurred:", error);
        }
      }
    };

    if (userId) {
      fetchPatientByAccountId();
    } else {
      console.log("userId is not defined");
    }
  }, [userId]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/patients/${patient._id}`
      );
      setPatient(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
    setIsAlertOpen(false);
  };

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[90%]">
      <p className="text-base font-semibold text-blue-500">HỒ SƠ BỆNH NHÂN</p>
      {Object.keys(patient).length !== 0 && (
        <div className="flex items-center space-x-4 border rounded-md p-4 ">
          <Avatar className="w-14 h-14 border-white">
            <AvatarFallback className="text-base font-semibold bg-secondary"></AvatarFallback>
          </Avatar>
          <div>
            <p className="text-base font-semibold">{patient.fullName}</p>
            <p className="text-slate-500">ID: {patient.numberId}</p>
          </div>
        </div>
      )}
      {Object.keys(patient).length !== 0 && (
        <CardContent className="mt-6 space-y-4">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="text-blue-500 h-4 w-4" />
            <span className="text-slate-600 text-base">
              Ngày sinh: {formatDate(patient.dateOfBirth)}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <UserIcon className="text-blue-500 h-4 w-4" />
            <span className="text-slate-600 text-base">
              Gender: {patient.gender}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPinIcon className="text-blue-500 h-4 w-4" />
            <span className="text-slate-600 text-base">
              Address: {patient.address}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <PhoneIcon className="text-blue-500 h-4 w-4" />
            <span className="text-slate-600 text-base">
              Phone: {patient.phone}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <MailIcon className="text-blue-500 h-4 w-4" />
            <span className="text-slate-600 text-base">
              Email: {patient.email}
            </span>
          </div>
        </CardContent>
      )}
      {Object.keys(patient).length !== 0 && (
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

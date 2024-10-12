import { CardContent } from "@/components/ui/card";
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
import { usePathname } from "next/navigation";
interface Receptionist {
  _id: String;
  numberId?: string;
  fullName?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
}
export default function ReceptionistProfile() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const userId = usePathname().split("/")[1];
  const [receptionist, setReceptionist] = useState<Partial<Receptionist>>({});

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return format(date, "dd/MM/yyyy");
  };
  useEffect(() => {
    const fetchPatientByAccountId = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/${userId}`
      );
      setReceptionist(response.data);
    };

    if (userId) {
      fetchPatientByAccountId();
    } else {
      console.log("userId is not defined");
    }
  }, [userId]);

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[90%]">
      <p className="text-base font-semibold text-blue-500">HỒ SƠ LỄ TÂN</p>
      {Object.keys(receptionist).length !== 0 && (
        <div className="flex items-center space-x-4 border rounded-md p-4 ">
          <Avatar className="w-14 h-14 border-white">
            <AvatarFallback className="text-base font-semibold bg-secondary"></AvatarFallback>
          </Avatar>
          <div>
            <p className="text-base font-semibold">{receptionist.fullName}</p>
            <p className="text-slate-500">ID: {receptionist.numberId}</p>
          </div>
        </div>
      )}
      {Object.keys(receptionist).length !== 0 && (
        <CardContent className="mt-6 space-y-4">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="text-blue-500 h-4 w-4" />
            <span className="text-slate-600 text-base">
              Ngày sinh: {formatDate(receptionist.dateOfBirth)}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <UserIcon className="text-blue-500 h-4 w-4" />
            <span className="text-slate-600 text-base">
              Gender: {receptionist.gender}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPinIcon className="text-blue-500 h-4 w-4" />
            <span className="text-slate-600 text-base">
              Address: {receptionist.address}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <PhoneIcon className="text-blue-500 h-4 w-4" />
            <span className="text-slate-600 text-base">
              Phone: {receptionist.phone}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <MailIcon className="text-blue-500 h-4 w-4" />
            <span className="text-slate-600 text-base">
              Email: {receptionist.email}
            </span>
          </div>
        </CardContent>
      )}
      {Object.keys(receptionist).length !== 0 && (
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
            <AlertDialogAction>Xác nhận xoá</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  UserIcon,
  Dog,
  Cat,
  Trash2,
  ArrowUpFromLine,
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
import CreateProfileForm from "./CreateProfileForm";
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
          <div className="flex items-center space-x-4 border rounded-md p-4 bg-primary-foreground border-blue-300 dark:border-secondary">
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
              <p className="text-base font-semibold text-start text-slate-600 dark:text-slate-300">
                {patient.fullName}
              </p>
              <p className="text-slate-600 text-start dark:text-slate-300">
                Mã bệnh nhân: {patient._id}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 border rounded-md p-4 bg-primary-foreground border-blue-300 dark:border-secondary">
            <div className="flex items-center space-x-2 ">
              <CalendarIcon className="text-blue-500 h-4 w-4" />
              <p className="text-sm font-medium text-start text-slate-600 dark:text-slate-300">
                Ngày sinh:
              </p>
              <p className="text-sm text-slate-600 text-start dark:text-slate-300">
                {formatDate(patient.dateOfBirth)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <UserIcon className="text-blue-500 h-4 w-4" />
              <p className="text-sm font-medium text-start text-slate-600 dark:text-slate-300">
                Giới tính:
              </p>
              <p className="text-sm text-slate-600 text-start dark:text-slate-300">
                {patient.gender?.toLowerCase() === "female" ? "Nữ" : "Nam"}
              </p>
            </div>
            <div className="flex items-center space-x-2 ">
              <MapPinIcon className="text-blue-500 h-4 w-4 " />
              <p className="text-sm font-medium text-start text-slate-600 dark:text-slate-300">
                Địa chỉ:
              </p>
              <p className="text-sm text-slate-600 text-start dark:text-slate-300">
                {patient.address}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <PhoneIcon className="text-blue-500 h-4 w-4" />
              <p className="text-sm font-medium text-start text-slate-600 dark:text-slate-300">
                Số ĐT:
              </p>
              <p className="text-sm text-slate-600 text-start dark:text-slate-300">
                {patient.phone}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <MailIcon className="text-blue-500 h-4 w-4" />
              <p className="text-sm font-medium text-start text-slate-600 dark:text-slate-300">
                Email:
              </p>
              <p className="text-sm text-slate-600 text-start dark:text-slate-300">
                {patient.email}
              </p>
            </div>
          </div>
          <div
            className={
              showUpdateForm
                ? "hidden"
                : "flex flex-row justify-end gap-4 items-end"
            }
          >
            <Button variant="destructive" onClick={() => setIsAlertOpen(true)}>
              Xoá
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="flex items-center space-x-2 hover:text-white text-white bg-blue-500 hover:bg-blue-600 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
              onClick={() => setShowUpdateForm(true)}
            >
              Cập nhật
              <ArrowUpFromLine className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}
      {!patient && (
        <CreateProfileForm
          setSearchTerm={() => {}}
          setShowCreatePatientProfile={() => {}}
        />
      )}
      {showUpdateForm && (
        <UpdateProfileForm setShowUpdateForm={setShowUpdateForm} />
      )}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="dark:bg-primary-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-slate-300 text-slate-600">
              Bạn có chắc chắn muốn xoá?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Điều này sẽ xoá vĩnh viễn dữ
              liệu của bạn khỏi máy chủ của chúng tôi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-none bg-red-500 dark:bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600 hover:text-white">
              Huỷ
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="border-none bg-blue-500 dark:bg-blue-500 text-white dark:text-white hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white"
            >
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

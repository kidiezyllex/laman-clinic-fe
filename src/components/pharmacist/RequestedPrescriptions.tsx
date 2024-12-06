import { useState, useEffect } from "react";
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
  ChevronUp,
  CircleCheckBig,
  Edit,
  Eye,
  FlaskConical,
  History,
  Pill,
  RefreshCw,
  RotateCcw,
  SearchIcon,
  Stethoscope,
  User,
  X,
} from "lucide-react";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import PrescriptionBill from "../bill/PrescriptionBill";
import { formatDate, formatDate2 } from "../../../lib/utils";
import {
  Medication,
  Patient,
  Prescription,
  Test,
} from "../../../lib/entity-types";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "../ui/badge";
import { usePathname } from "next/navigation";
import PrescriptionDetails from "../doctor/patient-details/PrescriptionDetails";
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
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

export default function RequestedPrescriptions() {
  const userId = usePathname().split("/")[1];
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [customQuantities, setCustomQuantities] = useState<{
    [key: string]: { [key: string]: number };
  }>({});
  const [showCheckboxes, setShowCheckboxes] = useState({
    isShow: false,
    id: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [viewDoctorName, setViewDoctorName] = useState({
    doctorName: "",
    id: "",
  });
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [newMedication, setNewMedication] = useState<{
    [key: string]: Medication[];
  }>({});
  const [showInvoice, setShowInvoice] = useState({ isShow: false, id: "" });
  const [selectedPatientId, setSelectedPatientId] = useState({
    patientId: "",
    id: "",
  });
  const [selectedPatientMedicalHistory, setSelectedPatientMedicalHistory] =
    useState<Patient | undefined>();
  const [filterType, setFilterType] = useState("all");
  const fetchPrescriptions = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/prescriptions`
      );
      setPrescriptions(
        response.data.filter(
          (item: { status: string }) => item.status === "Scheduled"
        )
      );
      setIsLoading(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Thất bại",
        description: error + "",
      });
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchPrescriptions();
  }, [toast]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedPatientId.patientId) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/${selectedPatientId.patientId}`
          );
          setSelectedPatientMedicalHistory(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchData();
  }, [selectedPatientId, toast]);

  const filteredPrescriptions = prescriptions
    .filter((prescription) => {
      const searchTermLower = searchTerm.toLowerCase();
      if (filterType === "today")
        return formatDate(prescription.dateIssued) === formatDate(new Date());
      return prescription?.patientId?.toLowerCase()?.includes(searchTermLower);
    })
    .sort((a, b) => {
      if (filterType === "old") {
        return (
          new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime()
        );
      } else if (filterType === "new") {
        return (
          new Date(a.dateIssued).getTime() - new Date(b.dateIssued).getTime()
        );
      }
      return 0;
    });

  // Hoàn thành đơn thuốc
  const handleCompletePrescription = async (
    prescriptionId: string,
    prescriptionMedications: any
  ) => {
    try {
      const finalMedications = newMedication[prescriptionId]
        ? newMedication[prescriptionId]
        : prescriptionMedications;
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/prescriptions/${prescriptionId}`,
        {
          status: "Completed",
          dateIssued: new Date(),
          medications: finalMedications,
          pharmacistId: userId,
        }
      );
      finalMedications.forEach(async (item: any) => {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/medications/${item._id}`,
          {
            quantityRemaining:
              item.quantityRemaining - item.quantity > 0
                ? item.quantityRemaining - item.quantity
                : 0,
          }
        );
      });
      toast({
        variant: "default",
        title: "Thành công!",
        description: "Hoàn thành đơn thuốc!",
      });
      setPrescriptions((prevPrescriptions) =>
        prevPrescriptions.filter((p) => p._id !== prescriptionId)
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Thất bại!",
        description: "Lỗi khi hoàn thành đơn thuốc. Vui lòng thử lại.",
      });
    }
  };

  const handleViewDoctorName = async (doctorId: string, id: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/${doctorId}`
      );
      setViewDoctorName({ doctorName: response.data.fullName, id: id });
    } catch (error) {
      console.error("Error fetching doctor name:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch doctor name. Please try again.",
      });
    }
  };

  const handleQuantityChange = (
    prescriptionId: string,
    medicationName: string,
    quantity: number
  ) => {
    setCustomQuantities((prev) => ({
      ...prev,
      [prescriptionId]: {
        ...(prev[prescriptionId] || {}),
        [medicationName]: quantity,
      },
    }));

    setNewMedication((prev) => {
      const updatedMedications = { ...prev };
      if (!updatedMedications[prescriptionId]) {
        updatedMedications[prescriptionId] = [];
      }

      const medicationIndex = updatedMedications[prescriptionId].findIndex(
        (med) => med.medicationName === medicationName
      );

      if (medicationIndex !== -1) {
        if (quantity > 0) {
          updatedMedications[prescriptionId][medicationIndex] = {
            ...updatedMedications[prescriptionId][medicationIndex],
            quantity,
          };
        } else {
          updatedMedications[prescriptionId].splice(medicationIndex, 1);
        }
      } else if (quantity > 0) {
        const medication = prescriptions
          .find((p) => p._id === prescriptionId)
          ?.medications.find((m) => m.medicationName === medicationName);

        if (medication) {
          updatedMedications[prescriptionId].push({ ...medication, quantity });
        }
      }

      return updatedMedications;
    });
  };

  const handleCustomizeToggle = (prescriptionId: string) => {
    setShowCheckboxes((prev) => ({
      isShow: prev.id === prescriptionId ? !prev.isShow : true,
      id: prescriptionId,
    }));

    setCustomQuantities((prev) => {
      const updatedQuantities = { ...prev };
      if (!updatedQuantities[prescriptionId]) {
        const prescription = prescriptions.find(
          (p) => p._id === prescriptionId
        );
        if (prescription) {
          updatedQuantities[prescriptionId] = prescription.medications.reduce<{
            [key: string]: number;
          }>((acc, med) => {
            acc[med.medicationName] = med.quantity;
            return acc;
          }, {});
        }
      }
      return updatedQuantities;
    });

    setNewMedication((prev) => ({
      ...prev,
      [prescriptionId]: [],
    }));
  };
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [selectedTestIndex, setSelectedTestIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPresIndex, setSelectedPresIndex] = useState(-1);
  const handleViewPrescriptionDetails = async (appointmentId: string) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/prescriptions/?appointmentId=${appointmentId}`
    );
    setSelectedPrescription(res.data);
  };

  const handleViewTestDetails = async (appointmentId: string) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/tests/?appointmentId=${appointmentId}`
    );
    setSelectedTest(res.data);
  };
  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%]">
      <p className="text-base font-semibold text-blue-500">
        DÀNH CHO BỆNH NHÂN ĐÃ KHÁM TẠI PHÒNG KHÁM VÀ CÓ TOA THUỐC CỦA BÁC SĨ
      </p>
      <div className="flex flex-row gap-3">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Nhập mã bệnh nhân (BN-XXXXXX). Ví dụ: BN-JCXX2B"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo ngày" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="today">Hôm nay</SelectItem>
            <SelectItem value="new">Gần nhất</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchPrescriptions}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-1">
        {filteredPrescriptions.map((prescription) => (
          <Card key={prescription._id} className="mb-6">
            <div className="flex flex-row items-center gap-3 justify-between p-4 bg-secondary rounded-t-md font-semibold text-slate-600 dark:text-slate-300">
              <p className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                Ngày giờ yêu cầu: {formatDate2(prescription.dateIssued)}
              </p>
              <p className="flex items-center text-sm">
                <Stethoscope className="h-4 w-4 mr-2" />
                BS yêu cầu:{" "}
                <Badge
                  variant={"default"}
                  className="ml-2 cursor-pointer bg-slate-700 dark:bg-slate-300"
                  onClick={() =>
                    handleViewDoctorName(
                      prescription.doctorId,
                      prescription._id
                    )
                  }
                >
                  {viewDoctorName.id === prescription._id &&
                  viewDoctorName.doctorName !== ""
                    ? viewDoctorName.doctorName
                    : "Xem tên BS"}
                </Badge>
              </p>
              <p className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2" />
                Mã Bệnh nhân: {prescription.patientId}
              </p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  {showCheckboxes.isShow &&
                    showCheckboxes.id === prescription._id && (
                      <TableHead className="w-[50px]">Chọn</TableHead>
                    )}
                  <TableHead>Tên thuốc</TableHead>
                  <TableHead>Liều lượng</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Đơn giá (VNĐ)</TableHead>
                  <TableHead>Cách dùng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-slate-600 dark:text-slate-300">
                {prescription.medications.map((medication, index) => (
                  <TableRow key={`${medication.medicationName}-${index}`}>
                    {showCheckboxes.isShow &&
                      showCheckboxes.id === prescription._id && (
                        <TableCell>
                          <Checkbox
                            checked={newMedication[prescription._id]?.some(
                              (med) =>
                                med.medicationName === medication.medicationName
                            )}
                            onCheckedChange={(checked) =>
                              handleQuantityChange(
                                prescription._id,
                                medication.medicationName,
                                checked ? medication.quantity : 0
                              )
                            }
                          />
                        </TableCell>
                      )}
                    <TableCell>{medication.medicationName}</TableCell>
                    <TableCell>{medication.dosage}</TableCell>
                    <TableCell>
                      {showCheckboxes.isShow &&
                      showCheckboxes.id === prescription._id ? (
                        <Input
                          type="number"
                          value={
                            customQuantities[prescription._id]?.[
                              medication.medicationName
                            ] || 0
                          }
                          onChange={(e) =>
                            handleQuantityChange(
                              prescription._id,
                              medication.medicationName,
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-20"
                        />
                      ) : (
                        medication.quantity
                      )}
                    </TableCell>
                    <TableCell>{medication.price}</TableCell>
                    <TableCell className="w-[35%]">
                      {medication.instructions}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex flex-row gap-3 p-4 justify-end">
              <Button
                onClick={() =>
                  setSelectedPatientId({
                    patientId: prescription.patientId + "",
                    id: prescription._id,
                  })
                }
                variant="outline"
                className={
                  showCheckboxes.id === prescription._id &&
                  showCheckboxes.isShow
                    ? "hidden"
                    : "bg-secondary text-slate-600 dark:text-slate-300"
                }
              >
                Lịch sử bệnh lý
                <History className="h-4 w-4 ml-2" />
              </Button>

              {showCheckboxes.id === prescription._id &&
              showCheckboxes.isShow ? (
                <Button
                  variant={"destructive"}
                  onClick={() => {
                    setShowCheckboxes({ isShow: false, id: "" });
                    setShowInvoice({ isShow: false, id: "" });
                  }}
                >
                  Huỷ tuỳ chỉnh
                  <X className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="bg-secondary text-slate-600 dark:text-slate-300"
                  onClick={() => handleCustomizeToggle(prescription._id)}
                >
                  Tuỳ chỉnh đơn
                  <Edit className="h-4 w-4 ml-2" />
                </Button>
              )}
              <Button
                className="w-fit flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                onClick={() => setIsAlertOpen(true)}
              >
                Hoàn thành đơn
                <CircleCheckBig className="h-4 w-4 ml-2" />
              </Button>
              <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent className="dark:bg-primary-foreground">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="dark:text-slate-300 text-slate-600">
                      Xác nhận hoàn thành đơn thuốc!
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Đơn thuốc được yêu cầu sẽ được cập nhật trong cơ sở dữ
                      liệu với trạng thái hoàn thành.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-none bg-red-500 dark:bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600 hover:text-white">
                      Huỷ
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        handleCompletePrescription(
                          prescription._id,
                          prescription.medications
                        )
                      }
                      className="border-none bg-blue-500 dark:bg-blue-500 text-white dark:text-white hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white"
                    >
                      Xác nhận
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {showInvoice.id === prescription._id && showInvoice.isShow && (
              <PrescriptionBill
                prescription={prescription}
                newMedication={newMedication[prescription._id] || []}
              />
            )}

            {selectedPatientId.id === prescription._id &&
              (selectedPatientMedicalHistory?.medicalHistory?.length === 0 ? (
                <p className="text-slate-500 text-sm p-4">
                  Chưa có lịch sử khám bệnh
                </p>
              ) : (
                <div>
                  <div className="flex flex-row justify-between w-full p-4 border-t border-b bg-primary-foreground">
                    <p className="text-sm font-semibold">
                      Tên bệnh nhân: {selectedPatientMedicalHistory?.fullName}
                    </p>
                    <p className="text-sm font-semibold">
                      Giới tính:{" "}
                      {selectedPatientMedicalHistory?.gender?.toLowerCase() ===
                      "male"
                        ? "Nam"
                        : "Nữ"}
                    </p>
                    <p className="text-sm font-semibold">
                      Số ĐT: {selectedPatientMedicalHistory?.phone}
                    </p>
                  </div>
                  <Table className="border bg-background pointer-events-none">
                    <TableHeader>
                      <TableRow>
                        <TableHead>STT</TableHead>
                        <TableHead>Ngày giờ khám</TableHead>
                        <TableHead>Tiền sử bệnh</TableHead>
                        <TableHead>Chẩn đoán bệnh</TableHead>
                        <TableHead>Phương pháp điều trị</TableHead>
                        <TableHead>Đơn thuốc</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedPatientMedicalHistory?.medicalHistory?.map(
                        (history: any, index) => (
                          <TableRow key={history.diagnosisDate}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              {formatDate2(history?.diagnosisDate)}
                            </TableCell>
                            <TableCell>
                              {history.disease.split("_")[0]}
                            </TableCell>
                            <TableCell>
                              {history.disease.split("_")[1]}
                            </TableCell>
                            <TableCell>
                              {history.treatment.split("_")[0] +
                                history.treatment.split("_")[1]}
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() => {
                                  setSelectedPresIndex(index);
                                  handleViewPrescriptionDetails(
                                    history?.appointmentId
                                  );
                                  setIsOpen(true);
                                }}
                                variant="secondary"
                                className={
                                  index === selectedPresIndex
                                    ? "w-fit flex items-center space-x-2 bg-blue-500 hover:text-white hover:bg-blue-600 text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                                    : "border border-slate-00 dark:border-none pointer-events-auto"
                                }
                              >
                                Chi tiết
                                <Pill className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTitle></DialogTitle>
                    <DialogContent className="max-w-[900px] w-[90%] h-[90%] overflow-y-auto">
                      {selectedPrescription && (
                        <PrescriptionDetails
                          selectedPrescription={selectedPrescription}
                        ></PrescriptionDetails>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
          </Card>
        ))}
      </div>
    </div>
  );
}

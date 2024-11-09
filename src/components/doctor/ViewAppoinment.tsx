"use client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  format,
  addDays,
  startOfWeek,
  isSameDay,
  parseISO,
  subMonths,
  addMonths,
} from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Form, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Cat,
  ChevronLeft,
  ChevronRight,
  Dog,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { labTestsData, medicationData } from "../../../lib/hardcoded-data";
import { usePathname } from "next/navigation";
import { formatDate } from "../../../lib/utils";
import { Appointment, MedicationRow } from "../../../lib/entity-types";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";

const medicationSchema = z.object({
  medicationName: z.string().min(1, "Vui lòng chọn thuốc"),
  dose: z.string().min(1, "Liều lượng không được để trống"),
  quantity: z.coerce.number().min(1, "Số lượng phải lớn hơn 0"),
  instructions: z.string().optional(),
});

const formSchema = z.object({
  medications: z.array(medicationSchema),
});
export default function ViewAppointment({
  roomNumber,
}: {
  roomNumber: string;
}) {
  const { toast } = useToast();
  const pathname = usePathname();
  const doctorId = pathname.split("/")[1];
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medications: [
        {
          medicationName: "",
          dose: "",
          quantity: 0,
          instructions: "",
        },
      ],
    },
  });
  // state
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showLabTestsForm, setShowLabTestsForm] = useState(false);
  const [mainShow, setMainShow] = useState(true);
  const [showDiagnosticResultsForm, setShowDiagnosticResultsForm] =
    useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [rows, setRows] = useState<MedicationRow[]>([
    {
      id: 1,
      medicationName: "",
      dose: "",
      quantity: 0,
      instructions: "",
      price: 0,
    },
  ]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTests, setSelectedTests] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [reasonRequestTest, setReasonRequestTest] = useState("");
  const [testType, setTestType] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    medicalHistory: "",
    diagnosis: "",
    testResults: "",
    treatment: "",
    otherTreatment: "",
  });

  // Toggle Form tạo đơn thuốc
  const handleCanclePrescription = () => {
    setRows([
      {
        id: 1,
        medicationName: "",
        dose: "",
        quantity: 0,
        instructions: "",
        price: 0,
      },
    ]);
    setShowPrescriptionForm(!showPrescriptionForm);
    setMainShow(true);
  };
  // Thêm 1 row
  const addRow = () => {
    const newRow: MedicationRow = {
      id: rows.length + 1,
      medicationName: "",
      dose: "",
      quantity: 0,
      price: 0,
      instructions: "",
    };
    setRows([...rows, newRow]);
  };
  // Cập nhật row
  const updateRow = (
    id: number,
    field: keyof MedicationRow,
    value: string | number
  ) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };
  const handlePreviousWeek = () => setCurrentDate(addDays(currentDate, -7));
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));

  // Fill value trên các row
  const handleSelectMedicationName = (value: string, rowId: number) => {
    const findMedication = medicationData.find(
      (item) => item.medicationName === value
    );
    setRows(
      rows.map((row) =>
        row.id === rowId ? { ...row, ...findMedication } : row
      )
    );
  };

  // Chi tiết lịch hẹn
  const openAppointmentDetails = (appointment: Appointment) => {
    console.log(appointment);
    setSelectedAppointment(appointment);
    setIsOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      treatment: value,
    }));
  };

  useEffect(() => {
    const selectedTestNames = labTestsData
      .filter((test) => selectedTests.includes(test.id))
      .map((test) => test.name);
    setTestType(selectedTestNames);
  }, [selectedTests]);

  const filteredTests = labTestsData.filter((test) =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTestToggle = (testId: number) => {
    setSelectedTests((prev) =>
      prev.includes(testId)
        ? prev.filter((id) => id !== testId)
        : [...prev, testId]
    );
  };
  // Fecth Data
  useEffect(() => {
    const fetchAppointments = async () => {
      if (roomNumber !== "") {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/${roomNumber}`
        );
        setAppointments(response.data);
      } else {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/appointments`
        );
        setAppointments(response.data);
      }
      // Dùng khi test
    };

    fetchAppointments();
    setIsOpen2(false);
  }, []);

  // Yêu cầu xét nghiệm
  const handleRequestTest = async () => {
    try {
      setIsLoading(true);
      // Lấy data bác sĩ
      const response2 = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/${doctorId}`
      );
      const doctorData = response2.data[0];
      const payload = {
        patientId: selectedAppointment?.patientId,
        doctorId: doctorData._id,
        testType: testType,
        reason: reasonRequestTest,
      };
      // const response3 = await axios.post(
      //   `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/create-prescription`,
      //   payload
      // );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Hoàn thành khám
  const handleCreateDiagnosticResults = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      // Lấy thông tin medicalHistory trước đó
      const response2 = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/${selectedAppointment?.patientId}`
      );
      const payload = {
        medicalHistory: [
          ...response2.data?.medicalHistory,
          {
            diagnosisDescription:
              formData.diagnosis +
              "_" +
              formData.medicalHistory +
              "_" +
              formData.testResults,
            diagnosisDate: new Date(),
            treatment: formData.treatment + "_" + formData.otherTreatment,
          },
        ],
      };
      // Cập nhật thông tin khám bệnh
      const response3 = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/${selectedAppointment?.patientId}`,
        payload
      );

      // Xoá khỏi Kafka
      const response4 = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/complete`,
        {
          roomNumber: roomNumber,
          patientId: selectedAppointment?.patientId,
          doctorId: doctorId,
        }
      );
      toast({
        variant: "default",
        title: "Thành công!",
        description: "Đã lưu thông tin khám bệnh/chẩn đoán bệnh",
      });
    } catch (error) {
      console.error("Error during sign in:", error);
      toast({
        variant: "destructive",
        title: "Thất bại!",
        description: error + "",
      });
    } finally {
      setIsLoading(false);
      setShowDiagnosticResultsForm(false);
      setIsOpen(false);
      setFormData({
        medicalHistory: "",
        diagnosis: "",
        testResults: "",
        treatment: "",
        otherTreatment: "",
      });
    }
  };

  // Tạo đơn thuốc
  const handleCreatePrescription = async () => {
    try {
      setIsLoading(true);
      const payload = {
        patientId: selectedAppointment?.patientId,
        doctorId: doctorId,
        medications: rows,
        dateIssued: new Date(),
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/create-prescription`,
        payload
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%]">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <Select
            value={format(currentDate, "MMMM yyyy")}
            onValueChange={(value) => setCurrentDate(new Date(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value={format(subMonths(currentDate, 1), "MMMM yyyy")}
              >
                {format(subMonths(currentDate, 1), "MMMM yyyy")}
              </SelectItem>
              <SelectItem value={format(currentDate, "MMMM yyyy")}>
                {format(currentDate, "MMMM yyyy")}
              </SelectItem>
              <SelectItem
                value={format(addMonths(currentDate, 1), "MMMM yyyy")}
              >
                {format(addMonths(currentDate, 1), "MMMM yyyy")}
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="flex space-x-1">
            <Button
              variant={"outline"}
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Hôm nay
            </Button>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hiển thị bệnh nhân chờ khám trên lịch */}
      <div className="border rounded-md h-full ">
        <div className="inline-block min-w-full h-full">
          <div className="w-full grid grid-cols-7 h-full">
            {days.map((day, index) => (
              <div key={index} className="flex flex-col gap-2 border-r-2">
                <div className="flex flex-row gap-2 items-center justify-center h-20 border-b-2">
                  <div className="font-semibold">{format(day, "EEE")}</div>
                  <div
                    className={`w-8 h-6 flex justify-center items-center rounded-md ${
                      isSameDay(day, new Date())
                        ? "bg-blue-500 text-white"
                        : "text-foreground"
                    }`}
                  >
                    <p className="text-sm">{format(day, "d")}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 p-2 ">
                  {appointments
                    .filter((appointment) =>
                      isSameDay(
                        parseISO((appointment as any).appointmentDate),
                        day
                      )
                    )
                    .map((appointment) => (
                      <div
                        key={(appointment as any).patientId}
                        className="rounded-sm border p-2 flex flex-col gap-2 items-center bg-secondary cursor-pointer"
                        onClick={() => openAppointmentDetails(appointment)}
                      >
                        {appointment.patientId.gender === "nam" ? (
                          <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-blue-200">
                            <Dog className="text-blue-500" />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-pink-200">
                            <Cat className="text-pink-500" />
                          </div>
                        )}
                        <p className="text-xs font-semibold text-center">
                          {appointment.patientId.fullName}
                        </p>
                        <p className="text-xs font-semibold text-center text-slate-500">
                          Lý do: {appointment.reason}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dialog chi tiết bệnh nhân */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[900px] w-[90%] h-[90%] overflow-y-auto">
          {selectedAppointment && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-4 border rounded-md p-4 mr-4">
                {selectedAppointment?.patientId?.gender?.toLowerCase() ===
                "male" ? (
                  <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-blue-200 border-2 border-blue-500">
                    <Dog className="text-blue-500" />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-pink-200 border-2 border-pink-500">
                    <Cat className="text-pink-500" />
                  </div>
                )}
                <div>
                  <p className="text-base font-semibold ">
                    {selectedAppointment?.patientId?.gender?.toLowerCase() ===
                    "nam" ? (
                      <p className="text-blue-500">
                        {selectedAppointment?.patientId?.fullName}
                      </p>
                    ) : (
                      <p className="text-pink-500">
                        {selectedAppointment?.patientId?.fullName}
                      </p>
                    )}
                  </p>
                  <p className="text-slate-500">
                    Mã bệnh nhân: {selectedAppointment?.patientId?._id}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 border rounded-md p-4 mr-4">
                <div className="flex flex-col gap-3">
                  <h3 className="text-md font-semibold">Thông tin bệnh nhân</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Ngày sinh:{" "}
                      {formatDate(selectedAppointment?.patientId?.dateOfBirth)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Giới tính:{" "}
                      {selectedAppointment?.patientId?.gender?.toLowerCase() ===
                      "female"
                        ? "Nữ"
                        : "Nam"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Địa chỉ: {selectedAppointment.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Số ĐT: {selectedAppointment?.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Email: {selectedAppointment?.email}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-md font-semibold">
                    Thông tin lịch hẹn đăng ký
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Ngày hẹn khám:{" "}
                      {formatDate(
                        new Date((selectedAppointment as any)?.appointmentDate)
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Trạng thái: Đang chờ khám</span>
                  </div>
                </div>
              </div>
              <div className="border rounded-md p-4 mr-4">
                <div className="flex flex-col gap-1 w-full">
                  <h3 className="text-md font-semibold">Lịch sử khám bệnh</h3>
                  {selectedAppointment?.patientId?.medicalHistory?.length ===
                  0 ? (
                    <p className="text-slate-500 text-sm">
                      Chưa có lịch sử khám bệnh
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>STT</TableHead>
                          <TableHead>Ngày khám</TableHead>
                          <TableHead>Chẩn đoán bệnh</TableHead>
                          <TableHead>Phương pháp điều trị</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedAppointment?.patientId?.medicalHistory?.map(
                          (history: any, index) => (
                            <TableRow key={history.diagnosisDate}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                {formatDate(history?.diagnosisDate)}
                              </TableCell>
                              <TableCell>{history.disease}</TableCell>
                              <TableCell>{history.treatment}</TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
              {showPrescriptionForm && (
                <div className="flex flex-col gap-4 h-full mr-4 border rounded-md p-4 bg-primary-foreground">
                  <h3 className="text-md font-semibold self-center">
                    Tạo đơn thuốc
                  </h3>
                  <Form {...form}>
                    <form className="space-y-2">
                      <div className="grid grid-cols-5 gap-4 font-medium border p-3 rounded-md bg-secondary">
                        <Label className="align-middle text-center">
                          Tên thuốc
                        </Label>
                        <Label className="align-middle text-center">
                          Liều lượng
                        </Label>
                        <Label className="align-middle text-center">
                          Số lượng
                        </Label>
                        <Label className="align-middle text-center">
                          Đơn giá (VNĐ)
                        </Label>
                        <Label className="align-middle text-center">
                          Hướng dẫn
                        </Label>
                      </div>
                      {rows.map((row) => (
                        <div key={row.id} className="grid grid-cols-5 gap-2">
                          <Select
                            onValueChange={(value) => {
                              handleSelectMedicationName(value, row.id);
                            }}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn tên thuốc" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {medicationData.map((medication, index) => (
                                <SelectItem
                                  key={medication.medicationName}
                                  value={medication.medicationName}
                                >
                                  {medication.medicationName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            value={row.dose + ""}
                            onChange={(e) =>
                              updateRow(row.id, "dose", e.target.value)
                            }
                            placeholder="Liều lượng"
                          />
                          <Input
                            type="number"
                            value={row.quantity}
                            onChange={(e) =>
                              updateRow(
                                row.id,
                                "quantity",
                                parseInt(e.target.value)
                              )
                            }
                            placeholder="Số lượng"
                          />
                          <Input
                            value={row.price}
                            onChange={(e) =>
                              updateRow(row.id, "price", e.target.value)
                            }
                            placeholder="Đơn giá"
                          />
                          <Input
                            value={row.instructions + ""}
                            onChange={(e) =>
                              updateRow(row.id, "instructions", e.target.value)
                            }
                            placeholder="Có thể bỏ trống..."
                          />
                        </div>
                      ))}
                    </form>
                  </Form>
                  <div className="flex flex-row gap-4 w-full justify-end items-end flex-grow">
                    <Button type="button" onClick={addRow} variant="outline">
                      Thêm dòng
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleCanclePrescription()}
                    >
                      Huỷ đơn thuốc
                    </Button>
                    <Button
                      onClick={() => handleCreatePrescription()}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        "Tạo đơn thuốc"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {showDiagnosticResultsForm && (
                <div className="flex flex-col gap-4 h-full mr-4 border rounded-md p-4 bg-primary-foreground">
                  <h3 className="text-md font-semibold mr-4 self-center">
                    Nhập kết quả khám bệnh/chẩn đoán bệnh
                  </h3>
                  <Form {...form}>
                    <form
                      onSubmit={handleCreateDiagnosticResults}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="medicalHistory">Tiền sử bệnh</Label>
                        <Textarea
                          id="medicalHistory"
                          name="medicalHistory"
                          value={formData.medicalHistory}
                          onChange={handleChange}
                          placeholder="Nhập tiền sử bệnh của bạn"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="diagnosis">Chẩn đoán bệnh</Label>
                        <Textarea
                          id="diagnosis"
                          name="diagnosis"
                          value={formData.diagnosis}
                          onChange={handleChange}
                          placeholder="Nhập chẩn đoán bệnh"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="testResults">
                          Kết quả xét nghiệm (nếu có)
                        </Label>
                        <Input
                          id="testResults"
                          name="testResults"
                          value={formData.testResults}
                          onChange={handleChange}
                          placeholder="Nhập kết quả xét nghiệm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="treatment">Điều trị</Label>
                        <Select onValueChange={handleSelectChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn phương pháp điều trị" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sử dụng thuốc">
                              Sử dụng thuốc
                            </SelectItem>
                            <SelectItem value="Phẫu thuật">
                              Phẫu thuật
                            </SelectItem>
                            <SelectItem value="Trị liệu">Trị liệu</SelectItem>
                            <SelectItem value="Khác">Khác</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.treatment === "Khác" && (
                        <div className="space-y-2">
                          <Label htmlFor="otherTreatment">
                            Phương pháp điều trị khác
                          </Label>
                          <Input
                            id="otherTreatment"
                            name="otherTreatment"
                            value={formData.otherTreatment}
                            onChange={handleChange}
                            placeholder="Nhập phương pháp điều trị khác"
                          />
                        </div>
                      )}
                      <div className="flex flex-row gap-4 w-full justify-end">
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setShowDiagnosticResultsForm(
                              !showDiagnosticResultsForm
                            );
                            setMainShow(true);
                          }}
                        >
                          Huỷ
                        </Button>
                        <Button
                          type="submit"
                          className="w-fit"
                          variant={"secondary"}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Đang xử lý...
                            </>
                          ) : (
                            "Hoàn thành khám"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}

              {showLabTestsForm && (
                <div className="flex flex-col gap-4 h-full mr-4 border rounded-md p-4 bg-primary-foreground">
                  <h3 className="text-md font-semibold self-center">
                    Tạo xét nghiệm
                  </h3>
                  <div className="">
                    <Input
                      type="search"
                      placeholder="Tìm kiếm nhanh..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full mb-4"
                    />
                    <div className="rounded-md border p-4 grid grid-cols-2 gap-2 mb-4 dark:bg-slate-950 bg-white">
                      {filteredTests.map((test) => (
                        <Label
                          key={test.id}
                          className="flex items-center space-x-2 mb-2 p-2 border rounded-md"
                        >
                          <Checkbox
                            id={`test-${test.id}`}
                            checked={selectedTests.includes(test.id)}
                            onCheckedChange={() => handleTestToggle(test.id)}
                          />
                          <Label className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {test.name}
                          </Label>
                        </Label>
                      ))}
                    </div>
                    <div className="flex flex-col gap-4">
                      <h3 className="text-sm font-semibold">
                        Các xét nghiệm đã chọn:
                      </h3>
                      <div className="flex flex-row flex-wrap gap-4">
                        {testType.map((test, index) => (
                          <Badge variant={"secondary"} key={index}>
                            {test}
                          </Badge>
                        ))}
                      </div>
                      <h3 className="text-sm font-semibold">
                        Nhập lý do xét nghiệm:
                      </h3>
                      <Textarea
                        id="reasonRequestTest"
                        name="reasonRequestTest"
                        value={reasonRequestTest}
                        onChange={(e) => setReasonRequestTest(e.target.value)}
                        placeholder="Nhập lý do xét nghiệm..."
                      />
                    </div>
                  </div>
                  <div className="flex flex-row flex-grow gap-4 w-full justify-end mt-4 items-end">
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setShowLabTestsForm(false);
                        setMainShow(true);
                        setTestType([]);
                        setSelectedTests([]);
                      }}
                    >
                      Huỷ xét nghiệm
                    </Button>
                    <Button
                      onClick={() => handleRequestTest()}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        "Tạo xét nghiệm"
                      )}
                    </Button>
                  </div>
                </div>
              )}
              {mainShow && (
                <div className="flex flex-row gap-4 mr-4 justify-end items-end flex-grow">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowLabTestsForm(!showLabTestsForm);
                      setMainShow(false);
                    }}
                  >
                    Tạo xét nghiệm
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPrescriptionForm(!showPrescriptionForm);
                      setMainShow(false);
                    }}
                  >
                    Tạo đơn thuốc
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowDiagnosticResultsForm(!showDiagnosticResultsForm);
                      setMainShow(false);
                    }}
                  >
                    Hoàn thành khám
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isOpen2} onOpenChange={setIsOpen2}>
        <DialogContent className="max-w-[900px] w-[50%] h-fit">
          <form className="w-2/3 space-y-6">
            {/* <FormField
                control={form.control}
                name="roomNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vui lòng nhập số phòng</FormLabel>
                    <FormControl>
                      <Input placeholder="Ví dụ: 024, 210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            <Button type="submit">Cập nhật</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

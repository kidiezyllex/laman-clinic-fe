"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePathname } from "next/navigation";
import axios from "axios";
import {
  Appointment,
  Medication,
  TestType,
} from "../../../../lib/entity-types";
import {
  CalendarIcon,
  CircleCheckBig,
  ClipboardPlus,
  FlaskConical,
  Pill,
} from "lucide-react";
import PatientInfo from "./PatientInfo";
import PrescriptionForm from "./PrescriptionForm";
import ReExaminationForm from "./ReExaminationForm";
import LabTestsForm from "./LabTestsForm";
import DiagnosticResultsForm from "./DiagnosticResultsForm";

export default function PatientDetails({
  roomNumber,
  isOpen,
  setIsOpen,
  selectedAppointment,
  fetchAppointments,
}: {
  roomNumber: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  fetchAppointments: () => void;
  selectedAppointment: Appointment | null;
}) {
  const { toast } = useToast();
  const pathname = usePathname();
  const doctorId = pathname.split("/")[1];

  // state
  const [tests, setTests] = useState<TestType[]>([]);
  const [services, setServices] = useState([
    { _id: "", serviceName: "", cost: 0 },
  ]);
  const [selectedServices, setSelectedServices] = useState([
    { _id: "", serviceName: "", cost: 0 },
  ]);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showReExaminationForm, setShowReExaminationForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showLabTestsForm, setShowLabTestsForm] = useState(false);
  const [mainShow, setMainShow] = useState(true);
  const [showDiagnosticResultsForm, setShowDiagnosticResultsForm] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTests, setSelectedTests] = useState<String[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<String[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);

  // Toggle Form tạo đơn thuốc
  const handleCancel = () => {
    setSelectedTests([]);
    setSelectedServiceIds([]);
    setSelectedServices([]);
    setShowPrescriptionForm(false);
    setShowServiceForm(false);
    setShowDiagnosticResultsForm(false);
    setShowLabTestsForm(false);
    setShowReExaminationForm(false);
    setMainShow(true);
    setIsLoading(false);
  };

  useEffect(() => {
    const selectedTs = tests.filter((test) => selectedTests.includes(test._id));
    const selectedSv = services.filter((sv) =>
      selectedServiceIds.includes(sv._id)
    );
    setSelectedServices(selectedSv as any);
  }, [selectedTests, selectedServiceIds, tests, services]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/test-types`
      );
      const res2 = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/medications`
      );
      const res3 = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/services`
      );
      setTests(res.data);
      setMedications(res2.data);
      setServices(res3.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchServiceList = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/services-list`
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchServiceList();
  }, [showServiceForm]);

  // Tạo xét nghiệm / Yêu cầu xét nghiệm
  const handleCreateRequestTest = async () => {
    try {
      setIsLoading(true);
      const payload = {
        testTypes: selectedTests,
        patientId: selectedAppointment?.patientId,
        doctorId: doctorId,
        requestDate: new Date(),
        reason: "",
      };
      if (selectedTests.length === 0) {
        toast({
          variant: "destructive",
          title: "Lỗi!",
          description: "Vui lòng chọn ít nhất một xét nghiệm!",
        });
        return;
      } else {
        const res3 = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/create-request-test`,
          payload
        );
        toast({
          variant: "default",
          title: "Thành công!",
          description: "Đã tạo yêu cầu xét nghiệm cho bệnh nhân!",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Thất bại!",
        description: error + "",
      });
    } finally {
      handleCancel();
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
            disease: "",
            diagnosisDate: new Date(),
            treatment: "",
          },
        ],
      };
      // Cập nhật vào MedicalHistory của bệnh nhân
      const response3 = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/${selectedAppointment?.patientId}`,
        payload
      );

      // Tạo 1 Diagnosis mới
      const diagnosisPayload = {
        patientId: selectedAppointment?.patientId,
        doctorId: doctorId,
        disease: "",
        diagnosisDate: new Date(),
        treatment: "",
      };
      const response4 = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/diagnoses`,
        diagnosisPayload
      );

      // Xoá khỏi Kafka
      const res = await axios.post(
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
      toast({
        variant: "destructive",
        title: "Thất bại!",
        description: error + "",
      });
    } finally {
      setIsLoading(false);
      handleCancel();
      setIsOpen(false);
      fetchAppointments();
    }
  };

  // Tạo đơn thuốc
  const handleCreatePrescription = async () => {
    try {
      setIsLoading(true);
      const payload = {
        patientId: selectedAppointment?.patientId,
        doctorId: doctorId,
        medications: [],
        dateIssued: new Date(),
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/prescriptions`,
        payload
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Thất bại!",
        description: error + "",
      });
    } finally {
      toast({
        variant: "default",
        title: "Thành công!",
        description: "Đã tạo đơn thuốc cho bệnh nhân!",
      });
      setIsLoading(false);
      handleCancel();
    }
  };

  // Tạo tái khám
  const handleCreateReExamination = async (
    selectedAppointment: Appointment
  ) => {
    try {
      setIsLoading(true);
      const payload = {
        patientId: selectedAppointment?.patientId + "",
        appointmentDateByPatient: new Date(),
        specialization: selectedAppointment?.specialization,
        fullName: selectedAppointment.fullName,
        dateOfBirth: selectedAppointment.dateOfBirth || new Date(),
        gender: selectedAppointment.gender || "",
        address: selectedAppointment.address,
        phone: selectedAppointment.phone || "",
        email: selectedAppointment.email,
        doctorId: doctorId,
        reason: "",
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/reExamination`,
        payload
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Thất bại!",
        description: error + "",
      });
    } finally {
      toast({
        variant: "default",
        title: "Thành công!",
        description: "Đã tạo tái khám cho bệnh nhân!",
      });
      setIsLoading(false);
      handleCancel();
    }
  };

  // Tạo dịch vụ
  const handleCreateServices = async () => {
    try {
      setIsLoading(true);
      const payload = {
        patientId: selectedAppointment?.patientId,
        doctorId: doctorId,
        services: selectedServices,
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/create-service-list`,
        payload
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Thất bại!",
        description: error + "",
      });
    } finally {
      toast({
        variant: "default",
        title: "Thành công!",
        description: "Đã tạo dịch vụ cho bệnh nhân!",
      });
      handleCancel();
    }
  };

  return (
    <div>
      <Dialog open={isOpen || false} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[900px] w-[90%] h-[90%] overflow-y-auto">
          {selectedAppointment && (
            <div className="flex flex-col gap-4">
              <PatientInfo selectedAppointment={selectedAppointment} />
              {showPrescriptionForm && (
                <PrescriptionForm
                  medications={medications}
                  handleCreatePrescription={handleCreatePrescription}
                  handleCancel={handleCancel}
                  isLoading={isLoading}
                />
              )}
              {showDiagnosticResultsForm && (
                <DiagnosticResultsForm
                  handleCreateDiagnosticResults={handleCreateDiagnosticResults}
                  handleCancel={handleCancel}
                  isLoading={isLoading}
                />
              )}
              {showLabTestsForm && (
                <LabTestsForm
                  tests={tests}
                  handleCreateRequestTest={handleCreateRequestTest}
                  handleCancel={handleCancel}
                  isLoading={isLoading}
                />
              )}
              {showReExaminationForm && (
                <ReExaminationForm
                  handleCreateReExamination={handleCreateReExamination}
                  handleCancel={handleCancel}
                  isLoading={isLoading}
                  selectedAppointment={selectedAppointment}
                />
              )}
              {mainShow && (
                <div className="flex flex-row gap-3 mr-4 justify-end items-end flex-grow">
                  <Button
                    variant="outline"
                    className="bg-secondary text-slate-600 dark:text-slate-300 border border-slate-400"
                    onClick={() => {
                      setShowServiceForm(!showServiceForm);
                      setMainShow(false);
                    }}
                  >
                    Tạo dịch vụ
                    <ClipboardPlus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-secondary text-slate-600 dark:text-slate-300 border border-slate-400"
                    onClick={() => {
                      setShowLabTestsForm(!showLabTestsForm);
                      setMainShow(false);
                    }}
                  >
                    Tạo xét nghiệm
                    <FlaskConical className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-secondary text-slate-600 dark:text-slate-300 border border-slate-400"
                    onClick={() => {
                      setShowReExaminationForm(!showReExaminationForm);
                      setMainShow(false);
                    }}
                  >
                    Tạo tái khám
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-secondary text-slate-600 dark:text-slate-300 border border-slate-400"
                    onClick={() => {
                      setShowPrescriptionForm(!showPrescriptionForm);
                      setMainShow(false);
                    }}
                  >
                    Tạo đơn thuốc
                    <Pill className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-fit flex items-center space-x-2 bg-blue-500 hover:text-white hover:bg-blue-600 text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                    onClick={() => {
                      setShowDiagnosticResultsForm(!showDiagnosticResultsForm);
                      setMainShow(false);
                    }}
                  >
                    Hoàn thành khám
                    <CircleCheckBig className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

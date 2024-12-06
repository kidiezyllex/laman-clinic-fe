"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { usePathname } from "next/navigation";
import axios from "axios";
import {
  Appointment,
  Medication,
  Prescription,
  Test,
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
import TestResults from "./TestResults";

export default function PatientDetails({
  roomNumber,
  isOpen,
  setIsOpen,
  selectedAppointment,
  fetchAppointments,
  createdPresList,
  pendingTestList,
}: {
  roomNumber: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  fetchAppointments: () => void;
  selectedAppointment: Appointment | null;
  createdPresList: String[];
  pendingTestList: String[];
}) {
  const { toast } = useToast();
  const doctorId = usePathname().split("/")[1];

  // state
  const [tests, setTests] = useState<TestType[]>([]);
  const [testResults, setTestResults] = useState<Test | null>(null);
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
  const [selectedServiceIds, setSelectedServiceIds] = useState<String[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);

  const handleCancel = () => {
    setSelectedServiceIds([]);
    setSelectedServices([]);
    setShowPrescriptionForm(false);
    setShowServiceForm(false);
    setShowDiagnosticResultsForm(false);
    setShowLabTestsForm(false);
    setShowReExaminationForm(false);
    setMainShow(true);
    setIsLoading(false);
    fetchAppointments();
  };

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

      const res4 = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/tests/?patientId=${selectedAppointment?.patientId}&doctorId=${doctorId}`
      );
      setTests(res.data);
      setMedications(res2.data);
      setServices(res3.data);
      setTestResults(res4.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [isOpen]);

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

  return (
    <div>
      <Dialog open={isOpen || false} onOpenChange={setIsOpen}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-[1000px] w-[95%] h-[90%] overflow-y-auto">
          {selectedAppointment && (
            <div className="flex flex-col gap-4">
              <PatientInfo selectedAppointment={selectedAppointment} />
              {testResults && (
                <TestResults testResults={testResults}></TestResults>
              )}

              {showPrescriptionForm && (
                <PrescriptionForm
                  medications={medications}
                  setIsLoading={setIsLoading}
                  handleCancel={handleCancel}
                  isLoading={isLoading}
                  selectedAppointment={selectedAppointment}
                />
              )}
              {showDiagnosticResultsForm && (
                <DiagnosticResultsForm
                  handleCancel={handleCancel}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  selectedAppointment={selectedAppointment}
                  roomNumber={roomNumber}
                  fetchAppointments={fetchAppointments}
                  setIsOpen={setIsOpen}
                />
              )}
              {showLabTestsForm && (
                <LabTestsForm
                  selectedAppointment={selectedAppointment}
                  handleCancel={handleCancel}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  tests={tests}
                />
              )}
              {showReExaminationForm && (
                <ReExaminationForm
                  setIsLoading={setIsLoading}
                  handleCancel={handleCancel}
                  isLoading={isLoading}
                  selectedAppointment={selectedAppointment}
                />
              )}
              {mainShow && (
                <div className="flex flex-row gap-3 mr-4 justify-end items-end flex-grow">
                  <Button
                    variant="outline"
                    className={
                      testResults ||
                      pendingTestList.includes(selectedAppointment.patientId)
                        ? "hidden"
                        : "bg-secondary text-slate-600 dark:text-slate-300 border border-slate-400"
                    }
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
                    className={
                      createdPresList.includes(selectedAppointment._id)
                        ? "hidden"
                        : "bg-secondary text-slate-600 dark:text-slate-300 border border-slate-400"
                    }
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

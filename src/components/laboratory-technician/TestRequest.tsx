"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  CalendarIcon,
  Cat,
  CircleHelp,
  Dog,
  FileText,
  FlaskConical,
  Loader2,
  Mail,
  MapPin,
  Phone,
  SearchIcon,
  TestTube,
  TypeIcon,
  User,
  UserCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "../../../lib/utils";
import { AppointmentByPatient } from "../../../lib/entity-types";
import { RequestTest } from "../../../lib/entity-types";
import { reqTestData } from "../../../lib/hardcoded-data";
export default function TestRequest() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [requestTests, setRequestTests] = useState<RequestTest[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequestTest, setSelectedRequestTest] =
    useState<RequestTest | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  // const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredRequestTests = requestTests.filter((requestTest) => {
    const searchTermLower = searchTerm.toLowerCase();
    return requestTest.patientId.toLowerCase().includes(searchTermLower);
  });

  const fetchData = async () => {
    // const response = await axios.get(
    //   `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/requestTest`
    // );
    // setRequestTests(response.data);
    setRequestTests(reqTestData);
  };
  useEffect(() => {
    fetchData();
  }, []);

  // const handleCreateAppointment = (appointment: AppointmentByPatient) => {
  //   setSelectedAppointment(appointment);
  //   setIsDialogOpen(true);
  // };

  // const handleSubmit = async () => {
  //   try {
  //     setIsLoading(true);
  //     const payload = {
  //       patientId: selectedAppointment?.id,
  //       appointmentDate: new Date(),
  //       reason,
  //       specialization: selectedAppointment?.specialization,
  //     };

  //     // Post lịch hẹn khám chính thức
  //     const response = await axios.post(
  //       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/appointments`,
  //       payload
  //     );
  //     if (response.status === 400) {
  //       toast({
  //         variant: "destructive",
  //         title: "Lỗi!",
  //         description: response.data.message,
  //       });
  //     } else if (response.status === 202) {
  //       toast({
  //         variant: "default",
  //         title: "Thành công!",
  //         description: response.data.message,
  //       });

  //       // Xoá khỏi lịch hẹn khám tạm
  //       const response2 = await axios.delete(
  //         `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/appointmentsByPatient/?id=${selectedAppointment?.id}`
  //       );
  //       // Fetch lại data
  //       fetchData();
  //     } else {
  //       toast({
  //         variant: "destructive",
  //         title: "Thất bại!",
  //         description: response.data.message,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error during sign in:", error);
  //   } finally {
  //     setIsLoading(false);
  //     setIsDialogOpen(false);
  //     setIsEditing(false);
  //     setReason("");
  //   }
  // };

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%]">
      <p className="text-base font-semibold text-blue-500">
        DANH SÁCH CÁC XÉT NGHIỆM ĐƯỢC YÊU CẦU
      </p>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="search"
          placeholder="Nhập mã bệnh nhân"
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {filteredRequestTests.map((requestTest) => (
          <Card
            key={(requestTest as any)._id}
            className="flex flex-col gap-6 justify-center items-center p-4"
          >
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-row gap-4 items-center">
                <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center border-2 border-blue-500 ">
                  <User className="text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-base">Mã bệnh nhân</span>
                  <span className="text-sm">{requestTest.patientId}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 items-center">
                  <CircleHelp className="h-4 w-4 text-blue-500"></CircleHelp>
                  <span className="font-semibold text-sm">Lý do:</span>
                </div>
                <span className="text-sm">{requestTest.reason}</span>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <TestTube className="h-4 w-4 text-blue-500"></TestTube>
                <span className="font-semibold text-sm">Loại xét nghiệm:</span>
              </div>
              <div className="flex flex-row flex-wrap gap-2">
                {requestTest.test.map((test, index) => (
                  <Badge variant={"secondary"} key={index}>
                    {test}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-row gap-2">
              <Button
                className="w-fit bg-blue-500 hover:bg-blue-600"
                // onClick={() => handleCreateAppointment(requestTest)}
              >
                <FlaskConical className="mr-2 h-4 w-4" /> Tạo xét nghiệm
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

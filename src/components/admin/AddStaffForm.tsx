"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpFromLine, Loader2 } from "lucide-react";
import {
  renderDayOfWeek,
  renderRole,
  renderSpecialty,
} from "../../../lib/utils";
import { Schedule } from "../../../lib/entity-types";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Họ và tên phải có ít nhất 2 ký tự" }),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, { message: "Số điện thoại không hợp lệ" }),
  birthDay: z.string().min(1, { message: "Vui lòng chọn ngày sinh" }),
  birthMonth: z.string().min(1, { message: "Vui lòng chọn tháng sinh" }),
  birthYear: z.string().min(1, { message: "Vui lòng chọn năm sinh" }),
  gender: z.enum(["Male", "Female"], {
    required_error: "Vui lòng chọn giới tính",
  }),
  password: z.string().min(7, { message: "Password ít nhất 7 kí tự" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  province: z.string().min(1, { message: "Không hợp lệ" }),
  district: z.string().min(1, { message: "Không hợp lệ" }),
});

export default function AddStaffForm({ role }: { role: string }) {
  const [provincesList, setProvincesList] = useState<any[]>([]);
  const [districtsList, setDistrictsList] = useState<any[]>([]);
  const [specializations, setSpecializations] = useState<[]>([]);
  const [specialization, setSpecialization] = useState("");
  const [checked, setChecked] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      birthDay: "",
      birthMonth: "",
      birthYear: "",
      gender: "Male",
      password: "",
      email: "",
      province: "",
      district: "",
    },
  });

  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [currentItem, setCurrentItem] = useState<Schedule>({
    dayOfWeek: "Monday",
    startTime: "07:30",
    endTime: "17:00",
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://provinces.open-api.vn/api/?depth=2"
      );
      const response2 = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/specializations`
      );
      setProvincesList(response.data);
      setSpecializations(response2.data);
    };
    fetchData();
  }, []);

  const handleFetchDistricts = async (provinceName: string) => {
    const provinceCode = parseInt(provinceName?.match(/\d+/)?.[0] || "0");
    const provinceByCode = provincesList.find(
      (item) => item.code === provinceCode
    );
    if (provinceByCode) {
      setDistrictsList(provinceByCode.districts);
    }
  };

  const handleScheduleInputChange = (field: keyof Schedule, value: string) => {
    setCurrentItem((prev: any) => ({ ...prev, [field]: value }));
  };

  const validateTime = (time: string) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
  };

  const addOrUpdateScheduleItem = () => {
    if (
      !validateTime(currentItem.startTime) ||
      !validateTime(currentItem.endTime)
    ) {
      toast({
        title: "Định dạng thời gian không hợp lệ",
        description: "Vui lòng sử dụng định dạng HH:MM",
        variant: "destructive",
      });
      return;
    }

    if (currentItem.startTime >= currentItem.endTime) {
      toast({
        title: "Khoảng thời gian không hợp lệ",
        description: "Thời gian kết thúc phải sau thời gian bắt đầu",
        variant: "destructive",
      });
      return;
    }

    setSchedule((prev) => {
      const index = prev.findIndex(
        (item) => item.dayOfWeek === currentItem.dayOfWeek
      );
      if (index !== -1) {
        const newSchedule = [...prev];
        newSchedule[index] = currentItem;
        return newSchedule;
      }
      return [...prev, currentItem];
    });

    toast({
      title: "Lịch trình đã được cập nhật",
      description: `Lịch trình cho ${renderDayOfWeek(
        currentItem.dayOfWeek
      )} đã được cập nhật`,
    });
  };

  const applyToAllWeekdays = () => {
    const weekdays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const newSchedule = weekdays.map((day) => ({
      ...currentItem,
      dayOfWeek: day,
    }));

    setSchedule((prev) => {
      const weekend = prev.filter((item) => !weekdays.includes(item.dayOfWeek));
      return [...newSchedule, ...weekend];
    });

    toast({
      title: "Lịch trình đã được áp dụng",
      description:
        "Lịch trình hiện tại đã được áp dụng cho tất cả các ngày trong tuần",
    });
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const payload = {
      fullName: data.fullName,
      gender: data.gender,
      password: data.password,
      phone: data.phone.startsWith("0")
        ? "+84" + data.phone.slice(1)
        : data.phone,
      email: data.email,
      medicalHistory: [],
      dateOfBirth: data.birthYear + "-" + data.birthMonth + "-" + data.birthDay,
      address:
        data.district.split("-").slice(1).join("-") +
        "," +
        data.province.split("-").slice(1).join("-"),
      schedule: schedule,
      role: role + "",
      specialization: specialization,
      isDepartmentHead: checked,
    };

    const newUser = {
      fullName: data.fullName,
      gender: data.gender,
      email: data.email,
      password: data.password,
      role: role + "",
      phone: data.phone.startsWith("0")
        ? "+84" + data.phone.slice(1)
        : data.phone,
    };
    try {
      const res1 = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/${role}s`,
        payload
      );
      const res2 = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users`,
        newUser
      );
      toast({
        title: "Thành công!",
        description: `Đã tạo hồ sơ ${renderRole(role)} thành công.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Thất bại!",
        description: error + "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 border rounded-md">
      <h3 className="text-lg font-semibold text-blue-500 mb-4">
        TẠO HỒ SƠ <span className="uppercase">{renderRole(role)}</span>
      </h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập họ và tên" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số điện thoại" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <Label>Ngày sinh</Label>
            <FormDescription>
              (Đối với bệnh nhân từ 3 tuổi trở xuống, vui lòng nhập đầy đủ ngày
              tháng năm sinh)
            </FormDescription>
            <div className="flex space-x-2">
              <FormField
                control={form.control}
                name="birthDay"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[110px]">
                          <SelectValue placeholder="Ngày" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[...Array(31)].map((_, i) => (
                          <SelectItem key={i} value={`${i + 1}`}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthMonth"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[110px]">
                          <SelectValue placeholder="Tháng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[...Array(12)].map((_, i) => (
                          <SelectItem key={i} value={`${i + 1}`}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthYear"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[110px]">
                          <SelectValue placeholder="Năm" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[...Array(100)].map((_, i) => (
                          <SelectItem
                            key={i}
                            value={`${new Date().getFullYear() - i}`}
                          >
                            {new Date().getFullYear() - i}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Giới tính</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Male" id="male" />
                      <Label htmlFor="male">Nam</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Female" id="female" />
                      <Label htmlFor="female">Nữ</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Nhập địa chỉ email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chọn Tỉnh/Thành phố</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleFetchDistricts(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn tỉnh/thành phố" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {provincesList.map((province) => (
                          <SelectItem
                            key={province.code}
                            value={`${province.code}-${province.name}`}
                          >
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chọn Quận/Huyện/Thị xã</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn quận/huyện" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {districtsList.map((district) => (
                          <SelectItem
                            key={district.code}
                            value={`${district.code}-${district.name}`}
                          >
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="mt-8">
            <div>
              <p className="text-sm font-semibold mb-4">Lịch trình làm việc</p>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <Select
                  value={currentItem.dayOfWeek}
                  onValueChange={(value) =>
                    handleScheduleInputChange("dayOfWeek", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn ngày" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => (
                      <SelectItem key={day} value={day}>
                        {renderDayOfWeek(day)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  placeholder="Giờ bắt đầu (HH:MM)"
                  value={currentItem.startTime}
                  onChange={(e) =>
                    handleScheduleInputChange("startTime", e.target.value)
                  }
                />
                <Input
                  type="text"
                  placeholder="Giờ kết thúc (HH:MM)"
                  value={currentItem.endTime}
                  onChange={(e) =>
                    handleScheduleInputChange("endTime", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-row gap-3 mb-4 justify-end w-full">
                <Button
                  variant="outline"
                  type="button"
                  onClick={addOrUpdateScheduleItem}
                >
                  Thêm/Cập nhật
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={applyToAllWeekdays}
                >
                  Áp dụng cho tất cả
                </Button>
              </div>
              {schedule.length !== 0 && (
                <div className="bg-primary-foreground p-4 rounded-md border">
                  <p className="text-sm font-semibold mb-4 text-center">
                    Lịch trình hiện tại
                  </p>

                  <div className="grid grid-cols-3 gap-3">
                    {schedule.map((item, index) => (
                      <Button
                        key={index}
                        variant={"outline"}
                        className="pointer-events-none"
                      >
                        <span>{renderDayOfWeek(item.dayOfWeek)}</span>
                        <span>
                          {item.startTime} - {item.endTime}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {role === "doctor" && (
            <div>
              <p className="text-sm font-semibold mb-4">Chuyên ngành</p>
              <div className="w-full">
                <Select onValueChange={(value) => setSpecialization(value)}>
                  <SelectTrigger className="col-span-7">
                    <SelectValue placeholder="Chọn Chuyên ngành" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map((specialization) => (
                      <SelectItem key={specialization} value={specialization}>
                        {renderSpecialty(specialization)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm font-semibold my-4">
                Trưởng khoa/Bác sĩ (Nếu là Trường khoa, vui lòng check vào ô
                vuông)
              </p>
              <input
                className="h-10 w-10"
                type="checkbox"
                checked={checked}
                onChange={() => {
                  setChecked(!checked);
                }}
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-fit flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {isLoading ? (
              <>
                Đang xử lý
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                Tạo hồ sơ
                <ArrowUpFromLine className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

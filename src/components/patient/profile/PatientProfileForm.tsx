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
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

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
});

export default function PatientProfileForm({
  setSearchTerm,
  setShowCreatePatientProfile,
}: {
  setSearchTerm: (section: string) => void;
  setShowCreatePatientProfile: (section: boolean) => void;
}) {
  const [provincesList, setProvincesList] = useState<any[]>([]);
  const [districtsList, setDistrictsList] = useState<any[]>([]);
  const { userId } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
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
      // province: "",
      // district: "",
    },
  });

  // useEffect(() => {
  //   const fetchProvinces = async () => {
  //     const response = await axios.get(
  //       "https://provinces.open-api.vn/api/?depth=2"
  //     );
  //     setProvincesList(response.data);
  //   };

  //   fetchProvinces();
  // }, []);

  // const handleFetchDistricts = async (provinceName: string) => {
  //   const provinceCode = parseInt(provinceName?.match(/\d+/)?.[0] || "0");
  //   const provinceByCode = provincesList.find(
  //     (item) => item.code === provinceCode
  //   );
  //   if (provinceByCode) {
  //     setDistrictsList(provinceByCode.districts);
  //   }
  // };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const pathName = pathname.split("/");
    const payload = {
      fullName: data.fullName,
      gender: data.gender,
      password: data.password,
      phone: data.phone.startsWith("0")
        ? "+84" + data.phone.slice(1)
        : data.phone,
      email: data.email,
      medicalHistory: [],
      clerkId: pathName[1],
      // dateOfBirth: data.birthYear + "-" + data.birthMonth + "-" + data.birthDay,
      // address:
      //   data.district.split("-").slice(1).join("-") +
      //   "," +
      //   data.province.split("-").slice(1).join("-"),
    };
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients`,
        payload
      );
      toast({
        title: "Tạo hồ sơ thành công!",
        description: "Hồ sơ bệnh nhân đã được tạo.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Tạo hồ sơ thất bại!",
        description: "Đã xảy ra lỗi.",
      });
    } finally {
      setIsLoading(false);
      setSearchTerm(data.email);
      setShowCreatePatientProfile(false);
      if (
        pathname.split("/").includes("patient") &&
        pathname.split("/").includes("dashboard")
      ) {
        localStorage.setItem("currentEmail", data.email);
        const response2 = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/?email=${data.email}`
        );
        router.push(`/${(response2?.data as any)._id}/patient/dashboard`);
      }
    }
  };

  return (
    <div className="mt-4 p-4 border border-blue-500 rounded-md">
      <h3 className="text-lg font-semibold text-blue-500 mb-4">
        TẠO HỒ SƠ BỆNH NHÂN
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

          {/* <div className="space-y-2">
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
          </div> */}

          <Button type="submit" className="w-fit">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Tạo hồ sơ"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

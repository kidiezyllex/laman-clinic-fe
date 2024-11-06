"use client";

import { useState, useEffect } from "react";
import Pusher from "pusher-js";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { format } from "date-fns";
interface Notification {
  id?: string;
  message?: string;
  createdAt?: Date;
}

export default function Notification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return format(date, "dd/MM/yyyy");
  };

  function getTimeDifference(
    date1: Date | string | number,
    date2: Date | string | number
  ): string {
    // Convert inputs to Date objects if they're not already
    const d1 = date1 instanceof Date ? date1 : new Date(date1);
    const d2 = date2 instanceof Date ? date2 : new Date(date2);

    // Check if the dates are valid
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      throw new Error("Invalid date input");
    }

    const diffInMilliseconds = Math.abs(d2.getTime() - d1.getTime());
    const seconds = Math.floor(diffInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} ngày`;
    } else if (hours > 0) {
      return `${hours} giờ`;
    } else if (minutes > 0) {
      return `${minutes} phút`;
    } else {
      return `${seconds} giây`;
    }
  }
  useEffect(() => {
    const pusher = new Pusher("671afd8438e48f336089", {
      cluster: "ap1",
    });

    const channel = pusher.subscribe("appointments");
    channel.bind("new-appointment", async (data: any) => {
      // fetch data cũ --> sort data cũ --> push thêm data mới
      const res = await axios.get(`/api/notification`);
      setNotifications([
        {
          message: data.appointment.fullName + " đã đăng ký hẹn khám.",
          createdAt: data.date,
        },
        ...res.data.sort(
          (a: { createdAt: string }, b: { createdAt: string }) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
      ]);

      // sau đó mới post sau
      await axios.post(`/api/notification`, {
        message: data.appointment.fullName + " đã đăng ký hẹn khám.",
        createdAt: data.date,
      });
    });

    return () => {
      pusher.unsubscribe("appointments");
    };
  }, []);

  useEffect(() => {
    const fecthData = async () => {
      const res = await axios.get(`/api/notification`);
      setNotifications(
        res.data.sort(
          (a: { createdAt: string }, b: { createdAt: string }) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    };
    fecthData();
  }, []);

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%]">
      <p className="text-base font-semibold text-blue-500">
        LỊCH SỬ ĐĂNG KÝ / HUỶ KHÁM
      </p>
      <ScrollArea className="h-[90%] w-full rounded-md border p-4">
        {notifications.map((nt) => (
          <div
            key={nt.id}
            className="mb-4 border p-4 rounded-md flex flex-row justify-between bg-primary-foreground"
          >
            <p className="text-base dark:text-slate-300">{nt.message}</p>
            <Badge className="w-fit" variant={"default"}>
              Khoảng {getTimeDifference(nt?.createdAt as Date, new Date())}{" "}
              trước
            </Badge>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}

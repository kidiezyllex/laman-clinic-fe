import { format } from "date-fns";
// import bcrypt from "bcrypt";
// Linear interpolation
export function lerp(a: number, b: number, n: number) {
  return (1 - n) * a + n * b;
}

// Get distance between two points
export function getDistance(x1: number, y1: number, x2: number, y2: number) {
  return Math.hypot(x2 - x1, y2 - y1);
}

export function formatDate(date: Date | undefined) {
  if (!date) return "N/A";
  return format(date, "dd/MM/yyyy");
}

export function formatDate2(date: Date | undefined) {
  if (!date) return "N/A";
  return format(date, "h:mm a dd/MM/yyyy");
}

export function formatDate3(date: Date | undefined) {
  if (!date) return "N/A";
  return format(date, "HH:mm");
}

export function generateTimeSlots(startTime: string, endTime: string) {
  const slots = [];
  let currentTime = new Date(`2000-01-01T${startTime}:00`);
  const end = new Date(`2000-01-01T${endTime}:00`);

  while (currentTime < end) {
    const slotStart = currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    currentTime.setHours(currentTime.getHours() + 1);
    const slotEnd = currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    slots.push(`${slotStart} - ${slotEnd}`);
  }

  return slots;
}

export function getDayOfWeek(date: Date) {
  switch (date.getUTCDay()) {
    case 6:
      return "Sunday";
    case 0:
      return "Monday";
    case 1:
      return "Tuesday";
    case 2:
      return "Wednesday";
    case 3:
      return "Thursday";
    case 4:
      return "Friday";
    case 5:
      return "Saturday";
    default:
      return "Invalid day";
  }
}

export function generateExamination(startTime: string) {
  const slots = [];
  let currentTime = new Date(`2000-01-01T${startTime}:00`);

  const slotStart = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  currentTime.setHours(currentTime.getHours() + 1);
  const slotEnd = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  slots.push(`${slotStart} - ${slotEnd}`);

  return slots;
}

export function setTimeToDate(selectDate: Date, slot: string): Date {
  const [hours, minutes] = slot.split(":").map(Number); // Tách giờ và phút từ chuỗi slot
  const newDate = new Date(selectDate); // Tạo bản sao của selectDate để giữ nguyên ngày

  newDate.setHours(hours, minutes, 0, 0); // Đặt giờ và phút trên newDate

  return newDate;
}
export const getHoursBetweenDates = (
  date2: Date | string | number | undefined
): number | null => {
  const date1 = new Date();

  if (date2 === undefined) return null;

  let parsedDate2: Date;

  if (typeof date2 === "string") {
    parsedDate2 = new Date(date2);
  } else if (typeof date2 === "number") {
    parsedDate2 = new Date(date2);
  } else {
    parsedDate2 = date2;
  }

  if (isNaN(parsedDate2.getTime())) {
    return null;
  }

  const timeDifference = Math.abs(parsedDate2.getTime() - date1.getTime());
  return Math.floor(timeDifference / (1000 * 60 * 60));
};

export const renderSpecialty = (specialty: string) => {
  const specialtys: { [key: string]: string } = {
    Cardiology: "Khoa Tim mạch",
    Dermatology: "Khoa Da liễu",
    Hematology: "Khoa Huyết học",
    InternalMedicine: "Khoa Nội tổng quát",
    Otolaryngology: "Khoa Tai Mũi Họng",
  };
  return specialtys[specialty] || "Không xác định";
};

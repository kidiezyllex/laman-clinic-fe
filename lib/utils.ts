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
  if (!date) return "";
  return format(date, "dd/MM/yyyy");
}

export function formatDate2(date: Date | undefined) {
  if (!date) return "";
  return format(date, "h:mm a dd/MM/yyyy");
}

export function formatDate3(date: Date | undefined) {
  if (!date) return "";
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
    InternalMedicine: "Khoa Nội tổng quát",
    GeneralSurgery: "Khoa Ngoại tổng quát",
    Pediatrics: "Khoa Nhi",
    ObstetricsGynecology: "Khoa Sản",
    Cardiology: "Khoa Tim mạch",
    Neurology: "Khoa Thần kinh",
    Pulmonology: "Khoa Phổi",
    Dermatology: "Khoa Da liễu",
    Gastroenterology: "Khoa Tiêu hóa",
    NephrologyUrology: "Khoa Thận - Tiết niệu",
    Hematology: "Khoa Huyết học",
    Otolaryngology: "Khoa Tai Mũi Họng",
    Ophthalmology: "Khoa Mắt",
    OralMaxillofacialSurgery: "Khoa Răng Hàm Mặt",
    PhysicalMedicineRehabilitation: "Khoa Phục hồi chức năng",
    ClinicalPsychology: "Khoa Tâm lý học",
  };

  return specialtys[specialty] || "";
};

export const renderDayOfWeek = (day: string) => {
  const days: { [key: string]: string } = {
    Monday: "Thứ Hai",
    Tuesday: "Thứ Ba",
    Wednesday: "Thứ Tư",
    Thursday: "Thứ Năm",
    Friday: "Thứ Sáu",
    Saturday: "Thứ Bảy",
    Sunday: "Chủ Nhật",
  };
  return days[day] || "";
};

export const renderRole = (role: string) => {
  const roles: { [key: string]: string } = {
    receptionist: "Lễ tân",
    doctor: "Bác sĩ",
    admin: "Quản trị viên",
    pharmacist: "Dược sĩ",
    cashier: "Thu ngân",
    patient: "Bệnh nhân",
    "laboratory-technician": "Y tá xét nghiệm",
  };
  return roles[role] || "";
};

export const ServiceNames = [
  "Khám tổng quát",
  "Khám sức khỏe định kỳ",
  "Khám chuyên khoa",
  "Gói khám sức khỏe toàn diện",
  "Khám chẩn đoán hình ảnh",
] as const;

export const renderPriceBySpeAndService = (
  item: string,
  index: number
): number => {
  const items: { [key: string]: number[] } = {
    InternalMedicine: [150000, 500000, 200000, 1500000, 500000],
    GeneralSurgery: [200000, 600000, 250000, 2000000, 700000],
    Pediatrics: [120000, 400000, 180000, 1200000, 450000],
    ObstetricsGynecology: [180000, 550000, 220000, 1800000, 600000],
    Cardiology: [250000, 800000, 300000, 2500000, 1000000],
    Neurology: [220000, 700000, 280000, 2200000, 900000],
    Pulmonology: [180000, 600000, 230000, 1900000, 800000],
    Dermatology: [160000, 500000, 200000, 1600000, 550000],
    Gastroenterology: [190000, 650000, 240000, 2000000, 850000],
    NephrologyUrology: [200000, 700000, 250000, 2100000, 900000],
    Hematology: [210000, 750000, 270000, 2300000, 950000],
    Otolaryngology: [170000, 550000, 220000, 1700000, 600000],
    Ophthalmology: [160000, 500000, 200000, 1600000, 550000],
    OralMaxillofacialSurgery: [180000, 600000, 230000, 1900000, 700000],
    PhysicalMedicineRehabilitation: [150000, 500000, 190000, 1500000, 550000],
    ClinicalPsychology: [200000, 650000, 250000, 2000000, 700000],
  };

  return items[item]?.[index] ?? 0;
};

import { cn } from "@/lib/utils";
import Image from "next/image";

const data = [
  {
    name: "Conjunctivitis",
    position: "Viêm kết mạc",
    image:
      "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726709075/learning-webdev-blog/clinic/optometry_phstke.png",
  },
  {
    name: "Cirrhosis",
    position: "Xơ gan",
    image:
      "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726709074/learning-webdev-blog/clinic/liver_ecbzbv.png",
  },
  {
    name: "Pneumonia",
    position: "Viêm phổi",
    image:
      "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726709074/learning-webdev-blog/clinic/lung_cu7ofb.png",
  },
  {
    name: "Heart Attack",
    position: "Nhồi máu cơ tim",
    image:
      "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726709075/learning-webdev-blog/clinic/cardiology_obl1xe.png",
  },
  {
    name: "Stroke",
    position: "Đột quỵ",
    image:
      "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726708813/learning-webdev-blog/clinic/human-brain_ovnchj.png",
  },
  {
    name: "Peptic Ulcer",
    position: "Viêm loét dạ dày",
    image:
      "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726708799/learning-webdev-blog/clinic/gastroenterology_cf9fsr.png",
  },
  {
    name: "Otitis Media",
    position: "Viêm tai giữa",
    image:
      "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726708785/learning-webdev-blog/clinic/ear_kj1q8v.png",
  },
  {
    name: "Spinal Degeneration",
    position: "Thoái hóa cột sống",
    image:
      "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726708771/learning-webdev-blog/clinic/chiropractic_j4qoqf.png",
  },
];

export default function AvatarList({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes: Record<"sm" | "md" | "lg", string> = {
    lg: "m-3 size-6",
    md: "m-2 size-12",
    sm: "m-1 size-8",
  };

  return (
    <div className={cn("hidden sm:flex mt-16 pt-2 ml-4", className)}>
      {data.map((item) => (
        <div
          key={item.name}
          className="group relative z-0 -ml-4 flex scale-100 items-center transition-all duration-200 ease-in-out hover:z-10 hover:scale-110"
        >
          <div className="relative overflow-hidden rounded-full dark:bg-background bg-white border">
            <div className="bg-size pointer-events-none absolute h-full w-full animate-bg-position from-violet-500 from-30% via-cyan-400 via-50% to-pink-500 to-80% bg-[length:300%_auto] opacity-15 group-hover:bg-gradient-to-r" />
            <div className="z-1 blur-lg" />
            <img
              src={item.image}
              alt={item.name}
              className={cn(
                "rounded-full object-cover",
                sizes[size] ?? sizes.md
              )}
            />
          </div>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 translate-y-2 transform whitespace-nowrap rounded bg-blue-500 p-2 text-white opacity-0 transition-all duration-300 ease-in-out group-hover:-translate-y-2 group-hover:opacity-100 dark:bg-slate-100 dark:text-slate-900">
            <div className="text-sm font-semibold">{item.name}</div>
            <div className="text-xs font-semibold">{item.position}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

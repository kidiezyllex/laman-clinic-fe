"use client";

import { useEffect, useMemo, useRef } from "react";

export default function TextFlip() {
  const words = useMemo(
    () => [
      "Quảng bá khách sạn!",
      "Đặt phòng nhanh chóng!",
      "Trải nghiệm nghỉ dưỡng!",
      "Tìm kiếm dễ dàng!",
      "Thanh toán an toàn!",
    ],
    []
  );

  const tallestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tallestRef.current) {
      let maxHeight = 0;

      words.forEach((word) => {
        const span = document.createElement("span");
        span.className = "absolute opacity-0";
        span.textContent = word;
        tallestRef.current?.appendChild(span);
        const height = span.offsetHeight;
        tallestRef.current?.removeChild(span);

        if (height > maxHeight) {
          maxHeight = height;
        }
      });

      tallestRef.current.style.height = `${maxHeight}px`;
    }
  }, [words]);

  return (
    <div className="box-content flex gap-4 text-3xl font-semibold">
      {/* <p className="font-bold text-5xl tracking-wide leading-snug ">
            Đăng ký và đặt khách sạn mọi lúc!
          </p> */}
      <div
        ref={tallestRef}
        className="flex flex-col overflow-hidden text-blue-400 text-4xl tracking-wide leading-snug"
      >
        {words.map((word, index) => (
          <span key={index} className="animate-flip-words">
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}

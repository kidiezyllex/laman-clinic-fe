"use client";

import { useEffect, useMemo, useRef, useState } from "react";
export default function TextFlip() {
  const tallestRef = useRef<HTMLDivElement>(null);
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    const newWords = [
      "Đặt khám dễ dàng!",
      "Bác sĩ uy tín!",
      "Tra cứu nhanh chóng!",
      "Hỗ trợ tận tình!",
      "Thanh toán an toàn!",
    ];

    const timer = setTimeout(() => setWords([...newWords]), 50);

    return () => clearTimeout(timer);
  }, []);
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
      <div
        ref={tallestRef}
        className="flex flex-col overflow-hidden text-blue-400 text-3xl xl:text-4xl tracking-wide leading-snug"
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

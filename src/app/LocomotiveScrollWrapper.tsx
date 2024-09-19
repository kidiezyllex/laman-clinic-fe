"use client";

import { useEffect, useRef } from "react";
import "locomotive-scroll/dist/locomotive-scroll.css";
import LocomotiveScroll from "locomotive-scroll";
interface LocomotiveScrollWrapperProps {
  children: React.ReactNode;
}

export default function LocomotiveScrollWrapper({
  children,
}: LocomotiveScrollWrapperProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const locomotiveScrollRef = useRef<LocomotiveScroll | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      locomotiveScrollRef.current = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
        lerp: 0.075,
      });
    }

    return () => {
      locomotiveScrollRef.current?.destroy();
    };
  }, []);

  return (
    <div ref={scrollRef} data-scroll-container>
      {children}
    </div>
  );
}

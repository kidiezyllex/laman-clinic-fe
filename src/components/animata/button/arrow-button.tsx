"use client";
import React from "react";
import { MoveRight, Pencil } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ArrowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  textColor?: string;
  buttonOverlayColor?: string;
  borderColor?: string;
  iconColor?: string;
  className?: string;
}

export default function ArrowButton({
  text = "Open",
  textColor = "#5DA0F2",
  buttonOverlayColor = "#5DA0F2",
  borderColor = "#5DA0F2",
  iconColor = "white",
  className,
  ...props
}: ArrowButtonProps) {
  return (
    <Button
      variant={"outline"}
      style={{ borderColor: borderColor }}
      {...props}
      className={cn(
        "group relative inline-flex items-center justify-center px-10 bg-background overflow-hidden font-medium shadow-md transition duration-300 ease-out",
        className
      )}
    >
      <span
        style={{ background: buttonOverlayColor }}
        className={cn(
          "ease absolute inset-0 flex h-full w-full -translate-x-full items-center justify-center bg-blue-400 text-white duration-300 group-hover:translate-x-0"
        )}
      >
        <MoveRight style={{ color: iconColor }} />
      </span>
      <span
        style={{ color: textColor }}
        className={cn(
          "absolute flex h-full w-full transform items-center justify-center font-bold transition-all duration-300 ease-in-out group-hover:translate-x-full"
        )}
      >
        {text}
      </span>
      <span className="invisible relative">Button</span>
    </Button>
  );
}

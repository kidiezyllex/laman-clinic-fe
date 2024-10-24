"use client";

import { motion } from "framer-motion";

export default function Loading() {
  const spinTransition = {
    loop: Infinity,
    ease: "linear",
    duration: 1,
  };

  return (
    <div className="flex items-center justify-center h-screen dark:bg-slate-800 bg-slate-50">
      <div className="relative w-10 h-10">
        <motion.span
          className="block w-10 h-10 border-8 border-gray-300 rounded-full"
          animate={{ rotate: 360 }}
          transition={spinTransition}
        />
        <motion.span
          className="absolute top-0 left-0 block w-10 h-10 border-t-8 border-blue-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={spinTransition}
        />
      </div>
    </div>
  );
}

"use client";
import { SignUp, useSignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignUp
      appearance={{
        elements: {
          headerTitle: "text-2xl font-bold text-blue-500",
          socialButtonsIconButton: "hidden",
          dividerRow: "hidden",
          cardBox: "w-[500px]",
          card: "shadow-none w-full pb-0",
          formFieldInput:
            "dark:bg-white border border-slate-200 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
          formFieldLabel: "text-slate-600 text-sm font-semibold",
          headerSubtitle: "hidden",
          footerActionText: "text-base font-semibold",
          footerActionLink: "text-base",
          formButtonPrimary: "py-2",
        },
        layout: {
          socialButtonsPlacement: "bottom",
          socialButtonsVariant: "iconButton",
        },
        variables: {
          colorPrimary: "#3b82f6",
          colorText: "black",
        },
      }}
    ></SignUp>
  );
}

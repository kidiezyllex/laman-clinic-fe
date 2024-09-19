"use client";
import { useAuth } from "@clerk/nextjs";
import React, { useState } from "react";
import Link from "next/link";
import { CalendarDays, Home, MessageCircleMore } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Dashboard from "@/components/receptionist/dashboard";
import Messages from "@/components/receptionist/messages";

export default function Page() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderMainContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "appointments":
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              Your Appointments
            </h3>
            <p className="text-sm text-muted-foreground">
              You have 6 upcoming appointments.
            </p>
            <Button className="mt-4">Manage Appointments</Button>
          </div>
        );
      case "messages":
        return <Messages />;
      default:
        return null;
    }
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] gap-5">
      <div className="hidden border bg-background md:block rounded-md">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex-1 pt-4">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="#"
                onClick={() => setActiveSection("dashboard")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  activeSection === "dashboard"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="#"
                onClick={() => setActiveSection("appointments")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  activeSection === "appointments"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <CalendarDays className="h-4 w-4" />
                Lịch hẹn
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  6
                </Badge>
              </Link>
              <Link
                href="#"
                onClick={() => setActiveSection("messages")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  activeSection === "messages"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <MessageCircleMore className="h-4 w-4" />
                Tin nhắn
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col rounded-md">{renderMainContent()}</div>
    </div>
  );
}

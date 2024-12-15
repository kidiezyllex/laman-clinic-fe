"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "./auth-context";
import { LoadingProvider } from "@/components/LoadingProvider";
import NavBar from "@/components/layout/NavBar";
import Container from "@/components/Container";
import Hero from "@/components/layout/Hero";
import Section from "@/components/layout/Section";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Toaster />
        <AuthProvider>
          <NavBar />
          <main className="flex flex-col min-h-screen bg-secondary">
            <section className="flex flex-grow">
              <Container>
                <LoadingProvider>{children}</LoadingProvider>
              </Container>
            </section>
            <Hero />
            <Section />
            <Footer />
          </main>
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from "@/components/provider/sessionProvider";
import { Toaster } from "@/components/ui/sonner";
import Network from "@/components/pages/network";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Proflow ",
  description: `ProFlow is a role-based project and task management web application designed for smooth collaboration between clients and freelancers.
It allows clients to Track Projects, track progress in real time, and view task completion status, while freelancers can manage & create tasks, update statuses, and deliver work transparently.
The system focuses on clarity, accountability, and efficient workflow management.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProvider>
          <Network/>
          <main className="min-h-screen w-full overflow-x-hidden">
            {children}
          </main>
          <Toaster />
        </ClientProvider>
      </body>
    </html>
  );
}

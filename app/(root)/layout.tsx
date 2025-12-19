"use client";
import Navbar from "@/components/layout/navbar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

const Homelayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="border-4 border-gray-200 border-t-blue-500 w-10 h-10 rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/auth");
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default Homelayout;

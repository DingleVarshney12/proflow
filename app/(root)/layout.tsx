"use client";
import Navbar from "@/components/layout/navbar";
import Loader from "@/components/ui/loader";
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
    return <Loader />;
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

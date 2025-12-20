"use client";

import ClientPage from "@/components/pages/ClientPage";
import FreelancerPage from "@/components/pages/freelancerPage";
import { useSession } from "next-auth/react";

export default function Home() {
  
  const { data: session } = useSession();
  if (session?.user.role === "Client") {
    return <ClientPage />;
  } else {
    return <FreelancerPage />;
  }
}

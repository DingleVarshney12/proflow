"use client";
import { signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const { status } = useSession();
  return (
    <header className="w-full min-h-14 bg-blue-500 px-2 md:px-8 py-2 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center space-x-2 ">
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image src={"/logo.png"} alt="company logo" fill priority />
        </div>
        <h1 className="text-lg md:text-2xl font-bold text-white">ProFlow</h1>
      </div>
      <nav className="flex items-center space-x-4 ">
        <Link href={"/"}>
          <Button variant={"link"} className="text-white">
            Home
          </Button>
        </Link>
        <div>
          {status !== "unauthenticated" && (
            <>
              <Button onClick={() => signOut()}>
                <LogOut />
                <span className="hidden md:block">Logout</span>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

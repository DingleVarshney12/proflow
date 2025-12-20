"use client";
import React, { useEffect, useState } from "react";

const Network = () => {
  const [isOnline, setIsOnline] = useState((navigator as Navigator).onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center py-2 z-50">
      <p>You are offline. Please check your internet connection.</p>
    </div>
  );
};

export default Network;

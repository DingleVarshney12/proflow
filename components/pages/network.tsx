"use client";

import { useEffect, useState } from "react";

const Network: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    updateOnlineStatus();

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      role="alert"
      className="fixed top-0 left-0 w-full bg-red-600 text-white text-center py-2 z-50"
    >
      <p>You are offline. Please check your internet connection.</p>
    </div>
  );
};

export default Network;

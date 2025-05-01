"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi"; 

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isConnected, isReconnecting, isConnecting } = useAccount();
  const router = useRouter();
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  useEffect(() => {
    if (
      isPageLoaded &&
      !isConnected &&
      !isReconnecting &&
      !isConnecting
    ) {
      router.replace("/")
    }
  }, [isPageLoaded, isConnected, isReconnecting, isConnecting, router]);

  if (!isPageLoaded || isReconnecting) {
    return null;
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#020817]">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Wallet Connection Required</h2>
          <p className="mb-4">Please connect your wallet to access this page</p>
          <div className="animate-pulse">Redirecting...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
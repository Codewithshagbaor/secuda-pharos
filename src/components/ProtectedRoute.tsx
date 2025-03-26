"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi"; // Assuming you're using wagmi for wallet connection

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    // If wallet is not connected, redirect to landing page
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  // If wallet is not connected, you can show a loading state or nothing
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

  // If wallet is connected, render the children
  return <>{children}</>;
}
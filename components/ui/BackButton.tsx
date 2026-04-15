"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  fallback?: string;
  className?: string;
}

export function BackButton({ fallback = "/", className = "" }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // If there is history, go back. Otherwise, go to fallback.
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-colors ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft size={20} />
    </button>
  );
}

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Back Button - Positioned Absolutely */}
      <Link
        href="/"
        className="fixed top-6 left-6 sm:top-8 sm:left-8 z-50 flex items-center gap-2 text-slate-500 hover:text-magenta-800 font-medium transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg"
      >
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </Link>

      <div className="min-h-screen flex bg-white">{children}</div>
    </>
  );
}

"use client";

import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="relative w-44 h-44 animate-easevote-float">
        {/* 1. Loader Arc (Aura Ring Loader) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-full h-full rounded-full border-60 border-transparent 
          border-t-primary-500 border-l-secondary-600 
          animate-easevote-loader"
          ></div>
        </div>

        {/* 2. Logo Container */}
        <div
          className="absolute inset-4 flex items-center justify-center rounded-full 
          bg-linear-to-br from-primary-700 to-secondary-700 
          shadow-2xl shadow-secondary-500/60 animate-easevote-breathe"
        >
          <Image
            src="/easevote.svg"
            alt="EaseVote Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}

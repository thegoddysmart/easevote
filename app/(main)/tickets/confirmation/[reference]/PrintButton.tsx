"use client";

import React from "react";
import { Download } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-8 py-4 bg-magenta-600 text-white rounded-2xl font-bold hover:bg-magenta-700 shadow-lg shadow-magenta-500/30 transition-all flex items-center justify-center gap-2"
    >
      <Download size={20} /> Print All Tickets
    </button>
  );
}

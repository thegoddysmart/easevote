import React, { useState, useEffect } from "react";
import {
  X,
  Shield,
  FileText,
  Cookie,
  ChevronDown,
  ChevronUp,
  Lock,
  CheckCircle,
} from "lucide-react";
import { trustContent } from "@/constants/trust-content";

interface TrustCenterProps {
  isOpen: boolean;
  onOpen: () => void; // Added onOpen to allow the banner to open the modal
  onClose: () => void;
  activeTab: "terms" | "privacy" | "cookies";
  onTabChange: (tab: "terms" | "privacy" | "cookies") => void;
  showCookieBanner?: boolean; // New prop for controlling banner visibility
}

export default function TrustCenter({
  isOpen,
  onOpen,
  onClose,
  activeTab,
  onTabChange,
  showCookieBanner: enableBanner = true, // Default to true
}: TrustCenterProps) {
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [expandedLegal, setExpandedLegal] = useState(false);

  // Show cookie banner after a short delay on mount
  useEffect(() => {
    if (!enableBanner) return; // Don't show if disabled
    const timer = setTimeout(() => setShowCookieBanner(true), 1500);
    return () => clearTimeout(timer);
  }, [enableBanner]);

  const handleAcceptCookies = () => {
    setShowCookieBanner(false);
  };

  const handleCustomizeCookies = () => {
    onTabChange("cookies");
    onOpen();
  };

  // Content Data

  const activeContent = trustContent[activeTab];

  return (
    <>
      {/* 1. The Cookie Banner (The Hook) */}
      {showCookieBanner && !isOpen && (
        <div className="fixed bottom-0 left-0 w-full z-40 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] transition-transform duration-500 animate-in slide-in-from-bottom">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-magenta-50 rounded-full text-magenta-600 hidden sm:block">
                <Cookie size={24} />
              </div>
              <div>
                <h4 className="font-display font-bold text-slate-900">
                  We bake cookies to count your vote.
                </h4>
                <p className="text-sm text-slate-600 max-w-2xl">
                  To ensure your vote is secure and you don&apos;t get logged
                  out while buying tickets, we use essential cookies. We
                  don&apos;t spy on you.
                </p>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={handleCustomizeCookies}
                className="flex-1 md:flex-none px-6 py-2.5 rounded-full border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Customize
              </button>
              <button
                onClick={handleAcceptCookies}
                className="flex-1 md:flex-none px-6 py-2.5 rounded-full bg-primary-800 text-white font-bold text-sm hover:bg-primary-900 transition-colors shadow-lg shadow-primary-900/20"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. The Modal (Trust Center) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Shield className="text-green-500" size={20} />
                <h2 className="text-xl font-display font-bold text-slate-900">
                  Transparency at EaseVote
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full text-slate-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50/50 p-1">
              {[
                { id: "terms", label: "Terms of Service", icon: FileText },
                { id: "privacy", label: "Privacy Policy", icon: Lock },
                { id: "cookies", label: "Cookies", icon: Cookie },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id as "terms" | "privacy" | "cookies");
                    setExpandedLegal(false);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-all rounded-xl ${
                    activeTab === tab.id
                      ? "bg-white text-magenta-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:h-full">
                {/* Left: Human Summary (35%) */}
                <div className="md:col-span-5 p-8 bg-white">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="p-3 bg-gray-50 rounded-2xl">
                      {activeContent.icon}
                    </div>
                    <h3 className="text-2xl font-display font-bold text-slate-900 leading-tight">
                      {activeContent.title}
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {activeContent.humanSummary.map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <CheckCircle
                          className="text-green-500 shrink-0 mt-1"
                          size={18}
                        />
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">
                            {item.title}
                          </h4>
                          <p className="text-slate-500 text-sm leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Legal Text (65%) */}
                <div className="md:col-span-7 bg-gray-50 border-l border-gray-100 flex flex-col">
                  {/* Accordion Header */}
                  <button
                    onClick={() => setExpandedLegal(!expandedLegal)}
                    className="w-full p-4 flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition-colors text-xs font-bold uppercase tracking-wider text-slate-500 md:hidden"
                  >
                    Read Full Legal Text
                    {expandedLegal ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>

                  {/* Scrollable Text Area */}
                  <div
                    className={`p-8 flex-1 overflow-y-auto ${
                      expandedLegal ? "block" : "hidden md:block"
                    }`}
                  >
                    <div className="prose prose-sm prose-slate max-w-none">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                        Official Legal Text
                      </h4>
                      <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-600 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        {activeContent.legalText}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import TrustCenter from "@/components/layout/TrustCenter/TrustCenter";
import Footer from "@/components/layout/Footer";

export default function TrustCenterWrapper() {
  const [isTrustCenterOpen, setIsTrustCenterOpen] = useState(false);
  const [activeTrustTab, setActiveTrustTab] = useState<
    "terms" | "privacy" | "cookies"
  >("terms");

  const handleOpenLegal = (tab: "terms" | "privacy" | "cookies") => {
    setActiveTrustTab(tab);
    setIsTrustCenterOpen(true);
  };

  return (
    <>
      <Footer onOpenLegal={handleOpenLegal} />
      <TrustCenter
        isOpen={isTrustCenterOpen}
        onOpen={() => setIsTrustCenterOpen(true)}
        onClose={() => setIsTrustCenterOpen(false)}
        activeTab={activeTrustTab}
        onTabChange={setActiveTrustTab}
      />
    </>
  );
}

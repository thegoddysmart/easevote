import Header from "@/components/layout/Header";
import FloatingControls from "@/components/layout/FloatingControls";
import TrustCenterWrapper from "@/components/layout/TrustCenter/TrustCenterWrapper";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <FloatingControls />
      <TrustCenterWrapper />
    </>
  );
}

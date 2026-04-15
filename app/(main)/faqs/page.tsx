import PageHeader from "./components/PageHeader";
import Faq from "./components/FAQ";
import Newsletter from "@/components/features/Newsletter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | EaseVote Ghana",
  description:
    "Find answers to common questions about creating events, buying tickets, and voting on EaseVote Ghana.",
  alternates: {
    canonical: "/faqs",
  },
};

export default function FaqsPage() {
  return (
    <main className="min-h-screen">
      <PageHeader />
      <Faq />
      <Newsletter />
    </main>
  );
}

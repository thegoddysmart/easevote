import PageHeader from "./components/PageHeader";
import { Metadata } from "next";
import BlogList from "./components/BlogList";
import Newsletter from "@/components/features/Newsletter";

export const metadata: Metadata = {
  title: "Blog & News | EaseVote Ghana",
  description:
    "Stay updated with the latest news, events, and tips from EaseVote Ghana. Read our blog for insights into e-voting and event management.",
  alternates: {
    canonical: "https://easevotegh.com/blogs",
  },
};

export default function BlogsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <PageHeader />
      <BlogList />
      <Newsletter />
    </main>
  );
}

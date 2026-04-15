"use client";

import { useState } from "react";
import { mockPosts } from "@/constants/blogPosts";
import { CategoryFilter } from "./CategoryFilter";
import { FeaturedPost } from "./FeaturedPost";
import { PostCard } from "./PostCard";
import { BlogPost } from "@/types";
import { useRouter } from "next/navigation";

export default function BlogList() {
  // No props needed
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");

  // Local handler for navigation
  const handleReadPost = (post: BlogPost) => {
    // Assuming your blog details page is at /blogs/[slug] or /blogs/[id]
    // Adjust the path below to match your actual routing structure
    router.push(`/blogs/${post.id}`);
  };

  const categories = [
    "All",
    "Event Tips",
    "Case Studies",
    "Security",
    "Tech Trends",
  ];

  const filtered =
    activeCategory === "All"
      ? mockPosts
      : mockPosts.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <CategoryFilter
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        {filtered.length > 0 ? (
          <>
            {activeCategory === "All" && (
              // Use the local handleReadPost
              <FeaturedPost post={filtered[0]} onRead={handleReadPost} />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {(activeCategory === "All" ? filtered.slice(1) : filtered).map(
                (p) => (
                  // Use the local handleReadPost
                  <PostCard key={p.id} post={p} onRead={handleReadPost} />
                )
              )}
            </div>
          </>
        ) : (
          <p className="text-center py-20 text-slate-500">No posts found.</p>
        )}
      </div>
    </div>
  );
}

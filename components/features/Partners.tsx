"use client";

import React, { useState, useEffect } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { TiltCard } from "../ui/TiltCard";
import { PARTNERS_DATA } from "../../constants/partners";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Partners() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8); // default desktop

  // Detect mobile and set itemsPerPage = 2
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(2); // mobile (sm breakpoint)
      } else {
        setItemsPerPage(8); // desktop
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);

    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const totalPages = Math.ceil(PARTNERS_DATA.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPartners = PARTNERS_DATA.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader />

        <div className="flex flex-wrap justify-center gap-5 mb-12">
          {currentPartners.map((partner) => (
            <TiltCard
              key={partner.id}
              className="w-[225px] h-[150px] sm:w-[295px] sm:h-[180px] md:w-[295px] md:h-[180px] bg-white"
              borderColor="var(--color-brand-bright)"
            >
              <div className="relative w-full h-1/2 p-6">
                <Image
                  src={partner.logoUrl}
                  alt={`${partner.name} logo`}
                  fill
                  className="object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </TiltCard>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-full border transition-colors ${
                currentPage === 1
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400"
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-sm font-medium text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full border transition-colors ${
                currentPage === totalPages
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400"
              }`}
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

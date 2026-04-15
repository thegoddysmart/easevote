"use client";

import React from "react";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";
import { russoOne } from "./fonts";

export const SectionHeader: React.FC = () => {
  return (
    <div className="text-center mb-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-brand-bright font-bold uppercase text-sm tracking-wide mb-[15px] flex items-center justify-center gap-2"
      >
        <span className="text-red-600 bg-red-100 p-1 rounded-full">
          <Zap size={16} fill="currentColor" />
        </span>
        Trusted by Ghana&apos;s Leading Institions
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className={`${russoOne.className} tracking-tight text-brand-deep text-3xl capitalize leading-none text-[35px] sm:text-[45px] lg:text-[50px] xl:text-[60px]`}
      >
        Our Partners
      </motion.h2>
    </div>
  );
};

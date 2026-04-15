"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  borderColor: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = "",
  borderColor,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [scale, setScale] = useState(1);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    // Calculate rotation (max 15 degrees)
    setRotateX(yPct * -30);
    setRotateY(xPct * 30);
  };

  const handleMouseEnter = () => {
    setScale(1.05);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setScale(1);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative flex justify-center items-center rounded-[20px] transition-colors duration-300 ${className}`}
      // We apply the border color dynamically via style to handle arbitrary colors cleanly
      // or we can use the passed prop if it was a class.
      // For this specific design, strict colors are required.
    >
      {/* Border handling via inline style to support dynamic enum values if needed, 
            but for Tailwind purity we will use style for the specific color */}
      <div
        className="absolute inset-0 rounded-[18px] pointer-events-none"
        style={{ border: `2px solid ${borderColor}` }}
      />

      {/* Glare Effect */}
      <div
        className="absolute inset-0 rounded-[20px] bg-gradient-to-tr from-white/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay"
        style={{
          transform: `translateX(${rotateY}px) translateY(${rotateX}px)`,
        }}
      />

      <div className="transform translate-z-[20px] w-full h-full flex items-center justify-center">
        {children}
      </div>
    </motion.div>
  );
};

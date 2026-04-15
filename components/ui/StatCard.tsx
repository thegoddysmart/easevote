"use client";

import React from "react";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import { cn } from "@/lib/utils";
import { VARIANT_STYLES } from "../../constants/styles";
import { StatItem } from "../../constants/stat-data";

const StatCard: React.FC<StatItem> = ({
  label,
  value,
  variant = "default",
  suffix = "",
  prefix = "",
  className = "",
  icon: Icon,
  description,
  delay = 0,
  hasDecor = false,
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const styles = VARIANT_STYLES[variant];

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-4xl p-8 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
        styles.container,
        className
      )}
    >
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={cn("p-3 rounded-2xl", styles.iconBg)}>
          <Icon className={styles.iconColor} size={24} />
        </div>

        {inView && (
          <div
            className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              styles.pulseColor
            )}
          />
        )}
      </div>

      <div className="relative z-10">
        <h3
          className={cn(
            "text-4xl lg:text-5xl font-display font-bold mb-2",
            styles.text
          )}
        >
          {prefix}
          {inView ? (
            <CountUp end={value} duration={2.5} separator="," delay={delay} />
          ) : (
            0
          )}
          {suffix}
        </h3>

        <p className={cn("font-medium text-lg", styles.subtext)}>{label}</p>

        {description && (
          <p className={cn("mt-4 text-sm", styles.subtext)}>{description}</p>
        )}
      </div>

      {variant === "primary" && (
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-brand-deep/10 rounded-full blur-3xl"></div>
      )}

      {hasDecor && (
        <svg
          className="absolute bottom-0 left-0 w-full h-48 opacity-20"
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
        >
          <path
            d="M0,150 C50,150 100,50 150,50 C200,50 250,120 300,80 C350,40 400,100 400,100 L400,200 L0,200 Z"
            fill="white"
          />
        </svg>
      )}
    </div>
  );
};

export default StatCard;

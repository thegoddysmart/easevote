"use client";

import StatCard from "../ui/StatCard";
import { ShieldCheck, Users } from "lucide-react";
import { russoOne } from "../ui/fonts";

export interface StatItem {
  id: string;
  label: string;
  value: number;
  variant: "primary" | "default" | "emerald" | "dark";
  suffix?: string;
  prefix?: string;
  description?: string;
  className?: string;
  delay?: number;
  hasDecor?: boolean;
}

export default function StatsDisplay({ stats }: { stats: StatItem[] }) {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h2
            className={`${russoOne.className} tracking-tight text-brand-deep text-3xl capitalize leading-none text-[35px] sm:text-[45px] lg:text-[50px] xl:text-[60px]`}
          >
            Platform Impact
          </h2>
          <p className="text-slate-500">
            Trusted by organizers for scale, speed, and security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
          {stats.map((stat) => (
            <StatCard 
              key={stat.id} 
              id={stat.id}
              label={stat.label}
              value={stat.value}
              variant={stat.variant}
              suffix={stat.suffix}
              prefix={stat.prefix}
              description={stat.description}
              className={stat.className}
              delay={stat.delay}
              hasDecor={stat.hasDecor}
              icon={StatIcon(stat.id)}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-6 md:gap-12 items-center text-slate-400 text-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-green-500" />
            <span>Bank-Grade Encryption</span>
          </div>

          <div className="flex items-center gap-2">
            <Users size={18} className="text-blue-500" />
            <span>100k+ Unique Voters</span>
          </div>
        </div>
      </div>
    </section>
  );
}

import { TrendingUp, Calendar, Server, Wallet } from "lucide-react";

function StatIcon(id: string) {
  switch (id) {
    case "votes": return TrendingUp;
    case "events": return Calendar;
    case "live": return Server;
    case "payouts": return Wallet;
    default: return TrendingUp;
  }
}

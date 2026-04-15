"use client";

import StatCard from "../ui/StatCard";
import { STATS_DATA } from "../../constants/stat-data";
import { ShieldCheck, Users } from "lucide-react";
import { russoOne } from "../ui/fonts";

export default function Stats() {
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
          {STATS_DATA.map((stat) => (
            <StatCard key={stat.id} {...stat} />
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

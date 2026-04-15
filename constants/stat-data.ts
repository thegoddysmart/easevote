import { LucideIcon, TrendingUp, Calendar, Server, Wallet } from "lucide-react";

export type CardVariant = "primary" | "default" | "emerald" | "dark";

export interface StatItem {
  id: string;
  label: string;
  value: number;
  variant: CardVariant;
  icon: LucideIcon;
  suffix?: string;
  prefix?: string;
  description?: string;
  className?: string;
  delay?: number;
  hasDecor?: boolean;
}

export const STATS_DATA: StatItem[] = [
  {
    id: "votes",
    label: "Votes Processed",
    value: 5400000,
    variant: "primary",
    icon: TrendingUp,
    suffix: "+",
    description:
      "Our scalable infrastructure handles millions of concurrent requests during peak finale moments.",
    className: "col-span-1 md:col-span-2 row-span-2 h-full min-h-[400px]",
    hasDecor: true,
  },
  {
    id: "events",
    label: "Events Hosted",
    value: 1200,
    variant: "default",
    icon: Calendar,
    suffix: "+",
    delay: 0.2,
  },
  {
    id: "uptime",
    label: "Uptime Reliability",
    value: 99.9,
    variant: "emerald",
    icon: Server,
    suffix: "%",
    delay: 0.4,
  },
  {
    id: "payouts",
    label: "Paid to Organizers",
    value: 15,
    variant: "dark",
    icon: Wallet,
    prefix: "GHS ",
    suffix: "M+",
    description:
      "Instant settlements to Bank Accounts and Mobile Money wallets.",
    className: "col-span-1 md:col-span-2 lg:col-span-2",
    delay: 0.6,
  },
];

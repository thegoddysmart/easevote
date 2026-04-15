import { CardVariant } from "./stat-data";

export const VARIANT_STYLES: Record<
  CardVariant,
  {
    container: string;
    text: string;
    subtext: string;
    iconBg: string;
    iconColor: string;
    pulseColor: string;
  }
> = {
  primary: {
    container: "bg-primary-700 text-white",
    text: "!text-secondary-100",
    subtext: "text-white/80",
    iconBg: "bg-white/10",
    iconColor: "text-white",
    pulseColor: "bg-white",
  },
  default: {
    container: "bg-white border border-gray-100 shadow-sm",
    text: "text-slate-900",
    subtext: "text-slate-500",
    iconBg: "bg-slate-100",
    iconColor: "text-magenta-600",
    pulseColor: "bg-green-500",
  },
  emerald: {
    container: "bg-emerald-50 border border-emerald-100",
    text: "text-slate-900",
    subtext: "text-slate-500",
    iconBg: "bg-white",
    iconColor: "text-emerald-600",
    pulseColor: "bg-green-500",
  },
  dark: {
    container: "bg-secondary-700 text-white",
    text: "!text-white",
    subtext: "text-white/80",
    iconBg: "bg-white/10",
    iconColor: "text-secondary-400",
    pulseColor: "bg-white",
  },
};

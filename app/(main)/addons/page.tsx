import Link from "next/link";
import { ChevronRight, Home, Check, Palette, CalendarDays, BarChart3, Megaphone, Camera, HeadphonesIcon, Sparkles, ArrowRight } from "lucide-react";
import Newsletter from "@/components/features/Newsletter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add-ons & Services | EaseVote Ghana",
  description:
    "Supercharge your event with EaseVote's premium add-ons — graphic design, live results displays, photography, event planning, and more.",
  alternates: {
    canonical: "/addons",
  },
};

const addons = [
  {
    icon: Palette,
    title: "Nominee Graphic Design",
    tag: "Included Free",
    tagColor: "bg-success-100 text-success-700",
    description:
      "Professionally designed nominee flyers with voting codes, delivered digitally. Perfect for social media promotion and event programs.",
    features: ["Custom branded flyers", "Voting code overlay", "Digital delivery", "Unlimited revisions"],
    color: "primary",
    cta: { label: "Get Started", href: "/contact" },
  },
  {
    icon: BarChart3,
    title: "Live Results Display",
    tag: "Popular",
    tagColor: "bg-secondary-100 text-secondary-700",
    description:
      "Real-time leaderboard screens for your venue. Keep your audience engaged with live vote counts as the event unfolds.",
    features: ["Real-time updates", "Branded display", "Multiple screen support", "Smooth animations"],
    color: "secondary",
    cta: { label: "Enquire Now", href: "/contact" },
  },
  {
    icon: CalendarDays,
    title: "Event Planning & Management",
    tag: "Full Service",
    tagColor: "bg-info-100 text-info-700",
    description:
      "Let our experienced team handle every detail — from venue logistics to day-of coordination so you can focus on your guests.",
    features: ["Timeline planning", "Vendor coordination", "On-site management", "Post-event debrief"],
    color: "primary",
    cta: { label: "Book a Call", href: "/contact" },
  },
  {
    icon: Megaphone,
    title: "Event Promotion",
    tag: "Boost Reach",
    tagColor: "bg-warning-100 text-warning-700",
    description:
      "Strategic social media campaigns and digital marketing to drive ticket sales and maximise voter engagement before and during your event.",
    features: ["Social media ads", "Email campaigns", "Influencer outreach", "Analytics report"],
    color: "secondary",
    cta: { label: "Promote My Event", href: "/contact" },
  },
  {
    icon: Camera,
    title: "Photography & Videography",
    tag: "Premium",
    tagColor: "bg-primary-100 text-primary-700",
    description:
      "Professional coverage of your event with edited photos and highlight reels delivered within 72 hours.",
    features: ["Full event coverage", "Edited hi-res photos", "Highlight reel", "Cloud delivery"],
    color: "primary",
    cta: { label: "Book Coverage", href: "/contact" },
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    tag: "Always On",
    tagColor: "bg-success-100 text-success-700",
    description:
      "A dedicated account manager and on-site technical support throughout your event, ensuring zero downtime on voting and ticketing.",
    features: ["Named account manager", "On-site tech support", "24/7 chat & phone", "Incident response"],
    color: "secondary",
    cta: { label: "Contact Us", href: "/contact" },
  },
];

export default function AddonsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Page Header */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-12">
        <div className="w-full rounded-3xl overflow-hidden relative min-h-60 flex flex-col items-center justify-center text-center">
          <div className="absolute inset-0 bg-linear-to-r from-primary-200 via-primary-200 to-primary-200 opacity-60 z-0" />
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 bg-primary-700 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-2">
              <Sparkles size={12} />
              Premium Add-ons
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Elevate Your Event
            </h1>
            <p className="text-slate-600 max-w-lg mx-auto text-sm">
              Pair our voting and ticketing platform with professional services designed to make every event unforgettable.
            </p>
            <nav className="flex items-center space-x-2 text-sm text-gray-600 bg-white/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-sm">
              <a href="/" className="hover:text-primary-600 flex items-center gap-1 transition-colors">
                <Home className="w-3 h-3" />
                Home
              </a>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-primary-500 font-medium">Add-ons</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Add-ons Grid */}
      <section className="py-4 pb-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {addons.map((addon, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
              >
                <div className={`p-8 flex flex-col flex-1`}>
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        addon.color === "primary"
                          ? "bg-primary-100 text-primary-700"
                          : "bg-secondary-100 text-secondary-700"
                      }`}
                    >
                      <addon.icon size={22} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${addon.tagColor}`}>
                      {addon.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                    {addon.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                    {addon.description}
                  </p>

                  <ul className="space-y-2 mb-8">
                    {addon.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-sm text-slate-700">
                        <Check
                          size={14}
                          className={addon.color === "primary" ? "text-primary-500 shrink-0" : "text-secondary-500 shrink-0"}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={addon.cta.href}
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all ${
                      addon.color === "primary"
                        ? "bg-primary-700 hover:bg-primary-800 text-white shadow-lg shadow-primary-500/20"
                        : "bg-linear-to-r from-secondary-600 to-secondary-500 hover:opacity-90 text-white shadow-lg shadow-secondary-500/20"
                    }`}
                  >
                    {addon.cta.label}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-700 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary-600 rounded-full opacity-50" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-primary-800 rounded-full opacity-50" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Not sure which add-ons you need?
              </h2>
              <p className="text-primary-200 mb-8 text-sm leading-relaxed">
                Talk to our team and we will put together the perfect package for your event size, budget, and goals.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-4 rounded-2xl hover:bg-primary-50 transition-colors shadow-xl text-sm"
              >
                Talk to the Team
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}

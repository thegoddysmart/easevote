"use client";
import { useState } from "react";
import { Smartphone, Share2, Wallet } from "lucide-react";
import { russoOne } from "../ui/fonts";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 0,
      title: "Create",
      icon: Smartphone,
      desc: "Set up your event in minutes. Customize categories, nominees, and ticket types from your dashboard.",
      color: "bg-blue-100 text-blue-600",
      screenContent: (
        <div className="p-4 space-y-3">
          <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
            Upload Banner
          </div>
          <div className="space-y-2">
            <div className="h-10 bg-white border border-gray-200 rounded-lg"></div>
            <div className="h-10 bg-white border border-gray-200 rounded-lg"></div>
          </div>
          <div className="h-10 bg-magenta-600 rounded-lg w-full mt-4"></div>
        </div>
      ),
    },
    {
      id: 1,
      title: "Share",
      icon: Share2,
      desc: "Share your unique voting link via WhatsApp and social media to engage your audience instantly.",
      color: "bg-green-100 text-green-600",
      screenContent: (
        <div className="p-4 flex flex-col h-full items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white">
            <Share2 size={32} />
          </div>
          <h4 className="font-bold text-lg">Event Published!</h4>
          <div className="bg-gray-100 p-3 rounded-lg text-xs break-all text-gray-500 w-full">
            easevote.gh/e/awards-2025
          </div>
          <div className="flex gap-2 w-full">
            <div className="flex-1 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              WhatsApp
            </div>
            <div className="flex-1 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              Facebook
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Monetize",
      icon: Wallet,
      desc: "Track revenue in real-time. Receive payouts directly to your Mobile Money wallet or Bank Account.",
      color: "bg-yellow-100 text-yellow-600",
      screenContent: (
        <div className="p-4 space-y-4">
          <div className="bg-slate-900 text-white p-4 rounded-xl shadow-lg">
            <div className="text-xs text-gray-400">Total Revenue</div>
            <div className="text-2xl font-bold">GHS 12,450.00</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm p-2 bg-white border-b">
              <span>Ticket Sales</span>
              <span className="font-bold text-green-600">+ GHS 500</span>
            </div>
            <div className="flex justify-between text-sm p-2 bg-white border-b">
              <span>Voting Revenue</span>
              <span className="font-bold text-green-600">+ GHS 120</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className={`${russoOne.className} tracking-tight text-brand-deep text-3xl capitalize leading-none text-[35px] sm:text-[45px] lg:text-[50px] xl:text-[60px]`}
          >
            How It Works
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Launch your event and start earning in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Phone Mockup */}
          <div className="relative mx-auto lg:mx-0 order-2 lg:order-1">
            {/* Phone Frame */}
            <div className="relative w-[300px] h-[600px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-900 shadow-2xl mx-auto z-10 overflow-hidden ring-4 ring-gray-100">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-xl z-20"></div>

              {/* Screen Content */}
              <div className="w-full h-full bg-white pt-8 relative">
                {/* Status Bar */}
                <div className="absolute top-2 right-4 flex gap-1">
                  <div className="w-4 h-2 bg-slate-800 rounded-sm"></div>
                  <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
                </div>

                {/* Dynamic Content */}
                <div className="h-full transition-opacity duration-300">
                  {steps[activeStep].screenContent}
                </div>
              </div>
            </div>

            {/* Decorative blobs behind phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-magenta-200 to-blue-200 rounded-full blur-[80px] -z-10 opacity-60"></div>
          </div>

          {/* Right: Tabs */}
          <div className="space-y-6 order-1 lg:order-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`w-full text-left p-6 rounded-2xl transition-all duration-300 flex items-start gap-4 border-2 ${
                  activeStep === index
                    ? "border-brand-bright bg-brand-bright/1 shadow-lg scale-105"
                    : "border-transparent hover:bg-gray-50"
                }`}
              >
                <div className={`p-3 rounded-xl ${step.color}`}>
                  <step.icon size={24} />
                </div>
                <div>
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      activeStep === index ? "text-slate-900" : "text-slate-600"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

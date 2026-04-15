"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { VotingEvent } from "@/types";
import {
  User,
  Mail,
  Phone,
  Upload,
  CheckCircle,
  ArrowLeft,
  Instagram,
} from "lucide-react";

interface NominationFormProps {
  event: VotingEvent;
}

export function NominationFormClient({ event }: NominationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [nominationCode, setNominationCode] = useState("");

  const [formData, setFormData] = useState({
    category: "",
    fullName: "",
    stageName: "",
    bio: "",
    email: "",
    phone: "",
    socialHandle: "",
  });

  const categories = event.categories
    ? event.categories.map((c) => c.name)
    : ["Artist of the Year", "New Artist", "Song of the Year"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/nominate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          ...formData, // Spread form data
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || "Failed to submit nomination");
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();
      if (data.success && data.reference) {
        setNominationCode(data.reference);
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Nomination error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------- SUCCESS STATE ---------------- */
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} strokeWidth={3} />
          </div>

          <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">
            Nomination Filed!
          </h2>

          <p className="text-slate-500 mb-8">
            Your application for{" "}
            <span className="font-bold">{event.title}</span> has been received.
          </p>

          <div className="bg-magenta-50 border border-magenta-100 rounded-2xl p-6 mb-8">
            <p className="text-xs font-bold text-magenta-600 uppercase tracking-widest mb-2">
              Your Tracking Reference
            </p>
            <p className="text-3xl font-mono font-bold text-slate-900 tracking-wider">
              {nominationCode}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Keep this code safe. You will need it to track your status.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push(`/events/${event.eventCode}`)}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              Return to Event
            </button>
            <button className="w-full py-3 text-slate-500 font-bold hover:text-magenta-600 transition-colors">
              Download Receipt
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- FORM ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-primary-700 font-bold mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} /> Cancel Nomination
        </button>

        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-slate-900 text-white p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-magenta-500/20 rounded-full blur-[80px]"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-magenta-600/30 border border-magenta-500/30 text-magenta-200 text-xs font-bold uppercase mb-4">
                Nominations Open
              </div>
              <h1 className="text-3xl md:text-4xl text-secondary-700! font-display font-bold mb-2">
                File a Nomination
              </h1>
              <p className="text-white/70">{event.title}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
            {/* Step 1: Nominee Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900 border-b border-gray-100 pb-2">
                Nominee Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Category
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-magenta-500 bg-gray-50 focus:bg-white"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat, i) => (
                      <option key={i} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Stage Name / Group Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. King Promise"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-magenta-500 bg-gray-50 focus:bg-white"
                    value={formData.stageName}
                    onChange={(e) =>
                      setFormData({ ...formData, stageName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Full Legal Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-magenta-500 bg-gray-50 focus:bg-white"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Short Bio / Achievement Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-magenta-500 bg-gray-50 focus:bg-white resize-none"
                  placeholder="Tell us why this nominee deserves to win..."
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-magenta-500 hover:bg-magenta-50/50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-magenta-100 text-slate-400 group-hover:text-magenta-600">
                  <Upload size={20} />
                </div>
                <p className="font-bold text-slate-700">Upload Nominee Photo</p>
                <p className="text-xs text-slate-400 mt-1">
                  JPG or PNG, max 5MB. High quality preferred.
                </p>
              </div>
            </div>

            {/* Step 2: Contact Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900 border-b border-gray-100 pb-2">
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="email"
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-magenta-500 bg-gray-50 focus:bg-white"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="tel"
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-magenta-500 bg-gray-50 focus:bg-white"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Social Media Handle (IG/Twitter)
                </label>
                <div className="relative">
                  <Instagram
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-magenta-500 bg-gray-50 focus:bg-white"
                    placeholder="@handle"
                    value={formData.socialHandle}
                    onChange={(e) =>
                      setFormData({ ...formData, socialHandle: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-800 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-900 transition-all shadow-lg hover:shadow-primary-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? "Submitting..." : "Submit Nomination"}
              </button>
              <p className="text-center text-xs text-slate-400 mt-4">
                By submitting, you agree to the event&apos;s nomination rules
                and regulations.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

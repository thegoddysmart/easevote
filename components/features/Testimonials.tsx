import React from "react";
import { Play } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="py-24 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Featured Video Testimonial */}
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-black rounded-xl overflow-hidden aspect-video shadow-2xl">
              <img
                src="https://picsum.photos/seed/studio/800/450?grayscale"
                alt="Studio"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play size={32} className="text-white fill-white ml-1" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 p-6 w-full bg-linear-to-t from-black to-transparent">
                <p className="font-bold text-lg">
                  &ldquo;EaseVote handled our peak traffic perfectly.&rdquo;
                </p>
                <p className="text-sm text-gray-400">
                  Head of Tech, 3Music Awards
                </p>
              </div>
            </div>
          </div>

          {/* Review Cards */}
          <div className="space-y-6 text-white">
            <h2
              className="text-4xl font-display mb-8"
              style={{ color: "inherit" }}
            >
              What Our Organizers Say
            </h2>

            {[
              {
                name: "Kojo Manuel",
                role: "Event Host",
                text: "The real-time dashboard is a game changer. I could announce results live on stage without delays.",
                img: "https://picsum.photos/seed/kojo/100/100",
              },
              {
                name: "Sarah Antwi",
                role: "SRC President",
                text: "Voting was smooth for all 15,000 students. The USSD integration saved us.",
                img: "https://picsum.photos/seed/sarah/100/100",
              },
            ].map((review, i) => (
              <div
                key={i}
                className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-secondary-500 transition-colors"
              >
                <p className="text-gray-300 italic mb-4">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={review.img}
                    alt={review.name}
                    className="w-10 h-10 rounded-full border-2 border-secondary-500"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-secondary-100!">
                      {review.name}
                    </h4>
                    <p className="text-xs text-gray-500">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

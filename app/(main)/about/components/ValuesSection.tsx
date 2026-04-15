import { Lightbulb, Users, Heart, Search } from "lucide-react";
import Image from "next/image";

export default function ValuesSection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl font-bold text-gray-900">Our Values</h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Our values guide everything we do, from platform innovation to
          customer success.
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Background connector lines */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-primary-100 z-0"></div>
        <div className="hidden md:block absolute left-1/2 top-0 h-full w-[1px] bg-primary-100 z-0"></div>

        {/* Center Icon */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-16 h-16 bg-primary-700 rounded-full shadow-lg border-4 border-white">
          <div className="relative w-16 h-16">
            <Image
              src="/easevote.svg"
              alt="EaseVote Logo"
              fill
              className="object-contain"
              priority
            />
          </div>{" "}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 md:gap-y-24 relative z-0">
          {/* Top Left */}
          <div className="flex flex-col items-center text-center p-6 bg-white/80 backdrop-blur-sm md:bg-transparent rounded-2xl md:translate-x-4 md:translate-y-4">
            <div className="w-14 h-14 rounded-full bg-cyan-50 flex items-center justify-center mb-4 border border-cyan-100">
              <Lightbulb className="w-7 h-7 text-cyan-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Reliability
            </h3>
            <p className="text-sm text-gray-500 max-w-xs">
              Our platform is built on robust, secure infrastructure that
              ensures every vote is counted accurately and every ticket is
              validated instantly.
            </p>
          </div>

          {/* Top Right */}
          <div className="flex flex-col items-center text-center p-6 bg-white/80 backdrop-blur-sm md:bg-transparent rounded-2xl md:-translate-x-4 md:translate-y-4">
            <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center mb-4 border border-purple-100">
              <Search className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Ease Of Use
            </h3>
            <p className="text-sm text-gray-500 max-w-xs">
              True to our motto, &quot;Simple And Easy,&quot; we prioritize user
              experience above all else. We design our interfaces to be
              intuitive for everyone, regardless of their technical expertise.
            </p>
          </div>

          {/* Bottom Left */}
          <div className="flex flex-col items-center text-center p-6 bg-white/80 backdrop-blur-sm md:bg-transparent rounded-2xl md:translate-x-4 md:-translate-y-4">
            <div className="w-14 h-14 rounded-full bg-pink-50 flex items-center justify-center mb-4 border border-pink-100">
              <Users className="w-7 h-7 text-pink-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Effectiveness
            </h3>
            <p className="text-sm text-gray-500 max-w-xs">
              We focus on delivering tangible results. Our tools are designed to
              maximize voter turnout and ticket sales through streamlined
              processes and instant accessibility.
            </p>
          </div>

          {/* Bottom Right */}
          <div className="flex flex-col items-center text-center p-6 bg-white/80 backdrop-blur-sm md:bg-transparent rounded-2xl md:-translate-x-4 md:-translate-y-4">
            <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mb-4 border border-orange-100">
              <Heart className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Affordability
            </h3>
            <p className="text-sm text-gray-500 max-w-xs">
              We believe that world-class event technology should be accessible
              to everyone in Ghana. We offer competitive pricing structures and
              transparent fees without compromising on quality or security.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

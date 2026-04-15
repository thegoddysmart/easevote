import {
  Target,
  Eye,
  BookOpen,
  BarChart3,
  PieChart,
  Activity,
  ShieldCheck,
} from "lucide-react";

export default function BrandHeart() {
  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          EaseVote Ghana is an e-voting and event management platform.
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Content */}
        <div className="space-y-10">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-pink-500" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Our Story
              </h3>
              <p className="text-gray-600 leading-relaxed">
                At Ease Vote, we are committed to empowering event organizers to
                create and manage their events effortlessly while providing a
                seamless digital experience for event organizers and
                participants to bring events to life easily. <br></br>Our
                primary objective is to streamline and expedite the e-voting
                process, thereby ensuring efficiency and reliability for both
                event organizers and participants. We are committed to
                delivering a seamless and hassle-free experience throughout the
                event. Our unwavering commitment is to meet the needs of all
                consumers and to make their events exemplary.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To provide businesses and organizations with the tools to
                digitize their operations, connecting them with their target
                audience through a secure, reliable, and convenient medium.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <Eye className="w-6 h-6 text-amber-500" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To become the premier global platform for digital event
                management, setting the standard for seamless, secure, and
                inclusive engagement between organizers and participants.
                Through our cutting-edge technology and unwavering commitment to
                excellence, we envision a future where every event, big or
                small, is executed flawlessly and enjoyed by all.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-primary-600" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Our Tagline
              </h3>
              <p className="text-gray-600 leading-relaxed">Simple and Easy</p>
            </div>
          </div>
        </div>

        {/* Right Column: Dashboard Visual */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-200 to-indigo-200 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-6">
            {/* Fake Dashboard Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="font-semibold text-gray-900">Dashboard</div>
              <div className="flex gap-2">
                <div className="h-2 w-2 rounded-full bg-red-400"></div>
                <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
              </div>
            </div>

            {/* Fake Dashboard Content */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                {
                  label: "Total Sales",
                  val: "178+",
                  color: "text-indigo-600",
                  bg: "bg-indigo-50",
                },
                {
                  label: "New Users",
                  val: "20+",
                  color: "text-green-600",
                  bg: "bg-green-50",
                },
                {
                  label: "Products",
                  val: "190+",
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                },
              ].map((stat, i) => (
                <div key={i} className={`${stat.bg} rounded-lg p-3`}>
                  <div className={`text-sm font-bold ${stat.color}`}>
                    {stat.val}
                  </div>
                  <div className="text-[10px] text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Fake Chart Area */}
            <div className="h-48 bg-gray-50 rounded-lg relative overflow-hidden flex items-center justify-center mb-6">
              {/* Decorative chart bars */}
              <div className="flex items-end gap-2 h-32 px-4 w-full justify-between">
                {[40, 60, 45, 70, 50, 80, 65, 90, 75, 55, 60, 40].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="w-full bg-indigo-200 rounded-t-sm"
                      style={{ height: `${h}%`, opacity: 0.5 + i / 24 }}
                    ></div>
                  )
                )}
              </div>
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-12 w-12 bg-gray-900 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform">
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
                </div>
              </div>
            </div>

            {/* Fake List Items */}
            <div className="space-y-3">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-50 bg-gray-50/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                    <div className="h-2 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-2 w-12 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

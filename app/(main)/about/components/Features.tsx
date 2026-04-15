import {
  ShieldCheck,
  BarChart3,
  Users,
  BadgeCheck,
  Lightbulb,
  BadgeDollarSign,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Customer-Centric Excellence",
      desc: "We prioritize clients' needs and deliver exceptional customer service at every stage of the event journey.",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      iconUrl: "https://picsum.photos/id/132/50/50", // Placeholder for custom icon image
    },
    {
      title: "24/7 Technical Support",
      desc: "Access round-the-clock technical assistance to ensure smooth, uninterrupted operations.",
      icon: ShieldCheck,
      color: "bg-purple-100 text-purple-600",
      iconUrl: "https://picsum.photos/id/119/50/50",
    },
    {
      title: "Teamwork & Innovation",
      desc: "We embrace collaboration, innovative thinking, and efficient processes to deliver solutions that drive success.",
      icon: Lightbulb,
      color: "bg-pink-100 text-pink-600",
      iconUrl: "https://picsum.photos/id/180/50/50",
    },
    {
      title: "Best Pricing",
      desc: "Enjoy affordable and competitive pricing without compromising on quality or reliability.",
      icon: BadgeDollarSign,
      color: "bg-orange-100 text-orange-600",
      iconUrl: "https://picsum.photos/id/201/50/50",
    },
  ];

  return (
    <section className="py-20 bg-gray-50/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Text Content */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              Why organizers trust our platform for success.
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              At EaseVote, we are not just a service provider; we are your
              partner in success, working tirelessly to ensure that every event
              is a memorable and rewarding experience for all involved.
            </p>
            <div>
              <a
                href="tel:0550073142"
                className="px-6 py-3 bg-white border border-slate-200 text-slate-800 font-semibold rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center gap-2 max-w-max"
              >
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-500 to-secondary-500">
                  Contact Sales Team
                </span>
              </a>
            </div>
          </div>

          {/* Right Column: Feature Cards Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="mb-4">
                    {/* Using icon component but styled like an image placeholder */}
                    <div
                      className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center`}
                    >
                      <feature.icon size={24} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

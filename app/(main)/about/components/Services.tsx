import React from "react";
import { Smartphone, Calendar, MessageSquare, Ticket } from "lucide-react";

export default function Services() {
  const services = [
    {
      title: "E-Voting Platform",
      desc: "Harness the power of our reliable and quick e-voting platform, complete with individual codes for contestants and multiple voting mediums including USSD code and website.",
      icon: Smartphone,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Event Planning and Management",
      desc: "Collaborate with our experienced team to plan and execute successful events tailored to your specific needs and audience.",
      icon: Calendar,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Event Consultation",
      desc: "Tap into our expertise for strategic event consultation and guidance to ensure every detail is perfect.",
      icon: MessageSquare,
      color: "bg-pink-100 text-pink-600",
    },
    {
      title: "Event Ticketing",
      desc: "We provide comprehensive e-ticketing services for all events, making entry management seamless and secure.",
      icon: Ticket,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <section className="py-20 bg-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-white! mb-4 uppercase tracking-wide">
            What We Do (Our Services)
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Secure your spot at the hottest concerts and shows in Ghana. Buy
            Your Tickets easily and experience unforgettable live events!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-6`}
              >
                <service.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {service.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

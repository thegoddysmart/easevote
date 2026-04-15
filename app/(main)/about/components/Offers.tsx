import React from "react";
import Link from "next/link";
import { Users, Briefcase, Check } from "lucide-react";

export default function Offers() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-wide">
            What We Offer You
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Whether you are a participant or an organizer, our platform provides
            dedicated tools to enhance your experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* For Users Card */}
          <div className="bg-linear-to-b from-primary-50 to-white p-8 rounded-3xl border border-primary-100 shadow-sm flex flex-col">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-primary-700 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                <Users size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">For Users</h3>
            </div>
            <p className="text-sm font-semibold text-primary-700 mb-6 uppercase tracking-wider">
              Voters & Nominees
            </p>

            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-primary-500 mr-3 mt-0.5 shrink-0" />
                <span className="text-slate-700 text-sm">
                  <strong className="text-slate-900 block mb-1">
                    Secure Voting Experience
                  </strong>
                  Fast and reliable e-voting via USSD and website. We accept
                  MTN, Telecel, AirtelTigo, Visa, and Master Card.
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-primary-500 mr-3 mt-0.5 shrink-0" />
                <span className="text-slate-700 text-sm">
                  <strong className="text-slate-900 block mb-1">
                    Unique Voting Codes
                  </strong>
                  Each contestant receives a special code for easy
                  identification.
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-primary-500 mr-3 mt-0.5 shrink-0" />
                <span className="text-slate-700 text-sm">
                  <strong className="text-slate-900 block mb-1">
                    Nominations
                  </strong>
                  Participants can submit nominations for their preferred
                  categories effortlessly.
                </span>
              </li>
            </ul>

            <Link
              href="/events/voting"
              className="block w-full text-center py-3 rounded-xl bg-primary-600 text-white! font-bold hover:bg-primary-800 transition-colors shadow-lg shadow-primary-500/20"
            >
              Vote Now
            </Link>
          </div>

          {/* For Organizers Card */}
          <div className="bg-linear-to-b from-secondary-50 to-white p-8 rounded-3xl border border-secondary-100 shadow-sm flex flex-col">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-secondary-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-secondary-500/30">
                <Briefcase size={24} />
              </div>
              <h3 className="text-2xl font-bold text-secondary-700!">
                For Organizers
              </h3>
            </div>
            <p className="text-sm font-semibold text-secondary-600 mb-6 uppercase tracking-wider">
              Event Managers
            </p>

            <ul className="space-y-4 mb-8 grow">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-secondary-500 mr-3 mt-0.5 shrink-0" />
                <span className="text-slate-700 text-sm">
                  <strong className="text-slate-900 block mb-1">
                    Admin Access
                  </strong>
                  Full control to manage votes, monitor transactions, and
                  view/toggle results.
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-secondary-500 mr-3 mt-0.5 shrink-0" />
                <span className="text-slate-700 text-sm">
                  <strong className="text-slate-900 block mb-1">
                    Instant Withdrawal
                  </strong>
                  Withdraw funds during the event without any charges.
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-secondary-500 mr-3 mt-0.5 shrink-0" />
                <span className="text-slate-700 text-sm">
                  <strong className="text-slate-900 block mb-1">
                    Nomination Screening
                  </strong>
                  Review and approve or reject nominees per category.
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-secondary-500 mr-3 mt-0.5 shrink-0" />
                <span className="text-slate-700 text-sm">
                  <strong className="text-slate-900 block mb-1">
                    Free Graphic Design
                  </strong>
                  We design nominee flyers with codes for free.
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-secondary-500 mr-3 mt-0.5 shrink-0" />
                <span className="text-slate-700 text-sm">
                  <strong className="text-slate-900 block mb-1">
                    Event Planning Support
                  </strong>
                  We help plan your event if needed or requested.
                </span>
              </li>
            </ul>

            <Link
              href="/sign-up"
              className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-secondary-700 to-pink-500 text-white! font-bold hover:opacity-90 transition-opacity shadow-lg shadow-secondary-500/20"
            >
              Create Events
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

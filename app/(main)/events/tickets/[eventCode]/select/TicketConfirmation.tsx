import React from "react";
import { CheckCircle, Download, Share2, Calendar, MapPin } from "lucide-react";
import { TicketingEvent } from "@/types";

interface TicketConfirmationProps {
  transactionId: string;
  onHome: () => void;
  event: TicketingEvent;
}

export const TicketConfirmation: React.FC<TicketConfirmationProps> = ({
  transactionId,
  onHome,
  event,
}) => {
  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-20 px-4 flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30 animate-in zoom-in">
          <CheckCircle size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          You&apos;re Going!
        </h1>
        <p className="text-slate-400">Transaction ID: {transactionId}</p>
      </div>

      {/* Digital Ticket Stub */}
      <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden relative shadow-2xl animate-in slide-in-from-bottom-8 duration-700">
        {/* Top Section (Event Image) */}
        <div className="h-48 bg-slate-800 relative">
          <img
            src={event.image}
            className="w-full h-full object-cover opacity-80"
            alt={event.title}
          />
          <div className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
            VIP Access
          </div>
        </div>

        {/* Middle Section (Details) */}
        <div className="p-8 pb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">
            {event.title}
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Hosted by {event.organizer}
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg text-magenta-600">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">
                  Date & Time
                </p>
                <p className="font-bold text-slate-900">
                  {event.date} • {event.time}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg text-magenta-600">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">
                  Venue
                </p>
                <p className="font-bold text-slate-900">{event.venue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tear Line */}
        <div className="relative">
          <div className="absolute -top-3 left-0 w-4 h-6 bg-slate-900 rounded-r-full"></div>
          <div className="absolute -top-3 right-0 w-4 h-6 bg-slate-900 rounded-l-full"></div>
          <div className="border-t-2 border-dashed border-gray-300 w-full"></div>
        </div>

        {/* Bottom Section (QR) */}
        <div className="p-8 bg-gray-50 flex flex-col items-center">
          <div className="w-32 h-32 bg-white p-2 rounded-xl mb-4">
            {/* Placeholder QR */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${transactionId}`}
              alt="QR Code"
              className="w-full h-full"
            />
          </div>
          <p className="text-xs text-slate-400 text-center">
            Scan at the gate for entry
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-sm">
        <button className="flex-1 bg-magenta-600 text-white py-3 rounded-xl font-bold hover:bg-magenta-700 transition-colors flex items-center justify-center gap-2">
          <Download size={18} /> Save Ticket
        </button>
        <button className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
          <Share2 size={18} /> Share
        </button>
      </div>

      <button
        onClick={onHome}
        className="text-slate-500 font-bold mt-8 hover:text-white transition-colors"
      >
        Return to Home
      </button>
    </div>
  );
};

import { MessageCircle, ArrowRight, Mail } from "lucide-react";
import { russoOne } from "../ui/fonts";

export default function Newsletter() {
  return (
    <section className="relative pt-20 pb-20">
      {/* Visual Bridge: Split Background */}
      {/* Top half matches the previous section (Testimonials - slate-900) */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-slate-900 z-0"></div>
      {/* Bottom half matches the next section (Footer - magenta-900) */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-magenta-900 z-0"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-brand-bright rounded-[3rem] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-black/25">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-magenta-900 opacity-20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2
              className={`${russoOne.className} tracking-tight text-3xl text-secondary-200! capitalize leading-none text-[35px] sm:text-[45px] lg:text-[50px] xl:text-[60px]`}
            >
              Don&apos;t miss the next <br />
              <span className="text-magenta-900 bg-white/20 px-8 rounded-full inline-block mt-2">
                Big Event
              </span>
            </h2>

            <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed">
              Join 50,000+ Ghanaians getting early bird tickets, live voting
              updates, and exclusive event news delivered straight to their
              inbox or WhatsApp.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <div className="relative w-full sm:w-96">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-bright"
                  size={20}
                />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-6 py-4 rounded-full bg-white text-brand-bright placeholder-magenta-900/40 font-medium focus:outline-none focus:ring-4 focus:ring-magenta-900/20 shadow-sm"
                />
              </div>
              <button className="w-full sm:w-auto bg-brand-deep hover:bg-magenta-800 text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105 group">
                Subscribe
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>

            <div className="pt-6 border-t border-white/20 mt-8">
              <button className="inline-flex items-center gap-2 text-white/80 hover:text-white font-semibold transition-colors text-sm">
                <MessageCircle size={18} className="text-[#25D366]" />
                Prefer WhatsApp? Click to join our channel
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

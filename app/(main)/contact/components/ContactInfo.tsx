import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import SocialIcons from "@/components/ui/SocialIcons";

export default function ContactInfo() {
  return (
    <div className="space-y-10">
      {/* Intro */}
      <div>
        <h3 className="text-2xl font-display font-bold text-slate-900 mb-4">
          Chat with us
        </h3>
        <p className="text-slate-600 mb-8">
          Speak to our friendly team via live chat, email, or phone. We are
          available Mon-Fri, 8am to 5pm GMT.
        </p>
      </div>

      {/* Info Cards */}
      <div className="space-y-6">
        {/* Email */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-magenta-50 rounded-full flex items-center justify-center text-magenta-600 shrink-0">
            <Mail size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-lg">Email Us</h4>
            <p className="text-slate-500 text-sm mb-2">
              For general enquiries and support.
            </p>
            <a
              href="mailto:info@easevotegh.com"
              className="text-magenta-600 font-bold hover:underline"
            >
              info@easevotegh.com
            </a>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
            <Phone size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-lg">Call Us</h4>
            <p className="text-slate-500 text-sm mb-2">
              Mon-Fri from 8am to 5pm.
            </p>
            <a
              href="tel:+233554440813"
              className="text-slate-900 font-bold hover:text-magenta-600 transition-colors block"
            >
              +233 554 440 813
            </a>
            <a
              href="tel:+233559540992"
              className="text-slate-900 font-bold hover:text-magenta-600 transition-colors block"
            >
              +233 559 540 992
            </a>
          </div>
        </div>

        {/* Office */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0">
            <MapPin size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-lg">Visit Us</h4>
            <p className="text-slate-500 text-sm mb-2">
              Come say hello at our HQ.
            </p>
            <p className="text-slate-700 font-medium leading-relaxed">
              EaseVote Ghana,
              <br />
              Accra, Kumasi
              <br />
              Ghana.
            </p>
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="pt-8 border-t border-gray-100">
        <h4 className="font-bold text-slate-900 mb-4">
          Follow us on Social Media
        </h4>
        <div className="flex gap-4">
          {/* Replaced manual implementation with shared component */}
          <SocialIcons />
        </div>
      </div>
    </div>
  );
}

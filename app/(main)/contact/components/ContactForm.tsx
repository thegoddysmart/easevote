import { MessageSquare, Send } from "lucide-react";

export default function ContactForm() {
  return (
    <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-magenta-100 text-magenta-700 rounded-lg">
          <MessageSquare size={20} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Send a Message</h3>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              First Name
            </label>
            <input
              type="text"
              placeholder="Kwame"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-magenta-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Mensah"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-magenta-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">
            Email Address
          </label>
          <input
            type="email"
            placeholder="kwame@example.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-magenta-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Subject</label>
          <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-magenta-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all">
            <option>General Enquiry</option>
            <option>Technical Support</option>
            <option>Event Organization</option>
            <option>Sales & Billing</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Message</label>
          <textarea
            rows={5}
            placeholder="How can we help you today?"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-magenta-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all resize-none"
          ></textarea>
        </div>

        <button className="w-full bg-secondary-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-900 transition-all hover:shadow-lg hover:shadow-primary-900/20 flex items-center justify-center gap-2 group">
          Send Message{" "}
          <Send
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </form>
    </div>
  );
}

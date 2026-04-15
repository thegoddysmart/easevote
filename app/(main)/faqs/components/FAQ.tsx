import { createServerApiClient } from "@/lib/api-client";
import { ChevronDown } from "lucide-react";

export default async function Faq() {
  const apiClient = createServerApiClient();
  const faqs = await apiClient.get<any[]>("/cms/faqs").catch(() => []);

  if (!faqs || faqs.length === 0) {
    return (
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <p className="text-center text-gray-500">No FAQs available at the moment.</p>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 max-w-3xl mx-auto">
      <div className="space-y-4">
        {faqs.map((faq: { id: string; question: string; answer: string }) => (
          <details
            key={faq.id}
            className="group border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden"
          >
            <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
              <span>{faq.question}</span>
              <ChevronDown
                size={20}
                className="text-gray-400 transition-transform group-open:rotate-180"
              />
            </summary>
            <div className="px-6 pb-5 pt-1 text-gray-600 text-sm leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

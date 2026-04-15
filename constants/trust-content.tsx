// constants/trust-content.tsx

import { FileText, Lock, Cookie } from "lucide-react";
import type { ReactNode } from "react";

// Type for each section
export interface TrustSection {
  title: string;
  icon: ReactNode;
  humanSummary: Array<{
    title: string;
    desc: string;
  }>;
  legalText: string;
}

// Main content object
export const trustContent: Record<
  "terms" | "privacy" | "cookies",
  TrustSection
> = {
  terms: {
    title: "The Rules of Engagement",
    icon: <FileText size={32} className="text-magenta-500" />,
    humanSummary: [
      {
        title: "Voting is Final",
        desc: "Once you cast a vote, it cannot be refunded or changed. Double-check before you click!",
      },
      {
        title: "We provide the Tech",
        desc: "EaseVote powers the platform. The Event Organizer is responsible for the actual event, prizes, and cancellations.",
      },
      {
        title: "Instant Payments",
        desc: "Payments are processed immediately via Mobile Money or Card.",
      },
    ],
    legalText: `1. ACCEPTANCE OF TERMS
By accessing and using EaseVote Ghana, you accept and agree to be bound by the terms and provision of this agreement.

2. VOTING & TRANSACTIONS
2.1 All votes cast on the platform are final and non-refundable.
2.2 EaseVote Ghana acts as an agent for Event Organizers. We are not responsible for the fulfillment of awards, delivery of prizes, or event management.
2.3 Any disputes regarding event legitimacy must be directed to the Event Organizer.

3. LIMITATION OF LIABILITY
In no event shall EaseVote be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on EaseVote's website.`,
  },

  privacy: {
    title: "Your Data is Safe",
    icon: <Lock size={32} className="text-blue-500" />,
    humanSummary: [
      {
        title: "Your Number",
        desc: "We only collect your phone number to process MoMo payments and verify you are a real human voter.",
      },
      {
        title: "No Selling",
        desc: "We absolutely do not sell your personal data to third parties.",
      },
      {
        title: "Organizer Access",
        desc: "Event Organizers get your name for guest lists, but we protect your financial details.",
      },
    ],
    legalText: `1. DATA COLLECTION
We collect information that you provide directly to us, such as your MSISDN (Phone Number), Device ID, and Transaction Logs.

2. USE OF INFORMATION
We use the information we collect to:
- Process your votes and ticket purchases.
- Send you technical notices, updates, and support messages.
- Detect and prevent fraudulent transactions.

3. DATA SHARING
We do not share your personal information with third parties except as described in this policy (e.g., with Payment Processors like MTN/Telecel to facilitate transactions).`,
  },

  cookies: {
    title: "Tech that makes it work",
    icon: <Cookie size={32} className="text-yellow-500" />,
    humanSummary: [
      {
        title: "Strictly Necessary",
        desc: "These keep you logged in so you don't lose your ticket in the cart.",
      },
      {
        title: "Performance",
        desc: "These help us see if the site is slow during big voting events (like the Miss Malaika Finale).",
      },
      {
        title: "Marketing (Optional)",
        desc: "These help us show you other events you might like based on your history.",
      },
    ],
    legalText: `1. WHAT ARE COOKIES
Cookies are small data files stored on your hard drive or in your device memory that help us improve our Services and your experience.

2. TYPES OF COOKIES
- Session Cookies: We use these to keep you logged in.
- Analytics Cookies: We use these to understand how users interact with our services.

3. MANAGING COOKIES
Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove or reject browser cookies.`,
  },
};

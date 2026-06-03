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
    title: "Terms of Service",
    icon: <FileText size={32} className="text-primary-700" />,
    humanSummary: [
      {
        title: "Voting Finality",
        desc: "All votes cast on the platform are final and non-refundable. Please review your selection before confirming.",
      },
      {
        title: "Platform Role",
        desc: "EaseVote provides the technological infrastructure. The respective Event Organizer remains responsible for event execution and prizes.",
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
    title: "Privacy Policy",
    icon: <Lock size={32} className="text-primary-700" />,
    humanSummary: [
      {
        title: "Data Collection",
        desc: "We collect only necessary information, such as your phone number, to securely process payments and verify voter authenticity.",
      },
      {
        title: "Data Protection",
        desc: "Your personal information is securely stored. We strictly do not sell or distribute your data to third-party marketers.",
      },
      {
        title: "Organizer Visibility",
        desc: "Event Organizers receive basic attendee information for guest management. Your sensitive financial details are never shared.",
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
    title: "Cookie Policy",
    icon: <Cookie size={32} className="text-primary-700" />,
    humanSummary: [
      {
        title: "Strictly Necessary",
        desc: "Essential cookies required for authentication, maintaining session integrity, and secure ticket processing.",
      },
      {
        title: "Performance & Analytics",
        desc: "Cookies utilized to monitor platform load and optimize performance during high-traffic voting events.",
      },
      {
        title: "Functional",
        desc: "Cookies used to remember your preferences and provide a tailored platform experience.",
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

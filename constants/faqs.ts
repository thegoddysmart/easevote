import { FAQItem } from "@/types";

export const faqData: FAQItem[] = [
  {
    id: "1",
    category: "General",
    question: "What is EaseVote Ghana?",
    answer:
      "EaseVote Ghana is a premier voting and ticketing platform designed for awards schemes, pageants, and school elections. We provide secure, real-time voting via USSD and Web, along with seamless event ticketing.",
  },
  {
    id: "2",
    category: "Voting",
    question: "How do I vote via USSD?",
    answer:
      'Dial *920*195# on any network. Select "Vote", enter the Nominee Code, enter the number of votes you wish to cast, and confirm payment with your Mobile Money PIN.',
  },
  {
    id: "3",
    category: "Voting",
    question: "Can I vote multiple times?",
    answer:
      "Yes! You can cast as many votes as you like in a single transaction or multiple transactions, depending on the rules set by the event organizer.",
  },
  {
    id: "4",
    category: "Payments",
    question: "My money was deducted but votes were not counted.",
    answer:
      "This is rare, but if it happens, please contact our support team immediately with your Transaction ID. We will verify the payment and manually credit the votes or issue a refund within 24 hours.",
  },
  {
    id: "5",
    category: "Ticketing",
    question: "How do I receive my ticket?",
    answer:
      "After a successful payment, your ticket (QR Code) is sent instantly via SMS and Email. You can also download it directly from the confirmation page.",
  },
  {
    id: "6",
    category: "Organizing",
    question: "How do I create an event?",
    answer:
      'Click "Create Event" on the homepage, sign up for an organizer account, and follow the setup wizard. You can go live in under 15 minutes!',
  },
  {
    id: "7",
    category: "Voting",
    question: "What should I do if my votes are not showing?",
    answer:
      "Please wait until the end of the day; all votes that have not yet been reflected will be processed. Alternatively, you can contact us with your Reference ID to confirm your votes via our official email info@easevotegh.com.",
  },
  {
    id: "8",
    category: "Voting",
    question: "How can we ensure that the results are accurate?",
    answer:
      "The system automatically tallies the results, eliminating any manual intervention.",
  },
  {
    id: "9",
    category: "General",
    question: "What support options are available?",
    answer:
      "Our team provides live chat, email support, onboarding assistance, and optional training sessions.",
  },
  {
    id: "10",
    category: "General",
    question: "How secure is EaseVote?",
    answer:
      "Security is our top priority at EaseVote. We utilise end-to-end encryption, secure user authentication, and tamper-proof audit trails to guarantee that votes are confidential, authentic, and unalterable.",
  },
  {
    id: "11",
    category: "Voting",
    question: "Can voting be done only through the website?",
    answer:
      "No, EaseVote allows voting through both the website and USSD by dialling *920*195#.",
  },
  {
    id: "12",
    category: "Organizing",
    question: "What happens if organizers lose their login details?",
    answer:
      "Administrators can safely resend login details without compromising security.",
  },
  {
    id: "13",
    category: "Organizing",
    question: "Can I track voter participation?",
    answer: "Yes. Admins can monitor voter turnout in real time",
  },
  {
    id: "14",
    category: "Organizing",
    question: "Can nomination flyers be designed for our event?",
    answer:
      "Yes, EaseVote now designs nomination flyers as well as individual nominee’s flyers free of charge.",
  },
];

import { BlogPost } from "../types";

// Mock Data
export const mockPosts: BlogPost[] = [
  {
    id: "1",
    slug: "optimizing-awards-voting",
    title: "How to Organize a Viral Awards Scheme in 2025",
    excerpt:
      "Discover the secrets behind Ghana's biggest award shows. From category selection to real-time voting engagement strategies.",
    content: "", // Content is loaded in the single post view
    author: {
      name: "Sarah Osei",
      role: "Event Strategist",
      avatar: "https://picsum.photos/seed/sarah/100/100",
    },
    date: "Oct 12, 2024",
    category: "Event Tips",
    image: "https://picsum.photos/seed/awards/800/600",
    readTime: "5 min read",
  },
  {
    id: "2",
    slug: "ussd-vs-web-voting",
    title: "USSD vs. Web Voting: Which Drives More Revenue?",
    excerpt:
      "We analyzed data from 500+ Ghanaian events. The answer depends heavily on your target audience demographics.",
    content: "",
    author: {
      name: "Kofi Mensah",
      role: "Data Analyst",
      avatar: "https://picsum.photos/seed/kofi/100/100",
    },
    date: "Sep 28, 2024",
    category: "Case Studies",
    image: "https://picsum.photos/seed/tech/800/600",
    readTime: "8 min read",
  },
  {
    id: "3",
    slug: "student-elections-security",
    title: "Securing Campus Elections: Lessons from Legon SRC",
    excerpt:
      "How we prevented voter fraud and ensured 100% uptime during the most contested student election of the year.",
    content: "",
    author: {
      name: "Emmanuel Darko",
      role: "CTO, EaseVote",
      avatar: "https://picsum.photos/seed/emmanuel/100/100",
    },
    date: "Sep 15, 2024",
    category: "Security",
    image: "https://picsum.photos/seed/campus/800/600",
    readTime: "6 min read",
  },
  {
    id: "4",
    slug: "monetizing-events",
    title: "5 Ways to Monetize Your Free Event",
    excerpt:
      "Running a free concert? Here is how to use voting mechanics and premium ticketing tiers to generate revenue.",
    content: "",
    author: {
      name: "Sarah Osei",
      role: "Event Strategist",
      avatar: "https://picsum.photos/seed/sarah/100/100",
    },
    date: "Aug 30, 2024",
    category: "Event Tips",
    image: "https://picsum.photos/seed/money/800/600",
    readTime: "4 min read",
  },
  {
    id: "5",
    slug: "future-of-ticketing",
    title: "The Future of Ticketing is NFT (Maybe?)",
    excerpt:
      "Exploring the potential of blockchain in preventing ticket scalping in the Ghanaian concert market.",
    content: "",
    author: {
      name: "Kofi Mensah",
      role: "Data Analyst",
      avatar: "https://picsum.photos/seed/kofi/100/100",
    },
    date: "Aug 10, 2024",
    category: "Tech Trends",
    image: "https://picsum.photos/seed/blockchain/800/600",
    readTime: "7 min read",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// API Response wrappers
// ─────────────────────────────────────────────────────────────────────────────

/** Standard backend envelope: { success, data, message? } */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

/** Paginated list response */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// User & Auth
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "ORGANIZER";
export type UserStatus = "ACTIVE" | "SUSPENDED" | "PENDING";

export interface User {
  id: string;
  _id?: string;
  email: string;
  name?: string;
  fullName?: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  profileImage?: string;
  organizerId?: string;
  createdAt: string;
  updatedAt?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Organizer
// ─────────────────────────────────────────────────────────────────────────────

export type OrganizerStatus = "ACTIVE" | "SUSPENDED" | "PENDING" | "VERIFIED";

export interface Organizer {
  id: string;
  _id?: string;
  businessName: string;
  email: string;
  phone?: string;
  status: OrganizerStatus;
  avatar?: string;
  website?: string;
  description?: string;
  totalEvents?: number;
  totalRevenue?: number;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Transaction / Purchase — full backend shape
// ─────────────────────────────────────────────────────────────────────────────

export type TransactionStatus = "PENDING" | "SUCCESS" | "FAILED" | "COMPLETED" | "REFUNDED";
export type PaymentMethod = "PAYSTACK" | "APPSN" | "MOBILE_MONEY" | string;

export interface TransactionMetadata {
  candidateName?: string;
  candidateCode?: string;
  eventName?: string;
  eventCode?: string;
  categoryName?: string;
  quantity?: number;
  ticketType?: string;
  ticketName?: string;
  [key: string]: unknown;
}

export interface Transaction {
  id: string;
  _id?: string;
  reference: string;
  amount: number;
  status: TransactionStatus;
  paymentMethod?: PaymentMethod;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  eventCode?: string;
  organizerId?: string;
  metadata?: TransactionMetadata;
  createdAt: string;
  updatedAt?: string;
}

/** @deprecated use Transaction */
export type Purchase = Transaction;

// ─────────────────────────────────────────────────────────────────────────────
// Platform Stats (Super Admin dashboard)
// ─────────────────────────────────────────────────────────────────────────────

export interface PlatformStats {
  totalUsers: number;
  totalOrganizers: number;
  totalEvents: number;
  activeEvents: number;
  totalRevenue: number;
  totalVotes: number;
  ticketsSold: number;
  pendingPayouts: number;
}

export interface RevenueDataPoint {
  name: string;   // Month abbreviation e.g. "Jan"
  revenue: number;
}

export interface EventTypeDataPoint {
  name: string;
  value: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Existing types below
// ─────────────────────────────────────────────────────────────────────────────

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
}

export interface Event {
  id: string;
  title: string;
  category:
    | "Awards"
    | "Pageantry"
    | "School"
    | "Concert"
    | "Sports"
    | "Tech"
    | "Lifestyle"
    | "Education"
    | "Corporate"
    | "Theater";
  image: string;
  date: string;
  votes?: number;
  status:
    | "Live"
    | "Upcoming"
    | "Ended"
    | "LIVE"
    | "PUBLISHED"
    | "APPROVED"
    | "DRAFT"
    | "PENDING_REVIEW"
    | "PAUSED"
    | "CANCELLED"
    | "ARCHIVED";
  costPerVote?: number; // Price per single vote
  minVotesPerPurchase?: number; // Minimum votes required in one transaction
  maxVotesPerPurchase?: number; // Maximum votes allowed in one transaction (optional)
  location?: string;
  eventCode?: string;
  description?: string;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  helpful?: number;
}

export interface VideoGuide {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  category: string;
  image: string;
  readTime: string;
}

export interface Candidate {
  id: string;
  _id?: string;
  name: string;
  image: string;
  code: string;
  category?: string;
  categoryId?: string;
  voteCount?: number;
  votes?: number;
}

export interface Category {
  id: string;
  name: string;
  candidates: Candidate[];
  totalVotes?: number;
}

export interface VotingEvent extends Event {
  eventCode: string;
  organizer: string;
  description: string;
  categories: Category[];
  totalVotes: number;
  allowPublicNominations?: boolean;
  isVotingOpen?: boolean;
  timelineEnd?: string | null;
  phase?: string;
  showLiveResults?: boolean;
  showVoteCount?: boolean;
  nominationStartsAt?: string | null;
  nominationEndsAt?: string | null;
  votingStartsAt?: string | null;
  votingEndsAt?: string | null;
  nominationStartTime?: string | null;
  nominationEndTime?: string | null;
  votingStartTime?: string | null;
  votingEndTime?: string | null;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  available: number;
  description?: string;
  features?: string[];
}

export interface TicketingEvent extends Event {
  eventCode: string;
  organizer: string;
  description: string;
  venue: string;
  time: string;
  ticketTypes: TicketType[];
}


import {
  LayoutDashboard,
  Users,
  Calendar,
  Ticket,
  Vote,
  Settings,
  FileText,
  DollarSign,
  BarChart3,
  Shield,
  Building2,
  MessageSquare,
  HelpCircle,
  Bell,
  Globe,
  UserCog,
  Megaphone,
  CreditCard,
  PieChart,
  TrendingUp,
  Trash2,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  children?: { name: string; href: string }[];
};

export type NavigationSection = {
  title?: string;
  items: NavigationItem[];
};

export const superAdminNavigation: NavigationSection[] = [
  {
    items: [{ name: "Overview", href: "/super-admin", icon: LayoutDashboard }],
  },
  {
    title: "Platform Management",
    items: [
      { name: "Organizers", href: "/super-admin/organizers", icon: Building2 },
      { name: "Admins", href: "/super-admin/admins", icon: UserCog },
    ],
  },
  {
    title: "Events & Content",
    items: [
      { name: "All Events", href: "/super-admin/events", icon: Calendar },
      { name: "Voting Events", href: "/super-admin/voting", icon: Vote },
      { name: "Ticketing", href: "/super-admin/ticketing", icon: Ticket },
      { name: "Deleted Events", href: "/admin/events/deleted", icon: Trash2 },
    ],
  },
  {
    title: "Financial",
    items: [
      {
        name: "Transactions",
        href: "/super-admin/transactions",
        icon: DollarSign,
      },
      { name: "Payouts", href: "/super-admin/payouts", icon: CreditCard },
      { name: "Revenue", href: "/super-admin/revenue", icon: TrendingUp },
      {
        name: "Payment Gateways",
        href: "/super-admin/finance/settings",
        icon: Settings,
      },
    ],
  },
  {
    title: "Analytics & Reports",
    items: [
      {
        name: "Platform Analytics",
        href: "/super-admin/analytics",
        icon: BarChart3,
      },
      { name: "Reports", href: "/super-admin/reports", icon: PieChart },
    ],
  },
  {
    title: "CMS",
    items: [
      { name: "Blog Posts", href: "/super-admin/cms/blogs", icon: FileText },
      { name: "FAQs", href: "/super-admin/cms/faqs", icon: HelpCircle },
      { name: "Banners", href: "/super-admin/cms/banners", icon: Megaphone },
    ],
  },
  {
    title: "System",
    items: [
      { name: "Settings", href: "/super-admin/settings", icon: Settings },
      { name: "Security", href: "/super-admin/security", icon: Shield },
      { name: "Notifications", href: "/super-admin/notifications", icon: Bell },
      { name: "My Account", href: "/super-admin/account", icon: UserCog },
    ],
  },
];

export const adminNavigation: NavigationSection[] = [
  {
    items: [{ name: "Overview", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Event Management",
    items: [
      { name: "All Events", href: "/admin/events", icon: Calendar },
      { name: "Voting Events", href: "/admin/voting", icon: Vote },
      { name: "Ticketing Events", href: "/admin/ticketing", icon: Ticket },
      { name: "Pending Approvals", href: "/admin/approvals", icon: FileText },
      { name: "Deleted Events", href: "/admin/events/deleted", icon: Trash2 },
    ],
  },
  {
    title: "Users & Organizers",
    items: [
      { name: "Organizers", href: "/admin/organizers", icon: Building2 },
    ],
  },
  {
    title: "Financial",
    items: [
      { name: "Transactions", href: "/admin/transactions", icon: DollarSign },
      { name: "Payout Requests", href: "/admin/payouts", icon: CreditCard },
    ],
  },
  {
    title: "Analytics",
    items: [{ name: "Reports", href: "/admin/reports", icon: BarChart3 }],
  },
  {
    title: "Settings",
    items: [{ name: "My Account", href: "/admin/account", icon: Settings }],
  },
];

export const organizerNavigation: NavigationSection[] = [
  {
    items: [{ name: "Dashboard", href: "/organizer", icon: LayoutDashboard }],
  },
  {
    title: "My Events",
    items: [
      { name: "All Events", href: "/organizer/events", icon: Calendar },
      { name: "Create Event", href: "/organizer/events/new", icon: Vote },
      { name: "Ticketing", href: "/organizer/ticketing", icon: Ticket },
    ],
  },
  {
    title: "Voting",
    items: [
      { name: "Voting Events", href: "/organizer/voting", icon: Vote },
      { name: "Nominations", href: "/organizer/nominations", icon: Users },
      { name: "Vote Results", href: "/organizer/results", icon: BarChart3 },
    ],
  },
  {
    title: "Financial",
    items: [
      { name: "Earnings", href: "/organizer/earnings", icon: DollarSign },
      { name: "Payout History", href: "/organizer/payouts", icon: CreditCard },
    ],
  },
  {
    title: "Settings",
    items: [
      { name: "Profile", href: "/organizer/profile", icon: UserCog },
    ],
  },
];

export function getNavigationForRole(role: string): NavigationSection[] {
  switch (role) {
    case "SUPER_ADMIN":
      return superAdminNavigation;
    case "ADMIN":
      return adminNavigation;
    case "ORGANIZER":
      return organizerNavigation;
    default:
      return [];
  }
}

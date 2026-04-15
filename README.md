# EaseVote

**EaseVote** is a modern, reliable platform designed for seamless event voting and ticketing experiences. Built with performance and user experience in mind, it provides a secure environment for casting votes and purchasing polls or event tickets.

## 🚀 Features

### Core Platform

- **Live Voting System**: Users can browse active events, select nominees across categories, and cast votes with real-time feedback.
- **Event Ticketing**: A smooth flow for purchasing event tickets, complete with seat selection (UI) and digital ticket generation.
- **Secure Payments**: Integrated Paystack support for processing secure transactions for votes and tickets.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices using a mobile-first approach.
- **TrustCenter**: Integrated legal compliance, privacy policies, and terms of service management.

### 👑 Super Admin Dashboard

A robust administration panel for total system oversight:

- **Analytics & Reporting**: View system-wide revenue, user registration trends, and activity logs.
- **User Management**: Manage all admins, organizers, and users.
- **System Health**: Monitor logs, system alerts, and configuration settings.
- **Financial Overview**: Track all payouts, revenue streams, and transaction histories.

### 🏢 Organizer Portal

Dedicated tools for event organizers to manage their events:

- **Event Management**: Create and manage events, categories, and nominees.
- **Nomination Handling**: Review and approve/reject nominations.
- **Sales Tracking**: Monitor ticket sales and real-time voting progress.
- **Organization Profile**: Manage business details and payout settings.

### 🔐 Authentication & Security

- **Role-Based Access Control (RBAC)**: Secure access tailored for Super Admins, Organizers, and Standard Users.
- **NextAuth Integration**: Robust authentication flows including email/password and potential social providers.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via Prisma ORM)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## 📦 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher recommended)
- pnpm (Preferred package manager)
- PostgreSQL Database URL

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/thegoddysmart/project-rebuild.git
    cd project-rebuild
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Configure Environment:**
    Copy `.env.example` to `.env` and fill in your secrets.

    ```bash
    cp .env.example .env
    ```

4.  **Database Setup:**
    Push the schema to your database.

    ```bash
    pnpm db:push
    ```

5.  **Run the development server:**

    ```bash
    pnpm dev
    ```

6.  **Open the app:**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Building for Production

To create an optimized production build:

```bash
pnpm build
```

To start the production server:

```bash
pnpm start
```

For detailed deployment instructions (e.g., to Vercel), see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 📂 Project Structure

```text
├── app/                  # Application routes (Next.js App Router)
│   ├── (auth)/           # Authentication routes (Sign-up, Sign-in)
│   ├── (main)/           # Public facing pages (Events, Voting)
│   ├── super-admin/      # Super Admin Dashboard
│   ├── organizer/        # Organizer Portal
│   ├── api/              # API Routes
│   └── layout.tsx        # Root layout
├── components/           # Reusable UI components
│   ├── features/         # Feature-specific components
│   ├── ui/               # Core Design System (Buttons, Inputs, etc.)
│   └── ...
├── lib/                  # Utilities (Database, Auth, Helpers)
├── prisma/               # Database Schema and Seeds
├── public/               # Static assets
└── types.ts              # Global TypeScript definitions
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is proprietary software. All rights reserved.

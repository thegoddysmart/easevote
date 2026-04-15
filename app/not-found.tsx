import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center dark:bg-secondary-100">
      <h1 className="font-russo text-6xl font-bold dark:text-white md:text-9xl">
        404
      </h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-gray-200 md:text-3xl">
        Page Not Found
      </h2>
      <p className="mt-2 max-w-md text-gray-900 dark:text-gray-400">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might
        have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="rounded-full bg-primary-600 px-8 py-3 text-base font-semibold text-white! transition-colors hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

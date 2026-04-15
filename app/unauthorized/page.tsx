"use client";

import Link from "next/link";
import { ShieldX, Home, LogIn } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldX className="w-10 h-10 text-red-500" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Access Denied
          </h1>

          <p className="text-gray-600 mb-8">
            You don&apos;t have permission to access this page. Please contact
            your administrator if you believe this is an error.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-700 text-white rounded-lg font-medium hover:bg-primary-800 transition-colors"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>

            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary-700 text-primary-700 rounded-lg font-medium hover:bg-primary-50 transition-colors"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </Link>
          </div>
        </div>

        <p className="mt-6 text-gray-500 text-sm">
          Need help?{" "}
          <Link href="/contact" className="text-secondary-600 hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}

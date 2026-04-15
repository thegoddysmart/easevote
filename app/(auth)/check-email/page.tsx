"use client";

import Link from "next/link";
import { Mail } from "lucide-react";

/**
 * Shown after a successful sign-up registration.
 * The user is told to check their email before they can sign in.
 */
export default function CheckEmailPage() {
  return (
    <>
      {/* Left brand panel */}
      <div className="hidden lg:flex w-1/2 bg-primary-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative z-10 max-w-lg text-white space-y-8">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
            <Mail size={32} className="text-white" />
          </div>
          <h2 className="text-5xl font-display font-bold leading-tight text-white!">
            One last <span className="text-secondary-500">step</span>.
          </h2>
          <p className="text-lg text-magenta-100/80 leading-relaxed">
            Verifying your email keeps your EaseVote account secure and ensures
            you get important notifications.
          </p>
        </div>
      </div>

      {/* Right content panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-12 bg-white">
        <div className="max-w-md w-full mx-auto text-center">
          <div className="lg:hidden mb-8 mt-8">
            <span className="text-2xl font-display font-bold text-magenta-800">
              EaseVote<span className="text-magenta-500">.gh</span>
            </span>
          </div>

          {/* Envelope animation */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center animate-pulse">
              <Mail size={48} className="text-primary-600" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-4">
            Check your email
          </h1>
          <p className="text-slate-500 leading-relaxed mb-8">
            We sent a verification link to your email address. Click the link in
            the email to activate your organizer account.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 text-left mb-8">
            <p className="font-semibold mb-1">Didn't receive the email?</p>
            <ul className="list-disc list-inside space-y-1 text-amber-700">
              <li>Check your spam or junk folder</li>
              <li>The link expires in 24 hours</li>
              <li>Make sure you used the correct email address</li>
            </ul>
          </div>

          <Link
            href="/sign-in"
            className="inline-block w-full bg-primary-800 hover:bg-primary-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary-900/20 transition-all hover:-translate-y-1 text-center"
          >
            Back to Sign In
          </Link>

          <p className="mt-6 text-sm text-slate-500">
            Wrong email?{" "}
            <Link
              href="/sign-up"
              className="font-bold text-magenta-700 hover:underline"
            >
              Register again
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

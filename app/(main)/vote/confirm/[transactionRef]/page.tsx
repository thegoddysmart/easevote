import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { createServerApiClient } from "@/lib/api-client";
import { notFound } from "next/navigation";

import VoteVerifyPolling from "./VoteVerifyPolling";

export default async function VoteConfirmationPage({
  params,
}: {
  params: Promise<{ transactionRef: string }>;
}) {
  const { transactionRef } = await params;

  // Public page — no auth token needed
  const apiClient = createServerApiClient();
  const res = await apiClient.get<any>(`/purchases/verify/${transactionRef}`).catch(() => null);
  const transaction = res?.data || res?.purchase || res;

  const isSuccess = transaction?.status === "SUCCESS" || transaction?.status === "COMPLETED";

  if (!transaction || !isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Loader2 size={40} className="animate-spin" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-slate-900">Checking Payment Status...</h1>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          We're verifying your transaction with Paystack. Please stay on this page while we confirm your votes.
        </p>

        <VoteVerifyPolling 
          transactionRef={transactionRef} 
          initialStatus={transaction?.status || "PENDING"} 
          eventCode={transaction?.eventCode || ""}
        />

        <Link
          href="/"
          className="mt-8 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
        >
          Return Home
        </Link>
      </div>
    );
  }

  // Cast metadata safely
  const meta: any = transaction.metadata || {};

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
        <CheckCircle size={40} />
      </div>
      <h1 className="text-4xl font-display font-bold text-slate-900 mb-3 tracking-tight">Vote Successful!</h1>
      <p className="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
        You have successfully cast your support for <span className="font-bold text-primary-700">{meta.candidateName}</span>. Your contribution has been recorded in real-time.
      </p>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-8 w-full max-w-sm shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 text-left">Transaction Details</p>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Amount Paid</span>
            <span className="font-bold text-slate-900">GHS {Number(transaction.amount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Votes Cast</span>
            <span className="font-bold text-slate-900">{meta.quantity || 1}</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-slate-50">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Reference</span>
            <span className="font-mono text-[11px] text-slate-600 select-all">{transaction.reference}</span>
          </div>
        </div>
      </div>

      {/* Share Section */}
      <div className="mb-10">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Every share helps your candidate!</p>
        <div className="flex items-center justify-center gap-3">
          <a 
            href={`https://wa.me/?text=${encodeURIComponent(`I just voted for ${meta.candidateName} in ${meta.eventName || 'the event'}! Support them too! ${process.env.NEXT_PUBLIC_BASE_URL || 'https://easevotegh.com'}/events/${transaction.eventCode}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white rounded-full text-sm font-bold hover:shadow-lg transition-all active:scale-95"
          >
            Share on WhatsApp
          </a>
          <a 
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just voted for ${meta.candidateName} in ${meta.eventName || 'the event'}! Support them too!`)}&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://easevotegh.com'}/events/${transaction.eventCode}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 text-white rounded-full text-sm font-bold hover:shadow-lg transition-all active:scale-95"
          >
            Twitter
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          href={`/events/${transaction.eventCode}`}
          className="w-full py-4 bg-primary-900 text-white rounded-2xl font-bold hover:bg-primary-800 transition shadow-lg shadow-primary-900/10"
        >
          View Live Leaderboard
        </Link>
        <Link
          href="/events/voting"
          className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition"
        >
          Return to Events
        </Link>
      </div>
    </div>
  );
}

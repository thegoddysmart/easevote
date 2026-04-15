"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * PaymentCallbackHandler
 * This page handles the incoming redirect from Paystack after a successful payment.
 * It extracts the reference from query parameters and routes the user to the proper confirmation page.
 */
function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Paystack typically sends both 'reference' and 'trxref'
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  useEffect(() => {
    if (reference) {
      console.log(`[PaymentCallback] Found reference: ${reference}. Redirecting to confirmation page...`);
      // We use router.replace to avoid the callback page staying in the history stack
      router.replace(`/vote/confirm/${reference}`);
    } else {
      console.error("[PaymentCallback] No reference found in URL parameters.");
      router.replace("/");
    }
  }, [reference, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center space-y-6 max-w-sm w-full text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary-600 animate-pulse" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 mb-1">Verifying Payment</h1>
          <p className="text-slate-500 text-sm">Please wait while we finalize your transaction status.</p>
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
            Redirecting to confirmation
        </div>
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-600" />
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}

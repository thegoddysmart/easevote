"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, RefreshCcw } from "lucide-react";
import { api } from "@/lib/api-client";

interface VoteVerifyPollingProps {
  transactionRef: string;
  initialStatus: string;
  eventCode: string;
}

export default function VoteVerifyPolling({
  transactionRef,
  initialStatus,
  eventCode,
}: VoteVerifyPollingProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If it's already a terminal state, don't poll
    if (status === "SUCCESS" || status === "COMPLETED" || status === "FAILED") {
      return;
    }

    // Polling logic: retry every 4 seconds, up to 25 attempts (approx 100 seconds)
    if (attempts >= 25) {
      setError("Payment verification timed out. If you have been charged, please do not worry—your votes will be updated soon. You can refresh manually or contact support.");
      return;
    }

    const timer = setTimeout(async () => {
      try {
        console.log(`[VerifyPolling] Attempt ${attempts + 1} for ${transactionRef}`);
        const res = await api.get(`/purchases/verify/${transactionRef}`);
        
        // Broaden data extraction to handle various backend response formats
        // Broaden data extraction to handle various backend response formats
        const rawData = res.data || res;
        const transaction = rawData.data || rawData.purchase || rawData;
        const checkStatus = (transaction.status || rawData.status || "").toUpperCase();

        console.log(`[VerifyPolling] Status check: ${checkStatus}`);

        if (checkStatus === "SUCCESS" || checkStatus === "COMPLETED") {
          setStatus("SUCCESS");
          router.refresh();
        } else if (checkStatus === "FAILED" || checkStatus === "DECLINED") {
          setStatus("FAILED");
          router.refresh();
        } else {
          // Still PENDING
          setAttempts((prev) => prev + 1);
        }
      } catch (err: any) {
        console.error("[VerifyPolling] Error during polling:", err);
        // On network error, we still increment attempts but don't stop
        setAttempts((prev) => prev + 1);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [status, attempts, transactionRef, router]);

  const handleForceRefresh = () => {
    setError(null);
    setAttempts(0); // Reset polling
    router.refresh();
  };

  if (status === "SUCCESS" || status === "COMPLETED" || status === "FAILED") {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-indigo-50 border border-indigo-100 rounded-3xl max-w-sm mx-auto shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col items-center text-center space-y-4">
        {error ? (
          <>
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shadow-inner">
              <AlertCircle size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900 leading-tight mb-2">Polling Stalled</p>
              <p className="text-xs text-amber-700/80 mb-4 px-2">{error}</p>
              <button 
                onClick={handleForceRefresh}
                className="w-full py-3 bg-white border border-amber-200 text-amber-700 rounded-xl text-xs font-bold hover:bg-amber-50 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <RefreshCcw size={14} /> Try Verifying Again
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin relative" />
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-indigo-700">
                {attempts + 1}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">Confirming Vote</h3>
              <p className="text-xs text-indigo-600/70 mt-1 max-w-[200px]">
                Waiting for Paystack to notify our servers. This usually takes 10-20 seconds.
              </p>
            </div>
            <div className="w-full bg-indigo-100 rounded-full h-1 mt-2">
              <div 
                className="bg-indigo-500 h-1 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${Math.min(((attempts + 1) / 25) * 100, 100)}%` }}
              ></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

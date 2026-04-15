"use client";

import { useSearchParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { Loader2, Smartphone, Signal } from "lucide-react";

export default function AppsnCheckoutPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const [loading, setLoading] = useState(true);
  const [tx, setTx] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<"IDLE" | "SUCCESS" | "FAILED">("IDLE");

  useEffect(() => {
    if (reference) {
      api.get(`/simulation/transactions/${reference}`).then((data) => {
        setTx(data);
        setLoading(false);
      });
    }
  }, [reference]);

  async function handlePayment(outcome: "SUCCESS" | "FAILED") {
    setProcessing(true);
    // Simulate finding the phone notification delay
    await new Promise((r) => setTimeout(r, 1500));

    await api.post("/simulation/complete-payment", { reference: reference!, outcome });

    setStatus(outcome);
    setProcessing(false);
  }

  // Common wrapper for the modal content
  const ModalWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
        {children}
      </div>
      <div className="absolute bottom-6 text-white/50 text-xs font-medium">
        SECURE CHECKOUT SIMULATION
      </div>
    </div>
  );

  if (loading)
    return (
      <ModalWrapper>
        <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-600">
            Initializing Payment...
          </p>
        </div>
      </ModalWrapper>
    );

  if (!tx)
    return (
      <ModalWrapper>
        <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
            <Signal className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900">Invalid Session</h3>
          <p className="text-sm text-slate-500">
            The payment reference provided is invalid or expired.
          </p>
        </div>
      </ModalWrapper>
    );

  return (
    <ModalWrapper>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">AppsnMobile</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                USSD Prompt
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">Amount</div>
            <div className="font-bold text-slate-900">
              GHS {Number(tx.amount).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Content Status */}
        {status === "IDLE" && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3 text-center">
              <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-yellow-500 mb-2 relative">
                <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-yellow-400 opacity-20"></span>
                <Signal className="w-6 h-6" />
              </div>
              <h4 className="font-medium text-slate-900 text-sm">
                Action Required
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                A prompt has been sent to{" "}
                <strong>{tx.customerPhone || "your phone"}</strong>. <br />
                Please approve the transaction to continue.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handlePayment("FAILED")}
                disabled={processing}
                className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Decline
              </button>
              <button
                onClick={() => handlePayment("SUCCESS")}
                disabled={processing}
                className="px-4 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Approve"
                )}
              </button>
            </div>
          </div>
        )}

        {status === "SUCCESS" && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-in zoom-in spin-in-12 duration-500">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                Payment Successful
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Redirecting you back to merchant...
              </p>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-green-500 animate-[progress_2s_ease-in-out_infinite] w-1/3 rounded-full"></div>
            </div>
          </div>
        )}

        {status === "FAILED" && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                Payment Declined
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                The transaction was cancelled.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Meta */}
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
        <span>REF: {reference?.split("-")[1] || "---"}</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          Simulated Environment
        </span>
      </div>
    </ModalWrapper>
  );
}

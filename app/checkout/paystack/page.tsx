"use client";

import { useSearchParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { Loader2, ShieldCheck, Lock } from "lucide-react";

export default function PaystackCheckoutPage() {
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
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 2000));

    await api.post("/simulation/complete-payment", { reference: reference!, outcome });

    setStatus(outcome);
    setProcessing(false);

    if (outcome === "SUCCESS") {
      // Redirect back to app success?
      // Usually providers redirect to a callback_url
      // For simplicity, we just show a success message
    }
  }

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  if (!tx)
    return (
      <div className="p-10 text-center">Invalid Transaction Reference</div>
    );

  if (status === "SUCCESS") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Payment Successful
          </h2>
          <p className="text-gray-500">Your transaction has been processed.</p>
          <div className="pt-4">
            <button
              onClick={() => window.close()}
              className="text-blue-600 hover:underline"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-sm rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#091D34] p-4 flex justify-between items-center text-white">
          <div className="text-xs opacity-80">{tx.customerEmail}</div>
          <div className="font-bold">GHS {Number(tx.amount).toFixed(2)}</div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-1">
              Paystack Checkout (Simulated)
            </p>
            <h3 className="text-lg font-medium text-gray-800">
              Use one of the cards below
            </h3>
          </div>

          {/* Mock Cards */}
          <div className="space-y-3">
            <button
              onClick={() => handlePayment("SUCCESS")}
              disabled={processing}
              className="w-full group p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-5 bg-blue-600 rounded"></div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Success Card
                  </p>
                  <p className="text-xs text-gray-400">**** **** **** 4242</p>
                </div>
              </div>
              {processing && (
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              )}
            </button>

            <button
              onClick={() => handlePayment("FAILED")}
              disabled={processing}
              className="w-full group p-4 border rounded-lg hover:border-red-500 hover:shadow-md transition-all text-left flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-5 bg-red-600 rounded"></div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Decline Card
                  </p>
                  <p className="text-xs text-gray-400">**** **** **** 0000</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 flex justify-center items-center gap-2 text-xs text-gray-400">
          <Lock className="w-3 h-3" />
          <span>Secured by Paystack (Simulation)</span>
        </div>
      </div>
    </div>
  );
}

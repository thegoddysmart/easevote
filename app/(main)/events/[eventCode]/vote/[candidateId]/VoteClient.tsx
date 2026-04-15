"use client";

import { useState, useEffect } from "react";
import { Event, Candidate } from "@/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Share2, Check, Copy, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";

interface VoteClientProps {
  event: Event;
  candidate: Candidate;
}

export default function VoteClient({ event, candidate }: VoteClientProps) {
  const router = useRouter();

  // Form States
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [voteCount, setVoteCount] = useState(1);
  const [isCopied, setIsCopied] = useState(false);
  const [validationError, setValidationError] = useState("");
  
  // Payment Polling States
  const [isWaiting, setIsWaiting] = useState(false);
  const [activeReference, setActiveReference] = useState<string | null>(null);
  const [pollingAttempts, setPollingAttempts] = useState(0);

  // Derived Data
  const minimalVotePrice = event.costPerVote || 1.0;
  const totalAmount = (voteCount * minimalVotePrice).toFixed(2);

  // Polling Effect
  useEffect(() => {
    if (!isWaiting || !activeReference) return;

    if (pollingAttempts >= 15) { // 1 minute at 4s intervals
      setIsWaiting(false);
      alert("Verification is taking longer than expected. Please check your email for confirmation or refresh the page.");
      return;
    }

    const pollTimer = setTimeout(async () => {
      try {
        console.log(`[VoteClient] Polling attempt ${pollingAttempts + 1} for ${activeReference}`);
        const res = await api.get(`/purchases/verify/${activeReference}`);
        const transaction = res.data || res.purchase || res;

        if (transaction.status === "SUCCESS" || transaction.status === "COMPLETED") {
          // Success! Move to confirmation page
          router.push(`/vote/confirm/${activeReference}`);
        } else if (transaction.status === "FAILED") {
          setIsWaiting(false);
          alert("Payment was unsuccessful. Please try again.");
        } else {
          // Still PENDING, increment and wait
          setPollingAttempts(prev => prev + 1);
        }
      } catch (err) {
        console.error("[VoteClient] Polling error:", err);
        setPollingAttempts(prev => prev + 1);
      }
    }, 4000);

    return () => clearTimeout(pollTimer);
  }, [isWaiting, activeReference, pollingAttempts, router]);

  const handlePayment = async () => {
    // 1. Validation
    const minVotes = event.minVotesPerPurchase || 1;
    const maxVotes = event.maxVotesPerPurchase || Infinity;
    
    if (voteCount < minVotes) {
      setValidationError(`Minimum of ${minVotes} votes required.`);
      return;
    }
    if (voteCount > maxVotes) {
      setValidationError(`Maximum of ${maxVotes} votes allowed per transaction.`);
      return;
    }
    setValidationError("");

    // 2. Call the Unified Purchases API
    setPollingAttempts(0);
    try {
      // Guide: POST /api/purchases/votes/initialize
      const eventId = event.id || (event as any)._id;
      const candidateId = candidate.id || (candidate as any)._id;
      const categoryId = (candidate as any).categoryId;

      const payload = {
        eventId: eventId,
        candidateId: candidateId,
        categoryId: categoryId,
        voteCount: voteCount,
        customerName: fullName || undefined,
        customerEmail: email || undefined,
        customerPhone: phoneNumber || undefined,
      };

      console.log("[VoteClient] Initializing unified vote purchase:", payload);

      const res = await api.post("/purchases/votes/initialize", payload);
      
      const result = res.data || res;
      // Guide suggests 'authorizationUrl', maintaining 'paymentUrl' as fallback
      const paymentUrl = result.authorizationUrl || result.paymentUrl;
      const reference = result.paymentReference || result.reference || result.transactionRef;

      if (paymentUrl) {
        // Option 1: Open in new tab and start polling
        window.open(paymentUrl, '_blank');
        setActiveReference(reference);
        setIsWaiting(true);
      } else if (reference) {
        router.push(`/vote/confirm/${reference}`);
      } else {
        console.error("[VoteClient] No redirect information found in response:", res);
        alert("Initialization successful, but no payment link was found.");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      alert(error.message || "An unexpected error occurred.");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Vote for ${candidate.name}`,
      text: `Support ${candidate.name} in ${event.title}!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row">
        {/* LEFT COLUMN: Image */}
        <div className="md:w-1/2 h-96 md:h-auto relative bg-gray-100">
          <img
            src={candidate.image || ""}
            alt={candidate.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT COLUMN: Form */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
          {isWaiting ? (
            <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-primary-600 animate-pulse" />
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Processing Your Vote</h2>
                <p className="text-slate-600">We've opened the payment gateway in a new tab.</p>
                <p className="text-sm text-slate-500 mt-2 italic">Please do not close this window until we confirm your payment.</p>
              </div>
              <div className="bg-primary-50 p-4 rounded-xl border border-primary-100 w-full max-w-sm">
                <div className="text-xs font-bold text-primary-700 uppercase mb-1">Status</div>
                <p className="text-sm text-primary-900">Waiting for transaction confirmation...</p>
                <div className="mt-2 w-full bg-primary-100 rounded-full h-1.5">
                  <div 
                    className="bg-primary-600 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${(pollingAttempts / 15) * 100}%` }}
                  ></div>
                </div>
              </div>
              <button 
                onClick={() => setIsWaiting(false)}
                className="text-sm text-slate-400 hover:text-slate-600 underline"
              >
                Cancel and go back
              </button>
            </div>
          ) : (
            <>
              <Link
                href={`/events/${event.eventCode}`}
            className="absolute top-6 left-8 md:left-12 flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft size={18} /> Back
          </Link>

          <button
            onClick={handleShare}
            className="absolute top-6 right-8 md:right-12 flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-800 transition-colors bg-primary-50 px-3 py-1.5 rounded-full"
          >
            {isCopied ? (
              <>
                <Check size={16} /> Copied!
              </>
            ) : (
              <>
                <Share2 size={16} /> Share
              </>
            )}
          </button>

          <div className="text-center md:text-left mb-8 mt-6">
            <h1 className="text-2xl font-bold text-primary-900 mb-2">
              Vote for {candidate.name}{" "}
              <span className="text-primary-700">({candidate.code})</span>
            </h1>
            <p className="text-gray-500 text-sm mb-4">
              Support {candidate.name} by submitting your vote. You can also
              vote via USSD by dialing{" "}
              <span className="font-bold text-gray-700">*929*39#</span>
            </p>
          </div>

          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-full border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-gray-700 bg-gray-50/50"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voter@example.com"
                className="w-full px-4 py-3 rounded-full border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-gray-700 bg-gray-50/50"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="024 XXX XXXX"
                className="w-full px-4 py-3 rounded-full border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-gray-700 bg-gray-50/50"
              />
            </div>

            {/* Votes */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Number of Votes (GHS {minimalVotePrice.toFixed(2)})
              </label>
              <input
                type="number"
                min="1"
                value={voteCount}
                onChange={(e) => setVoteCount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-full border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-gray-700 bg-gray-50/50"
              />
            </div>

            {/* Total Price Display */}
            <div className="bg-primary-50/50 rounded-2xl p-4 border border-primary-100 flex items-center justify-between">
              <div className="text-xs font-bold text-primary-700 uppercase tracking-wider">Total Summary</div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">GHS {minimalVotePrice.toFixed(2)} × {voteCount}</span>
                <span className="text-lg font-display font-bold text-primary-900">
                  GHS {totalAmount}
                </span>
              </div>
            </div>

            {validationError && (
              <p className="text-red-500 text-sm font-bold text-center bg-red-50 py-2 rounded-lg border border-red-100 animate-in fade-in zoom-in-95">
                {validationError}
              </p>
            )}

            {/* Submit Button */}
            <button
              onClick={handlePayment}
              disabled={voteCount < 1}
              className="w-full bg-primary-900 text-white font-bold py-4 rounded-3xl shadow-lg hover:bg-primary-800 transition-all hover:-translate-y-0.5 active:translate-y-0 mt-4 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Confirm Vote & Pay GHS {totalAmount}
            </button>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}

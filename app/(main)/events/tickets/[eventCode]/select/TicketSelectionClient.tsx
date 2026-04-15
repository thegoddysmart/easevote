"use client";

import React, { useState } from "react";
import { TicketingEvent } from "@/types";
import {
  Minus,
  Plus,
  ShoppingCart,
  CreditCard,
  User,
  Mail,
  Smartphone,
} from "lucide-react";
import { TicketConfirmation } from "./TicketConfirmation";
import { AppsnCheckoutModal } from "@/app/components/payment/AppsnCheckoutModal";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface TicketSelectionProps {
  event: any; // Using real Prisma type passed from server
}

export const TicketSelectionClient: React.FC<TicketSelectionProps> = ({
  event,
}) => {
  const router = useRouter();
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [step, setStep] = useState<"select" | "checkout" | "confirmation">(
    "select"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState<string>("");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentRef, setPaymentRef] = useState<string>("");

  // Checkout Form
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const tiers = event.ticketTypes || [];

  const updateCart = (tierId: string, delta: number) => {
    // For now, let's limit to one ticket type per transaction to match API constraints
    // This can be expanded later
    setCart((prev) => {
      const current = prev[tierId] || 0;
      const valid = Math.max(0, current + delta);
      // Reset others if we are selecting a new one
      const newCart =
        delta > 0 ? { [tierId]: valid } : { ...prev, [tierId]: valid };
      return newCart;
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = tiers.reduce(
    (sum: number, tier: any) => sum + tier.price * (cart[tier.id] || 0),
    0
  );

  const handleCheckout = async () => {
    setIsProcessing(true);

    // Find the selected ticket type
    const selectedTierId = Object.keys(cart).find((id) => cart[id] > 0);
    if (!selectedTierId) return;

    try {
      const res = await fetch("/api/tickets/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          ticketTypeId: selectedTierId,
          quantity: cart[selectedTierId],
          voterName: formData.name,
          voterPhone: formData.phone,
          voterEmail: formData.email,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initiate purchase");

      setPaymentRef(data.transactionRef);
      setShowCheckoutModal(true);
    } catch (err: any) {
      toast.error(err.message);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = (ref: string) => {
    setShowCheckoutModal(false);
    toast.success("Payment Successful!");
    router.push(`/tickets/confirmation/${ref}`);
  };

  // The local confirmation state is no longer used as we redirect to a dedicated page
  // if (step === "confirmation") ...

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push(`/events/tickets/${event.eventCode}`)}
            className="text-slate-500 font-bold hover:text-slate-900"
          >
            Cancel
          </button>
          <h2 className="text-xl font-bold text-slate-900">Select Tickets</h2>
          <div className="w-10"></div>
          {/* Spacer */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Event Recap & Selection */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
              <img
                src={event.image}
                alt="Event"
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {event.title}
                </h3>
                <p className="text-slate-500 text-sm">
                  {event.date} • {event.venue}
                </p>
              </div>
            </div>

            {step === "select" ? (
              <div className="space-y-4">
                {tiers.map((tier: any) => (
                  <div
                    key={tier.id}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex justify-between sm:block">
                        <h4 className="font-bold text-slate-900 text-lg">
                          {tier.name}
                        </h4>
                        <p className="font-bold text-magenta-600 sm:mt-1">
                          GHS {tier.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-slate-500 text-sm mt-2">
                        {tier.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl self-start sm:self-center">
                      <button
                        onClick={() => updateCart(tier.id, -1)}
                        disabled={!cart[tier.id]}
                        className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 disabled:opacity-50"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-bold text-lg w-6 text-center">
                        {cart[tier.id] || 0}
                      </span>
                      <button
                        onClick={() => updateCart(tier.id, 1)}
                        className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-magenta-600"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-slate-900 text-xl mb-6">
                  Guest Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-slate-700">
                      Full Name
                    </label>
                    <div className="relative mt-1">
                      <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-magenta-500 focus:outline-none"
                        placeholder="Kwame Mensah"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700">
                      Email Address (For Ticket Delivery)
                    </label>
                    <div className="relative mt-1">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-magenta-500 focus:outline-none"
                        placeholder="kwame@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700">
                      Phone Number (MoMo)
                    </label>
                    <div className="relative mt-1">
                      <Smartphone
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-magenta-500 focus:outline-none"
                        placeholder="024 123 4567"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
              <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                <ShoppingCart size={20} /> Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                {tiers
                  .filter((t: any) => (cart[t.id] || 0) > 0)
                  .map((tier: any) => (
                    <div key={tier.id} className="flex justify-between text-sm">
                      <span className="text-slate-600">
                        {cart[tier.id]}x {tier.name}
                      </span>
                      <span className="font-medium">
                        GHS {(cart[tier.id] * tier.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                {totalItems === 0 && (
                  <p className="text-slate-400 text-sm italic">
                    No tickets selected
                  </p>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="text-slate-500 font-medium">Total</span>
                  <span className="text-2xl font-bold text-slate-900">
                    GHS {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {step === "select" ? (
                <button
                  onClick={() => setStep("checkout")}
                  disabled={totalItems === 0}
                  className="w-full bg-slate-900 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
                >
                  Checkout
                </button>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    disabled={
                      !formData.email || !formData.phone || isProcessing
                    }
                    className="w-full bg-secondary-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold hover:bg-secondary-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        <CreditCard size={18} /> Pay Now
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setStep("select")}
                    className="w-full text-slate-500 font-bold py-2 hover:text-slate-800"
                  >
                    Back
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showCheckoutModal && (
        <AppsnCheckoutModal
          reference={paymentRef}
          onClose={() => setShowCheckoutModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

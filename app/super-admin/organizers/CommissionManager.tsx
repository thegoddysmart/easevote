"use client";

import { useState, useTransition } from "react";
import { api } from "@/lib/api-client";
import { Percent, Edit2, Check, X } from "lucide-react";

export default function CommissionManager({
  organizerId,
  initialRate,
}: {
  organizerId: string;
  initialRate: number;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [rate, setRate] = useState(initialRate.toString());
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    const numericRate = parseFloat(rate);
    if (isNaN(numericRate) || numericRate < 0 || numericRate > 100) {
      alert("Please enter a valid percentage between 0 and 100");
      return;
    }

    startTransition(async () => {
      await api.patch(`/super-admin/organizers/${organizerId}/commission`, { rate: numericRate });
      setIsEditing(false);
    });
  };

  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 text-purple-600 rounded">
          <Percent className="w-5 h-5" />
        </div>
        <span className="text-sm font-medium text-slate-600">
          Commission Rate
        </span>
      </div>

      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-16 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            step="0.1"
            min="0"
            max="100"
          />
          <button
            onClick={handleSave}
            disabled={isPending}
            className="p-1 text-green-600 hover:bg-green-100 rounded"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setRate(initialRate.toString());
            }}
            className="p-1 text-red-600 hover:bg-red-100 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">{initialRate}%</span>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

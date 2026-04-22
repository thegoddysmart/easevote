import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  Check,
  X,
  User,
  Calendar,
  Mail,
  Phone,
  MapPin,
  AlignLeft,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

type Nomination = {
  id: string;
  categoryName: string;
  nomineeName: string;
  nomineeEmail: string | null;
  nomineePhone: string | null;
  status: string;
  createdAt: string;
  event: {
    id: string;
    title: string;
    eventCode: string;
  };
  reason: string | null;
  customFields: any;
  photoUrl: string | null;
  fieldLabels?: Record<string, string>;
};

interface NominationDetailsDialogProps {
  nomination: Nomination | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReview: (id: string, status: "APPROVED" | "REJECTED") => Promise<void>;
  processing?: boolean;
}

export default function NominationDetailsDialog({
  nomination,
  open,
  onOpenChange,
  onReview,
  processing,
}: NominationDetailsDialogProps) {
  if (!nomination) return null;

  // Use the correct field for custom answers
  const customFields = nomination.customFields || {};
  const hasCustomFields = Object.keys(customFields).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-2xl">
      <DialogContent className="max-h-[85vh] flex flex-col p-4">
        <DialogHeader className="p-0">
          <div className="flex items-center justify-between pr-8">
            <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
              Nomination Details
            </DialogTitle>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                nomination.status === "APPROVED"
                  ? "bg-green-50 text-green-700 border-green-100"
                  : nomination.status === "REJECTED"
                  ? "bg-red-50 text-red-700 border-red-100"
                  : "bg-amber-50 text-amber-700 border-amber-100"
              }`}
            >
              {nomination.status === "PENDING"
                ? "PENDING REVIEW"
                : nomination.status}
            </span>
          </div>
          <DialogDescription className="text-slate-500 font-medium text-sm">
            Reviewing nomination for <strong className="text-slate-900">{nomination.categoryName}</strong>{" "}
            in <span className="text-primary-600 font-bold">{nomination.event?.title || "Unknown Event"}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-6 py-4">
            {/* Profile Header */}
            <div className="flex gap-6 items-start">
              <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm shrink-0 overflow-hidden p-1">
                 <div className="w-full h-full rounded-[0.8rem] overflow-hidden bg-white flex items-center justify-center border border-slate-50">
                {nomination.photoUrl ? (
                  <img
                    src={nomination.photoUrl}
                    alt={nomination.nomineeName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-slate-200" />
                )}
              </div>
            </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {nomination.nomineeName}
                </h3>
                <div className="flex flex-col gap-1 mt-1 text-sm text-slate-500">
                  {nomination.nomineeEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {nomination.nomineeEmail}
                    </div>
                  )}
                  {nomination.nomineePhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {nomination.nomineePhone}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Submitted:{" "}
                    {new Date(nomination.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio / Reason */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <AlignLeft className="w-4 h-4" /> Reason / Bio
              </h4>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed text-sm shadow-sm font-medium">
                {nomination.reason || "No description provided."}
              </div>
            </div>

            {/* Custom Fields (Dynamic) */}
            {hasCustomFields && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FileTextIcon className="w-4 h-4" /> Additional Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(customFields).map(([key, value]) => {
                    const label =
                      nomination.fieldLabels?.[key] || key.replace(/_/g, " ");
                    return (
                      <div
                        key={key}
                        className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm"
                      >
                        <span className="text-[10px] font-black text-slate-400 block mb-2 uppercase tracking-widest">
                          {label}
                        </span>
                        <span className="text-sm text-slate-900 font-bold">
                          {String(value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {/* Spacer for scroll visibility */}
            <div className="h-4" />
          </div>
        </div>

        <DialogFooter className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-end gap-3">
          {nomination.status === "PENDING" && (
            <>
              <Button
                variant="destructive"
                onClick={() => onReview(nomination.id, "REJECTED")}
                disabled={processing}
                className="gap-2 bg-red-600 hover:bg-red-700 text-white rounded-xl h-12 px-6 font-bold text-sm shadow-lg shadow-red-600/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />} Reject
              </Button>
              <Button
                onClick={() => onReview(nomination.id, "APPROVED")}
                disabled={processing}
                className="gap-2 bg-primary-700 hover:bg-primary-800 text-white rounded-xl h-12 px-6 font-bold text-sm shadow-xl active:scale-[0.98] transition-all cursor-pointer"
              >
                {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />} Approve
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FileTextIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}

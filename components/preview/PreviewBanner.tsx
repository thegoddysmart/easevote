import { AlertTriangle } from "lucide-react";

type PreviewBannerProps = {
  status: string;
};

export function PreviewBanner({ status }: PreviewBannerProps) {
  const statusLabels: Record<string, string> = {
    DRAFT: "Draft",
    PENDING_REVIEW: "Pending Review",
    PAUSED: "Paused",
    ENDED: "Ended",
    CANCELLED: "Cancelled",
  };

  const label = statusLabels[status] || status;

  return (
    <div className="bg-amber-100 border-b border-amber-200 text-amber-900 px-4 py-3 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <p className="font-medium text-sm">
          <span className="font-bold">Preview Mode:</span> This event is
          currently <span className="font-bold uppercase">{label}</span> and is
          not visible to the public.
        </p>
      </div>
    </div>
  );
}

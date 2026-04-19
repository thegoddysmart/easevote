"use client";

import { useTransition } from "react";
import { api } from "@/lib/api-client";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useModal } from "@/components/providers/ModalProvider";

interface AdminActionProps {
  id: string;
  status: string;
  name: string;
}

export default function AdminActions({ admin }: { admin: AdminActionProps }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const modal = useModal();

  const handleRemove = async () => {
    const confirmed = await modal.confirm({
      title: "Remove Admin",
      message: `Are you sure you want to PERMANENTLY remove admin "${admin.name}"? This cannot be undone.`,
      confirmText: "Remove Permanently",
      variant: "danger"
    });

    if (!confirmed) return;

    startTransition(async () => {
      try {
        const result = await api.delete(`/users/${admin.id}`);
        if (result.success) {
          toast.success("Admin removed successfully");
          router.push("/dashboard/admins");
        } else {
          toast.error(result.message || "Failed to remove admin");
        }
      } catch (err: any) {
        toast.error(err.message || "An unexpected error occurred");
      }
    });
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleRemove}
        disabled={isPending}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors text-sm font-medium"
      >
        <Trash2 className="w-4 h-4" />
        Remove
      </button>
    </div>
  );
}

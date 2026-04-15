import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerApiClient } from "@/lib/api-client";
import { redirect } from "next/navigation";
import PayoutHistoryClient from "./PayoutHistoryClient";

export default async function PayoutsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.organizerId) {
    redirect("/sign-in");
  }

  const apiClient = createServerApiClient(session?.accessToken as string | undefined);

  const [historyRes] = await Promise.all([
    apiClient.get<any>("/payouts/history").catch(() => ({ data: [] })),
  ]);

  const payouts: any[] = Array.isArray(historyRes)
    ? historyRes
    : (historyRes as any)?.data ?? [];

  // Compute stats from history
  const stats = {
    totalWithdrawn: payouts
      .filter((p: any) => p.status === "COMPLETED")
      .reduce((sum: number, p: any) => sum + Number(p.amount), 0),
    pendingAmount: payouts
      .filter((p: any) => p.status === "PENDING")
      .reduce((sum: number, p: any) => sum + Number(p.amount), 0),
    pendingCount: payouts.filter((p: any) => p.status === "PENDING").length,
  };

  return <PayoutHistoryClient stats={stats} payouts={payouts} />;
}

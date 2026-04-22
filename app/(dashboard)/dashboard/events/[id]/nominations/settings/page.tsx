import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerApiClient } from "@/lib/api-client";
import FormBuilder from "./FormBuilder";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NominationSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const apiClient = createServerApiClient(session?.accessToken as string | undefined);
  
  // Fetch both the form configuration and the main event object
  const [formRes, eventRes] = await Promise.all([
    apiClient.get<any>(`/nominations/events/${id}/form`).catch(() => null),
    apiClient.get<any>(`/events/${id}`).catch(() => null)
  ]);

  const form = formRes?.data || formRes;
  const event = eventRes?.data || eventRes;

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      <FormBuilder eventId={id} initialForm={form} event={event} />
    </div>
  );
}

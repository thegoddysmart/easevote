import { redirect } from "next/navigation";
import TicketConfirmClient from "./TicketConfirmClient";
import { createServerApiClient } from "@/lib/api-client";

export default async function TicketConfirmPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;

  if (!reference) {
    redirect("/");
  }

  const apiClient = createServerApiClient();

  try {
    // We poll this continuously via client, but doing a server initial fetch validates earlier UI paints
    const result = await apiClient.get<any>(`/purchases/verify/${reference}`);

    return (
      <TicketConfirmClient
        reference={reference}
        initialStatus={result.data?.status || "PENDING"}
        initialData={result.data}
      />
    );
  } catch (error) {
    console.error("Serverside validation failed:", error);
    // If the backend isn't ready or gateway hasn't sent webhook yet, default to pending state
    return (
      <TicketConfirmClient reference={reference} initialStatus="PENDING" />
    );
  }
}

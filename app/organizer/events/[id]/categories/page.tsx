"use client";

import { use } from "react";
import { CategoriesManager } from "@/app/components/events/CategoriesManager";

export default function ManageCategoriesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <CategoriesManager eventId={id} backUrl={`/organizer/events/${id}`} />;
}

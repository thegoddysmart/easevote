import { redirect } from "next/navigation";

export default function AnalyticsRedirectPage() {
  redirect("/super-admin/analytics/users");
}

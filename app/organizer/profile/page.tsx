import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createServerApiClient } from "@/lib/api-client";
import ProfileSettingsClient from "./ProfileSettingsClient";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.organizerId) {
    redirect("/sign-in");
  }

  const apiClient = createServerApiClient(session?.accessToken as string | undefined);
  const userId = session.user.id;

  // Fetch unified user data (Name, Email, Phone) rather than organizer-specific profile
  const rawRes = await apiClient.get(`/users/${userId}`).catch(() => null);
  const user = rawRes?.data || rawRes;

  const initialData = {
    name: user?.fullName || user?.name || session.user.name || "",
    email: user?.email || session.user.email || "",
    phone: user?.phone || "",
  };

  return <ProfileSettingsClient initialData={initialData} userId={session.user.id} />;
}

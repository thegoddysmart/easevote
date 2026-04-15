import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerApiClient } from "@/lib/api-client";
import BannerManager from "@/app/(dashboard)/dashboard/cms/banners/BannerManager";

export const dynamic = "force-dynamic";

export default async function SuperAdminBannersPage() {
  const session = await getServerSession(authOptions);
  const apiClient = createServerApiClient(session?.accessToken as string | undefined);
  const banners = await apiClient.get("/cms/banners/admin").catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Global Banner Management</h1>
        <p className="text-sm text-gray-500">
          Manage homepage banners across the entire platform.
        </p>
      </div>

      <BannerManager initialBanners={banners} />
    </div>
  );
}

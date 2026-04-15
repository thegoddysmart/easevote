import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerApiClient } from "@/lib/api-client";
import OrganizersTable from "./OrganizersTable";
import { Users } from "lucide-react";
import { PaginationControls } from "@/components/ui/PaginationControls";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SuperAdminOrganizersPage(props: Props) {
  const searchParams = await props.searchParams;
  const page = searchParams.page
    ? parseInt(searchParams.page as string, 10)
    : 1;
  const limit = 10;

  const session = await getServerSession(authOptions);
  const apiClient = createServerApiClient(session?.accessToken);

  let rawUsers = [];
  let totalPages = 1;

  try {
    const result = await apiClient.get(`/users?page=${page}&limit=${limit}`);
    rawUsers = result.data || result.users || [];
    totalPages =
      result.pagination?.pages ||
      Math.ceil((result.total || rawUsers.length) / limit) ||
      1;
  } catch (err) {
    rawUsers = [];
  }

  // Map MongoDB User objects to the expected Organizer table format
  const organizers = (Array.isArray(rawUsers) ? rawUsers : [])
    .filter((u) => u.role === "ORGANIZER")
    .map((user: any) => ({
      id: user._id,
      name: user.businessName || user.fullName,
      email: user.email,
      phone: user.phone || "N/A",
      avatar: "",
      verificationStatus: user.status === "ACTIVE" ? "VERIFIED" : user.status,
      userStatus: user.status,
      eventsCount: 0, // Not provided by /users endpoint directly
      totalRevenue: 0, // Not provided by /users endpoint directly
      balance: 0,
      joinedAt: new Date(user.createdAt || Date.now()),
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Organizer Management
        </h1>
        <p className="text-slate-500">
          Full control over organizer accounts, verification, and commissions.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-500" />
            All Organizers
          </h3>
          <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            {organizers.length} Total
          </span>
        </div>
        <OrganizersTable organizers={organizers} />
      </div>

      <div className="mt-4">
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          basePath="/super-admin/organizers"
        />
      </div>
    </div>
  );
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerApiClient } from "@/lib/api-client";
import { Settings, Save, Construction, Percent, UserPlus } from "lucide-react";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const apiClient = createServerApiClient(session?.accessToken);
  const rawResponse: any = await apiClient
    .get("/admin/settings")
    .catch(() => []);
  const settings = Array.isArray(rawResponse)
    ? rawResponse
    : rawResponse?.data || [];

  // Helper to get value safely
  const getValue = (key: string, defaultValue: any) => {
    const setting = settings.find((s: any) => s.key === key);
    return setting ? setting.value : defaultValue;
  };

  const config = [
    {
      key: "maintenance_mode",
      label: "Maintenance Mode",
      description:
        "Put the entire site into maintenance mode. Only Admins can log in.",
      type: "boolean" as const,
      value: getValue("maintenance_mode", false),
      icon: Construction,
    },
    {
      key: "global_commission_rate",
      label: "Global Commission Rate (%)",
      description: "Default commission rate for new organizers.",
      type: "number" as const,
      value: getValue("global_commission_rate", 10),
      icon: Percent,
    },
    {
      key: "allow_signups",
      label: "Allow New Signups",
      description: "If disabled, new users cannot register.",
      type: "boolean" as const,
      value: getValue("allow_signups", true),
      icon: UserPlus,
    },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center">
          <Settings className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
          <p className="text-slate-500">
            Global configuration and operational toggles
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">
            General Configuration
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          {config.map((item) => {
            const { icon: Icon, ...safeItem } = item;
            return (
              <SettingsForm
                key={safeItem.key}
                item={safeItem as any}
                iconNode={<Icon className="w-5 h-5" />}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

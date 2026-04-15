"use client";

import { api } from "@/lib/api-client";

type GatewayConfig = {
  provider: string;
  isEnabled: boolean;
  priority: number;
  failureCount: number;
  lastFailure: Date | null;
};
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GatewaySettings({
  configs,
}: {
  configs: GatewayConfig[];
}) {
  const router = useRouter();
  const [loadingObj, setLoadingObj] = useState<string | null>(null);

  async function handleSetActive(provider: string) {
    if (
      !confirm(
        `Switch ACTIVE payments to ${provider}? This will disable others.`
      )
    )
      return;
    setLoadingObj(provider);
    await api.post("/gateways/primary", { provider });
    setLoadingObj(null);
    router.refresh();
  }

  async function handleReset(provider: string) {
    setLoadingObj(provider);
    await api.post(`/gateways/${provider}/reset`);
    setLoadingObj(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Online Gateway Configuration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {configs.map((config) => (
          <div
            key={config.provider}
            className={`p-6 rounded-xl border-2 flex flex-col justify-between
                ${
                  config.isEnabled
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white"
                }
            `}
          >
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold">{config.provider}</h3>
                {config.isEnabled && (
                  <span className="px-3 py-1 bg-green-200 text-green-800 text-xs font-bold rounded-full">
                    ACTIVE
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-sm">
                  Status:{" "}
                  <span
                    className={
                      config.isEnabled
                        ? "font-bold text-green-700"
                        : "text-gray-500"
                    }
                  >
                    {config.isEnabled ? "Receiving Payments" : "Inactive"}
                  </span>
                </p>
                <p className="text-sm">
                  Failures:{" "}
                  <span
                    className={
                      config.failureCount > 0
                        ? "font-bold text-red-600"
                        : "text-gray-500"
                    }
                  >
                    {config.failureCount}
                  </span>
                </p>
                {config.lastFailure && (
                  <p className="text-xs text-red-500">
                    Last Error:{" "}
                    {new Date(config.lastFailure).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {!config.isEnabled && (
                <button
                  onClick={() => handleSetActive(config.provider)}
                  disabled={loadingObj !== null}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
                >
                  {loadingObj === config.provider
                    ? "Switching..."
                    : "Set Active"}
                </button>
              )}

              {config.failureCount > 0 && (
                <button
                  onClick={() => handleReset(config.provider)}
                  disabled={loadingObj !== null}
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50 text-sm font-medium disabled:opacity-50"
                >
                  Reset Monitor
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

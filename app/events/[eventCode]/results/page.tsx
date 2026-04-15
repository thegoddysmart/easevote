import { createServerApiClient } from "@/lib/api-client";
import { notFound } from "next/navigation";
import Image from "next/image";
import { BarChart, Trophy } from "lucide-react";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ eventCode: string }>;
}) {
  const { eventCode } = await params;

  // Public page — no auth token needed
  const apiClient = createServerApiClient();

  // GET /votes/results/:eventCode returns live voting results
  const data = await apiClient.get(`/votes/results/${eventCode}`).catch(() => null);

  if (!data) return notFound();

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl text-slate-900">{data.title}</h1>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="flex items-center gap-1 text-green-600 font-medium animate-pulse">
                <span className="w-2 h-2 rounded-full bg-green-600"></span>
                Live Results
              </span>
              <span>•</span>
              <span>Official Count</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        {!data.showVoteCount && (
          <div className="bg-amber-50 text-amber-800 p-4 rounded-lg text-center font-medium">
            Vote counts are currently hidden by the organizer.
          </div>
        )}

        {data.results.map((category: any) => (
          <div
            key={category.id}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <div className="bg-[#091D34] px-6 py-4 flex items-center gap-3 text-white">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h2 className="font-bold text-lg">{category.name}</h2>
            </div>

            <div className="divide-y divide-slate-100">
              {category.candidates.map((candidate: any, index: number) => {
                const totalVotesInCategory = category.candidates.reduce(
                  (acc: number, c: any) => acc + c.votes,
                  0
                );
                const percentage =
                  totalVotesInCategory > 0
                    ? (candidate.votes / totalVotesInCategory) * 100
                    : 0;

                return (
                  <div
                    key={candidate.id}
                    className="p-4 sm:p-6 hover:bg-slate-50 transition-colors flex items-center gap-4"
                  >
                    <div className="flex-shrink-0 text-slate-400 font-mono font-bold w-6 text-center">
                      {index + 1}
                    </div>

                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-slate-200 flex-shrink-0 border-2 border-white shadow-sm">
                      {candidate.image ? (
                        <Image
                          src={candidate.image}
                          alt={candidate.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-bold">
                          {candidate.code}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-slate-900 truncate pr-2">
                          {candidate.name}
                        </h3>
                        {data.showVoteCount && (
                          <div className="text-right">
                            <span className="block font-bold text-slate-900">
                              {candidate.votes.toLocaleString()}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

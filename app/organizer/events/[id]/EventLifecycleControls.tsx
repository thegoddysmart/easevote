"use client";

import { useState, useEffect } from "react";
import {
  BarChart2,
  Calendar,
  Save,
  Clock,
  Globe,
  Info,
  Lock,
} from "lucide-react";
import { useSession } from "next-auth/react";

import { api } from "@/lib/api-client";
import { clsx } from "clsx";

type EventLifecycleProps = {
  eventId: string;
  status: string;

  type: "VOTING" | "TICKETING" | "HYBRID";
  nominationStartsAt: string | null;
  nominationEndsAt: string | null;
  votingStartsAt: string | null;
  votingEndsAt: string | null;
  nominationStartTime?: string | null;
  nominationEndTime?: string | null;
  votingStartTime?: string | null;
  votingEndTime?: string | null;
  startDate: string;
  endDate: string;
  showLiveResults: boolean;
  showVoteCount: boolean;
  allowPublicNominations: boolean;
  onUpdate: () => void;
};

// ... existing helper ...
const toInputString = (dateStr: string | null) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); // Adjust to local
  return d.toISOString().slice(0, 16);
};

export default function EventLifecycleControls({
  eventId,
  status,
  type,
  nominationStartsAt,
  nominationEndsAt,
  votingStartsAt,
  votingEndsAt,
  startDate,
  endDate,
  showLiveResults,
  showVoteCount,
  allowPublicNominations,
  onUpdate,
  nominationStartTime,
  nominationEndTime,
  votingStartTime,
  votingEndTime,
}: EventLifecycleProps) {
  const { data: session } = useSession();
  const [dates, setDates] = useState({
    nomStart: nominationStartsAt || "",
    nomEnd: nominationEndsAt || "",
    voteStart: votingStartsAt || "",
    voteEnd: votingEndsAt || "",
  });
  const [loading, setLoading] = useState<string | null>(null);

  // Sync state with props when they update (e.g. on mount after creation)
  useEffect(() => {
    setDates({
      nomStart: nominationStartTime || nominationStartsAt || "",
      nomEnd: nominationEndTime || nominationEndsAt || "",
      voteStart: votingStartTime || votingStartsAt || "",
      voteEnd: votingEndTime || votingEndsAt || "",
    });
  }, [
    nominationStartsAt,
    nominationEndsAt,
    votingStartsAt,
    votingEndsAt,
    nominationStartTime,
    nominationEndTime,
    votingStartTime,
    votingEndTime,
  ]);

  const getOrdinalNum = (n: number) => {
    return (
      n +
      (n > 0
        ? ["th", "st", "nd", "rd"][
            (n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10
          ]
        : "")
    );
  };

  const formatInputDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const day = getOrdinalNum(date.getDate());
    const month = date.toLocaleString("en-GB", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };



  const handleDateTimeChange = (
    field: keyof typeof dates,
    part: "date" | "time",
    value: string,
  ) => {
    setDates((prev) => {
      const current = prev[field] || "";
      let [d = "", t = field.includes("Start") ? "09:00" : "21:00"] =
        current.split("T");
      if (part === "date") d = value;
      if (part === "time") t = value;

      if (!d) return { ...prev, [field]: "" };
      return { ...prev, [field]: `${d}T${t}` };
    });
  };

  const saveTimelines = async () => {
    // 1. Cross-Validation Boundaries
    const masterStart = new Date(startDate).getTime();
    const masterEnd = new Date(endDate).getTime();

    const phasesToCheck = [
      { label: "Nomination Start", dateStr: dates.nomStart },
      { label: "Nomination End", dateStr: dates.nomEnd },
      { label: "Voting Start", dateStr: dates.voteStart },
      { label: "Voting End", dateStr: dates.voteEnd },
    ];

    for (const phase of phasesToCheck) {
      if (phase.dateStr) {
        const phaseTime = new Date(phase.dateStr).getTime();
        if (phaseTime < masterStart) {
          alert(`Validation Error: ${phase.label} Date cannot precede the master Event Start Date.`);
          return;
        }
        if (phaseTime > masterEnd) {
          alert(`Validation Error: ${phase.label} Date cannot exceed the master Event End Date.`);
          return;
        }
      }
    }

    if (dates.nomEnd && dates.voteStart && new Date(dates.nomEnd).getTime() > new Date(dates.voteStart).getTime()) {
      alert("Validation Error: Nomination End Date cannot overlap beyond the Voting Start Date.");
      return;
    }

    setLoading("saving");
    try {
      // Client-side validation
      if (dates.nomStart && dates.nomEnd && dates.nomStart >= dates.nomEnd) {
        alert("Nomination End Date must be after Start Date");
        setLoading(null);
        return;
      }
      if (
        dates.voteStart &&
        dates.voteEnd &&
        dates.voteStart >= dates.voteEnd
      ) {
        alert("Voting End Date must be after Start Date");
        setLoading(null);
        return;
      }
      // Overlap check disabled to allow flexibility if needed, relying on server or user discretion
      // if (dates.nomEnd && dates.voteStart && dates.voteStart < dates.nomEnd) { ... }

      const payload = {
        nominationStartsAt: dates.nomStart ? new Date(dates.nomStart).toISOString() : null,
        nominationEndsAt: dates.nomEnd ? new Date(dates.nomEnd).toISOString() : null,
        votingStartsAt: dates.voteStart ? new Date(dates.voteStart).toISOString() : null,
        votingEndsAt: dates.voteEnd ? new Date(dates.voteEnd).toISOString() : null,
        nominationStartTime: dates.nomStart ? new Date(dates.nomStart).toISOString() : null,
        nominationEndTime: dates.nomEnd ? new Date(dates.nomEnd).toISOString() : null,
        votingStartTime: dates.voteStart ? new Date(dates.voteStart).toISOString() : null,
        votingEndTime: dates.voteEnd ? new Date(dates.voteEnd).toISOString() : null,
      };

      await api.put(`/events/${eventId}`, payload);
      onUpdate();
      alert("Timelines updated successfully!");
    } catch (err: any) {
      console.error(err);
      
      const errMsg = err.response?.data?.message || err.message;
      if (errMsg === "Cannot modify live event" || errMsg.includes("Cannot modify live")) {
        alert("🔒 Security Lock: The system cannot modify timelines while the event is currently LIVE to prevent tampering. Please contact the administrator to temporarily pause the event status if you need to restructure dates.");
      } else {
        alert(errMsg || "Failed to save timelines");
      }
      
      setLoading(null);
    } finally {
      setLoading(null);
    }
  };

  const toggleVisibility = async (
    key: "showLiveResults" | "showVoteCount" | "allowPublicNominations",
  ) => {
    setLoading(key);
    try {
      let newValue;
      if (key === "showLiveResults") newValue = !showLiveResults;
      else if (key === "showVoteCount") newValue = !showVoteCount;
      else newValue = !allowPublicNominations;

      await api.put(`/events/${eventId}`, { [key]: newValue });
      onUpdate();
    } catch (e: any) {
      console.error(e);
      const errMsg = e?.message || "";
      if (errMsg.includes("modify live")) {
        alert("🔒 This setting is currently locked because the event is LIVE. \n\nTo enable/disable Nominations on a live event, please use the dedicated 'Nomination Settings' page which allows real-time overrides.");
      } else {
        alert(e instanceof Error ? e.message : "Failed to update setting");
      }
    } finally {
      setLoading(null);
    }
  };

  const handleSubmitForReview = async () => {
    // Determine if timelines are set in state OR in props (covering both naming variations)
    const hasVotingStart = dates.voteStart || votingStartsAt || votingStartTime;
    const hasVotingEnd = dates.voteEnd || votingEndsAt || votingEndTime;

    // 1. Basic completeness check
    if (type === "VOTING" && (!hasVotingStart || !hasVotingEnd)) {
      alert("Please set your voting timelines before submitting for review.");
      return;
    }

    // 2. Check for unsaved changes (dates set in state but different from props)
    const isSaved = 
      dates.voteStart === (votingStartTime || votingStartsAt || "") &&
      dates.voteEnd === (votingEndTime || votingEndsAt || "");

    if (!isSaved) {
      alert("You have unsaved timeline changes. Please click 'Save Timelines' before submitting for review.");
      return;
    }

    if (!confirm("Are you sure you want to submit this event for review? You will not be able to edit it until the review is complete.")) return;

    setLoading("submit");
    try {
      await api.patch(`/events/${eventId}/submit`);
      onUpdate();
      alert("Event submitted for review successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to submit for review");
    } finally {
      setLoading(null);
    }
  };

  const handlePublish = async () => {
    setLoading("publish");
    try {
      await api.patch(`/events/${eventId}/publish`);
      onUpdate();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Publish failed");
    } finally {
      setLoading(null);
    }
  };

  const isPublished = status === "PUBLISHED" || status === "LIVE";
  const isApproved = status === "APPROVED";
  const showVotingControls = type === "VOTING" || type === "HYBRID";

  // Phase Status Evaluator
  const getPhaseStatus = (start: string, end: string) => {
    if (!start || !end)
      return { label: "NOT SET", color: "bg-slate-100 text-slate-500" };
    const now = new Date().toISOString().slice(0, 16); // Simple string comp enough for UI state
    if (now < start)
      return { label: "SCHEDULED", color: "bg-amber-100 text-amber-700" };
    if (now >= start && now < end)
      return { label: "ACTIVE", color: "bg-green-100 text-green-700" };
    return { label: "ENDED", color: "bg-slate-200 text-slate-600" };
  };

  const nomStatus = getPhaseStatus(dates.nomStart, dates.nomEnd);
  const voteStatus = getPhaseStatus(dates.voteStart, dates.voteEnd);

  return (
    <div className="space-y-4">
      {/* SUBMIT FOR REVIEW ACTION */}
      {status === "DRAFT" && (
        <div className="space-y-1">
          <button
            disabled={loading !== null}
            onClick={handleSubmitForReview}
            className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left border cursor-pointer bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
          >
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
              <span className="font-medium block text-blue-700">Submit for Review</span>
              <span className="text-xs text-blue-600">Send to administrators for approval</span>
            </div>
          </button>
        </div>
      )}

      {/* PUBLISH ACTION */}
      {isApproved && !isPublished && (
        <div className="space-y-1">
          <button
            disabled={loading !== null || session?.user?.status === "PENDING"}
            onClick={handlePublish}
            className={clsx(
              "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left border cursor-pointer",
              session?.user?.status === "PENDING"
                ? "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-green-50 border-green-200 hover:bg-green-100 text-green-700",
            )}
          >
            {session?.user?.status === "PENDING" ? (
              <Lock className="h-5 w-5 text-slate-300" />
            ) : (
              <Globe className="h-5 w-5 text-green-600" />
            )}
            <div>
              <span
                className={clsx(
                  "font-medium block",
                  session?.user?.status === "PENDING"
                    ? "text-slate-400"
                    : "text-green-700",
                )}
              >
                Publish Event
              </span>
              <span
                className={clsx(
                  "text-xs",
                  session?.user?.status === "PENDING"
                    ? "text-slate-300"
                    : "text-green-600",
                )}
              >
                {session?.user?.status === "PENDING"
                  ? "Account must be approved to publish"
                  : "Make event visible to public"}
              </span>
            </div>
          </button>
        </div>
      )}

      {showVotingControls && (
        <>
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-500" /> Phase Management
              </h3>
              <button
                onClick={saveTimelines}
                disabled={loading !== null}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
              >
                <Save size={16} />{" "}
                {loading === "saving" ? "Saving..." : "Save Timelines"}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Nomination Phase */}
              <div
                className={clsx(
                  "p-4 rounded-lg border",
                  nomStatus.label === "ACTIVE"
                    ? "border-green-200 bg-green-50/30"
                    : "border-slate-200 bg-slate-50/50",
                )}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-slate-700 text-sm uppercase">
                    Nomination Phase
                  </span>
                  <span
                    className={clsx(
                      "text-xs font-bold px-2 py-0.5 rounded",
                      nomStatus.color,
                    )}
                  >
                    {nomStatus.label}
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Start Date & Time
                    </label>
                    <div className="flex gap-2">
                       <div className="relative flex-1 group">
                         <input
                          type="date"
                          value={dates.nomStart ? dates.nomStart.split('T')[0] : ""}
                          onChange={(e) => handleDateTimeChange("nomStart", "date", e.target.value)}
                          onClick={(e) => e.currentTarget.showPicker()}
                          onKeyDown={(e) => e.preventDefault()}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 peer"
                        />
                        <div className="w-full h-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white flex items-center transition-all peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:border-primary-500 peer-hover:border-primary-300">
                          <span className={dates.nomStart ? "text-slate-900" : "text-slate-400"}>
                            {dates.nomStart ? formatInputDate(dates.nomStart.split('T')[0]) : "Select date"}
                          </span>
                        </div>
                      </div>
                      <input
                        type="time"
                        value={dates.nomStart ? (dates.nomStart.split('T')[1]?.substring(0, 5) || "09:00") : "09:00"}
                        onChange={(e) => handleDateTimeChange("nomStart", "time", e.target.value)}
                        className="w-32 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-primary-300 transition-all cursor-pointer bg-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      End Date & Time
                    </label>
                    <div className="flex gap-2">
                       <div className="relative flex-1 group">
                         <input
                          type="date"
                          value={dates.nomEnd ? dates.nomEnd.split('T')[0] : ""}
                          min={dates.nomStart ? dates.nomStart.split('T')[0] : undefined}
                          onChange={(e) => handleDateTimeChange("nomEnd", "date", e.target.value)}
                          onClick={(e) => e.currentTarget.showPicker()}
                          onKeyDown={(e) => e.preventDefault()}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 peer"
                        />
                        <div className="w-full h-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white flex items-center transition-all peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:border-primary-500 peer-hover:border-primary-300">
                          <span className={dates.nomEnd ? "text-slate-900" : "text-slate-400"}>
                            {dates.nomEnd ? formatInputDate(dates.nomEnd.split('T')[0]) : "Select date"}
                          </span>
                        </div>
                      </div>
                      <input
                        type="time"
                        value={dates.nomEnd ? (dates.nomEnd.split('T')[1]?.substring(0, 5) || "21:00") : "21:00"}
                        onChange={(e) => handleDateTimeChange("nomEnd", "time", e.target.value)}
                        className="w-32 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-primary-300 transition-all cursor-pointer bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Voting Phase */}
              <div
                className={clsx(
                  "p-4 rounded-lg border",
                  voteStatus.label === "ACTIVE"
                    ? "border-green-200 bg-green-50/30"
                    : "border-slate-200 bg-slate-50/50",
                )}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-slate-700 text-sm uppercase">
                    Voting Phase
                  </span>
                  <span
                    className={clsx(
                      "text-xs font-bold px-2 py-0.5 rounded",
                      voteStatus.color,
                    )}
                  >
                    {voteStatus.label}
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Start Date & Time
                    </label>
                    <div className="flex gap-2">
                       <div className="relative flex-1 group">
                         <input
                          type="date"
                          value={dates.voteStart ? dates.voteStart.split('T')[0] : ""}
                          onChange={(e) => handleDateTimeChange("voteStart", "date", e.target.value)}
                          onClick={(e) => e.currentTarget.showPicker()}
                          onKeyDown={(e) => e.preventDefault()}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 peer"
                        />
                        <div className="w-full h-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white flex items-center transition-all peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:border-primary-500 peer-hover:border-primary-300">
                          <span className={dates.voteStart ? "text-slate-900" : "text-slate-400"}>
                            {dates.voteStart ? formatInputDate(dates.voteStart.split('T')[0]) : "Select date"}
                          </span>
                        </div>
                      </div>
                      <input
                        type="time"
                        value={dates.voteStart ? (dates.voteStart.split('T')[1]?.substring(0, 5) || "09:00") : "09:00"}
                        onChange={(e) => handleDateTimeChange("voteStart", "time", e.target.value)}
                        className="w-32 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-primary-300 transition-all cursor-pointer bg-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      End Date & Time
                    </label>
                    <div className="flex gap-2">
                       <div className="relative flex-1 group">
                         <input
                          type="date"
                          value={dates.voteEnd ? dates.voteEnd.split('T')[0] : ""}
                          min={dates.voteStart ? dates.voteStart.split('T')[0] : undefined}
                          onChange={(e) => handleDateTimeChange("voteEnd", "date", e.target.value)}
                          onClick={(e) => e.currentTarget.showPicker()}
                          onKeyDown={(e) => e.preventDefault()}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 peer"
                        />
                        <div className="w-full h-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white flex items-center transition-all peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:border-primary-500 peer-hover:border-primary-300">
                          <span className={dates.voteEnd ? "text-slate-900" : "text-slate-400"}>
                            {dates.voteEnd ? formatInputDate(dates.voteEnd.split('T')[0]) : "Select date"}
                          </span>
                        </div>
                      </div>
                      <input
                        type="time"
                        value={dates.voteEnd ? (dates.voteEnd.split('T')[1]?.substring(0, 5) || "21:00") : "21:00"}
                        onChange={(e) => handleDateTimeChange("voteEnd", "time", e.target.value)}
                        className="w-32 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-primary-300 transition-all cursor-pointer bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-slate-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <Info className="w-4 h-4 text-blue-600 mt-0.5" />
              <p>
                Set the windows for nominations and voting. The system will
                automatically switch phases based on the current time.
              </p>
            </div>
          </div>

          {/* VISIBILITY CONTROLS */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-slate-500" /> Results &
                Visibility
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Live Results Toggle */}
              <div
                className={clsx(
                  "p-4 rounded-lg border border-slate-200 flex items-center justify-between transition-colors",
                  showLiveResults ? "bg-slate-50" : "bg-white",
                )}
              >
                <div>
                  <p className="font-medium text-slate-900">Live Results Tab</p>
                  <p className="text-sm text-slate-500">
                    Show "Results" tab on public page
                  </p>
                </div>
                <button
                  onClick={() => toggleVisibility("showLiveResults")}
                  disabled={loading !== null}
                  className={clsx(
                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    showLiveResults ? "bg-green-600" : "bg-slate-200",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={clsx(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      showLiveResults ? "translate-x-5" : "translate-x-0",
                    )}
                  />
                </button>
              </div>

              {/* Vote Counts Toggle */}
              <div
                className={clsx(
                  "p-4 rounded-lg border border-slate-200 flex items-center justify-between transition-colors",
                  showVoteCount ? "bg-slate-50" : "bg-white",
                )}
              >
                <div>
                  <p className="font-medium text-slate-900">Vote Counts</p>
                  <p className="text-sm text-slate-500">
                    Show numeric vote counts publicly
                  </p>
                </div>
                <button
                  onClick={() => toggleVisibility("showVoteCount")}
                  disabled={loading !== null}
                  className={clsx(
                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    showVoteCount ? "bg-green-600" : "bg-slate-200",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={clsx(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      showVoteCount ? "translate-x-5" : "translate-x-0",
                    )}
                  />
                </button>
              </div>

              {/* Public Nominations Toggle */}
              <div
                className={clsx(
                  "p-4 rounded-lg border border-slate-200 flex items-center justify-between transition-colors md:col-span-2",
                  allowPublicNominations ? "bg-slate-50" : "bg-white",
                )}
              >
                <div>
                  <p className="font-medium text-slate-900">
                    Accept Public Nominations
                  </p>
                  <p className="text-sm text-slate-500">
                    Enable the public form for attendees to submit nominees
                    manually
                  </p>
                </div>
                <button
                  onClick={() => toggleVisibility("allowPublicNominations")}
                  disabled={loading !== null}
                  className={clsx(
                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    allowPublicNominations ? "bg-green-600" : "bg-slate-200",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={clsx(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      allowPublicNominations ? "translate-x-5" : "translate-x-0",
                    )}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <Info className="w-4 h-4 text-slate-400 mt-0.5" />
              <p>
                <strong>Tip:</strong> You can enable "Live Results Tab" but
                disable "Vote Counts" to show only relative rankings without
                revealing exact numbers. Turn both ON to show full results.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

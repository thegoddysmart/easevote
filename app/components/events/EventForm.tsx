"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  Calendar,
  MapPin,
  Vote,
  Globe,
  Lock,
  Image as ImageIcon,
  AlertCircle,
  Ticket,
  Plus,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { clsx } from "clsx";

type TicketTypeForm = {
  id: string;
  name: string;
  description: string;
  price: string;
  quantity: string;
  maxPerOrder: string;
  soldCount: number;
  isNew?: boolean;
};

type Event = {
  id: string;
  eventCode: string;
  title: string;
  description: string | null;
  type: "VOTING" | "TICKETING" | "HYBRID";
  status: string;
  coverImage: string | null;
  bannerImage: string | null;
  startDate: string;
  endDate: string;
  costPerVote: number | null;
  minVotesPerPurchase: number;
  maxVotesPerPurchase: number | null;
  location: string | null;
  venue: string | null;
  isPublic: boolean;
  allowPublicNominations: boolean;
  nominationStartsAt?: string | null;
  nominationEndsAt?: string | null;
  nominationStartTime?: string | null;
  nominationEndTime?: string | null;
  nominationDeadline: string | null;
  votingStartsAt?: string | null;
  votingEndsAt?: string | null;
  votingStartTime?: string | null;
  votingEndTime?: string | null;
  imageUrl: string | null;
  imagePublicId: string | null;
  ticketTypes?: Array<{
    id: string;
    name: string;
    description: string | null;
    price: number;
    quantity: number;
    soldCount: number;
    maxPerOrder: number;
  }>;
};

interface EventFormProps {
  eventId: string;
  backUrl?: string; // Where to go on cancel/back (e.g. /organizer/events or /admin/events)
}

export function EventForm({ eventId, backUrl }: EventFormProps) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "VOTING" as "VOTING" | "TICKETING" | "HYBRID",
    startDate: "",
    startTime: "09:00",
    endDate: "",
    endTime: "21:00",
    votingStartDate: "",
    votingStartTime: "09:00",
    votingEndDate: "",
    votingEndTime: "17:00",
    costPerVote: "",
    minVotesPerPurchase: "1",
    maxVotesPerPurchase: "",
    location: "",
    venue: "",
    isPublic: true,
    allowPublicNominations: false,
    imageUrl: "",
    imagePublicId: "",
  });

  const [ticketTypes, setTicketTypes] = useState<TicketTypeForm[]>([]);
  const [deletedTicketTypeIds, setDeletedTicketTypeIds] = useState<string[]>(
    [],
  );

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addTicketType = () => {
    setTicketTypes((prev) => [
      ...prev,
      {
        id: generateId(),
        name: "",
        description: "",
        price: "",
        quantity: "",
        maxPerOrder: "10",
        soldCount: 0,
        isNew: true,
      },
    ]);
  };

  const updateTicketType = (
    id: string,
    field: keyof TicketTypeForm,
    value: string | number,
  ) => {
    setTicketTypes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  };

  const removeTicketType = (id: string) => {
    const ticket = ticketTypes.find((t) => t.id === id);
    if (ticket && ticket.soldCount > 0) {
      setError("Cannot remove a ticket type that has sales");
      return;
    }

    if (ticket && !confirm(`Are you sure you want to remove the ticket type "${ticket.name || "Untitled"}"?`)) {
      return;
    }

    if (ticketTypes.length > 1) {
      if (ticket && !ticket.isNew) {
        setDeletedTicketTypeIds((prev) => [...prev, id]);
      }
      setTicketTypes((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const parseDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return { date: "", time: "09:00" };
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return { date: "", time: "09:00" };
    
    // Use local components for the UI to prevent UTC shifting in <input type="date">
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return { date: `${year}-${month}-${day}`, time: `${hours}:${minutes}` };
  };

  const formatInputDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await api.get(`/events/${eventId}`);
        setEvent(data.data || data.event || data);

        const d = data.data || data.event || data;

        const start = parseDateTime(d.startDate);
        const end = parseDateTime(d.endDate);
        const voteS = parseDateTime(d.votingStartsAt || d.votingStartTime);
        const voteE = parseDateTime(d.votingEndsAt || d.votingEndTime);
        const nomS = parseDateTime(d.nominationStartsAt || d.nominationStartTime);
        // Backend often uses nominationDeadline as the primary end marker
        const nomE = parseDateTime(d.nominationEndsAt || d.nominationEndTime || d.nominationDeadline);

        setFormData({
          title: d.title || "",
          description: d.description || "",
          type: d.type || "VOTING",
          startDate: start.date,
          startTime: start.time,
          endDate: end.date,
          endTime: end.time,
          votingStartDate: voteS.date,
          votingStartTime: voteS.time,
          votingEndDate: voteE.date,
          votingEndTime: voteE.time,
          costPerVote:
            d.costPerVote?.toString() || d.votePrice?.toString() || "",
          minVotesPerPurchase:
            d.minVotesPerPurchase?.toString() ||
            d.minVotes?.toString() ||
            "1",
          maxVotesPerPurchase:
            d.maxVotesPerPurchase?.toString() ||
            d.maxVotes?.toString() ||
            "",
          location: d.location || "",
          venue: d.venue || "",
          isPublic: d.isPublic ?? true,
          allowPublicNominations:
            d.allowPublicNominations ?? d.allowNominations ?? false,
          imageUrl: d.imageUrl || d.coverImage || "",
          imagePublicId: d.imagePublicId || "",
        });

        if (data.ticketTypes && data.ticketTypes.length > 0) {
          setTicketTypes(
            data.ticketTypes.map(
              (t: {
                id: string;
                name: string;
                description: string | null;
                price: number;
                quantity: number;
                soldCount: number;
                maxPerOrder: number;
              }) => ({
                id: t.id,
                name: t.name,
                description: t.description || "",
                price: t.price.toString(),
                quantity: t.quantity.toString(),
                maxPerOrder: t.maxPerOrder?.toString() || "10",
                soldCount: t.soldCount || 0,
                isNew: false,
              }),
            ),
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const startISO = formData.startDate ? new Date(`${formData.startDate}T${formData.startTime}:00`).toISOString() : undefined;
      const endISO = formData.endDate ? new Date(`${formData.endDate}T${formData.endTime}:00`).toISOString() : undefined;
      const voteS_ISO = formData.votingStartDate ? new Date(`${formData.votingStartDate}T${formData.votingStartTime}:00`).toISOString() : null;
      const voteE_ISO = formData.votingEndDate ? new Date(`${formData.votingEndDate}T${formData.votingEndTime}:00`).toISOString() : null;
      const { 
        startDate, startTime, endDate, endTime, 
        votingStartDate, votingStartTime, votingEndDate, votingEndTime,
        ...cleanedData 
      } = formData;

      const payload: Record<string, unknown> = {
        ...cleanedData,
        startDate: startISO,
        endDate: endISO,
        // Send all possible keys for phase start/end to ensure compatibility
        votingStartsAt: voteS_ISO,
        votingEndsAt: voteE_ISO,
        votingStartTime: voteS_ISO,
        votingEndTime: voteE_ISO,
        costPerVote: formData.costPerVote ? parseFloat(formData.costPerVote) : null,
        minVotesPerPurchase: parseInt(formData.minVotesPerPurchase) || 1,
        maxVotesPerPurchase: formData.maxVotesPerPurchase ? parseInt(formData.maxVotesPerPurchase) : null,
        allowPublicNominations: formData.allowPublicNominations,
        imageUrl: formData.imageUrl,
        imagePublicId: formData.imagePublicId,
      };

      const result = await api.put(`/events/${eventId}`, payload);

      if (!result.id && !result._id && !result.success) {
        throw new Error("Failed to update event");
      }

      if (formData.type === "TICKETING" || formData.type === "HYBRID") {
        for (const id of deletedTicketTypeIds) {
          await api.delete(`/events/${eventId}/ticket-types/${id}`);
        }

        for (const t of ticketTypes) {
          const tPayload = {
            name: t.name,
            description: t.description || null,
            price: parseFloat(t.price),
            quantity: parseInt(t.quantity),
            maxPerOrder: parseInt(t.maxPerOrder) || 10,
          };

          if (t.isNew) {
            await api.post(`/events/${eventId}/ticket-types`, tPayload);
          } else {
            await api.put(`/events/${eventId}/ticket-types/${t.id}`, tPayload);
          }
        }
      }

      setSuccess("Event updated successfully!");
      setDeletedTicketTypeIds([]);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-8 bg-slate-200 rounded w-64 animate-pulse" />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 h-96 animate-pulse" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">{error || "Event not found"}</p>
        </div>
      </div>
    );
  }

  const isLive = event.status === "LIVE";
  const backHref = backUrl || `/organizer/events/${eventId}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={backHref}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Event</h1>
            <p className="text-slate-500">{event.title}</p>
          </div>
        </div>
      </div>

      {isLive && (
        <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            This event is currently live. Only certain fields can be edited. To
            make major changes, please pause the event first.
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Basic Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={isLive}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <ImageIcon className="h-4 w-4 inline mr-1" />
                Cover Image
              </label>
              <div className="flex flex-col gap-4">
                {formData.imageUrl && (
                  <div className="relative w-full h-48 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        if (formData.imagePublicId) {
                          await api.deleteImage(formData.imagePublicId).catch(console.error);
                        }
                        setFormData(prev => ({ ...prev, imageUrl: "", imagePublicId: "" }));
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                <label className={clsx(
                  "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors",
                  formData.imageUrl && "h-12 border-none bg-slate-100 hover:bg-slate-200"
                )}>
                  <div className="flex flex-center gap-2">
                    <ImageIcon className="h-5 w-5 text-slate-400" />
                    <span className="text-sm text-slate-600 font-medium">
                      {formData.imageUrl ? "Replace cover image" : "Upload cover image"}
                    </span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      // Validate
                      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
                        alert("Invalid type");
                        return;
                      }
                      if (file.size > 5 * 1024 * 1024) {
                        alert("File too large");
                        return;
                      }

                      const uploadForm = new FormData();
                      uploadForm.append("image", file);
                      uploadForm.append("folder", "events");

                      try {
                        if (formData.imagePublicId) {
                          await api.deleteImage(formData.imagePublicId).catch(console.error);
                        }
                        const res = await api.uploadFormData("/upload/image", uploadForm);
                        setFormData(prev => ({
                          ...prev,
                          imageUrl: res.url || res.imageUrl,
                          imagePublicId: res.publicId
                        }));
                      } catch (err) {
                        alert("Upload failed");
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Event Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  disabled={isLive}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="VOTING">Voting</option>
                  <option value="TICKETING">Ticketing</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Visibility
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={() =>
                        setFormData((prev) => ({ ...prev, isPublic: true }))
                      }
                      className="w-4 h-4 text-primary-600"
                    />
                    <Globe className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-700">Public</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="isPublic"
                      checked={!formData.isPublic}
                      onChange={() =>
                        setFormData((prev) => ({ ...prev, isPublic: false }))
                      }
                      className="w-4 h-4 text-primary-600"
                    />
                    <Lock className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-700">Private</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            General Event Duration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                <Calendar className="h-4 w-4 inline mr-1" />
                Start Date & Time *
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1 group">
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    disabled={isLive}
                    onClick={(e) => e.currentTarget.showPicker()}
                    onKeyDown={(e) => e.preventDefault()}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 peer disabled:cursor-not-allowed"
                    required
                  />
                  <div className="w-full h-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white flex items-center transition-all peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:border-primary-500 peer-hover:border-primary-300 disabled:bg-slate-100">
                    <span className={formData.startDate ? "text-slate-900" : "text-slate-400"}>
                      {formData.startDate ? formatInputDate(formData.startDate) : "mm/dd/yyyy"}
                    </span>
                  </div>
                </div>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  disabled={isLive}
                  className="w-32 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-primary-300 transition-all cursor-pointer bg-white disabled:bg-slate-100"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                <Calendar className="h-4 w-4 inline mr-1" />
                End Date & Time *
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1 group">
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    min={formData.startDate}
                    onChange={handleChange}
                    disabled={isLive}
                    onClick={(e) => e.currentTarget.showPicker()}
                    onKeyDown={(e) => e.preventDefault()}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 peer disabled:cursor-not-allowed"
                    required
                  />
                  <div className="w-full h-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white flex items-center transition-all peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:border-primary-500 peer-hover:border-primary-300 disabled:bg-slate-100">
                    <span className={formData.endDate ? "text-slate-900" : "text-slate-400"}>
                      {formData.endDate ? formatInputDate(formData.endDate) : "mm/dd/yyyy"}
                    </span>
                  </div>
                </div>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  disabled={isLive}
                  className="w-32 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-primary-300 transition-all cursor-pointer bg-white disabled:bg-slate-100"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Location
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Venue Name
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g., National Theatre"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                City / Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Accra, Ghana"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {(formData.type === "VOTING" || formData.type === "HYBRID") && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Voting Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Vote Price (GHS)
                </label>
                <input
                  type="number"
                  name="costPerVote"
                  value={formData.costPerVote}
                  onChange={handleChange}
                  disabled={isLive}
                  step="0.01"
                  min="0"
                  placeholder="1.00"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Min Votes per Transaction
                </label>
                <input
                  type="number"
                  name="minVotesPerPurchase"
                  value={formData.minVotesPerPurchase}
                  onChange={handleChange}
                  disabled={isLive}
                  min="1"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Max Votes per Transaction
                </label>
                <input
                  type="number"
                  name="maxVotesPerPurchase"
                  value={formData.maxVotesPerPurchase}
                  onChange={handleChange}
                  disabled={isLive}
                  min="1"
                  placeholder="Unlimited"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <h4 id="voting-timelines" className="text-sm font-semibold text-slate-900 mb-4">Voting Phase Timelines</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">Voting Start</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1 group">
                      <input type="date" name="votingStartDate" value={formData.votingStartDate} onChange={handleChange} disabled={isLive} onClick={(e) => e.currentTarget.showPicker()} onKeyDown={(e) => e.preventDefault()} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 peer disabled:cursor-not-allowed" />
                      <div className="w-full h-full px-3 py-2 border border-slate-200 rounded-lg bg-white flex items-center transition-all peer-focus:ring-2 peer-focus:ring-primary-500">
                        <span className={formData.votingStartDate ? "text-slate-900 text-sm" : "text-slate-400 text-sm"}>{formData.votingStartDate ? formatInputDate(formData.votingStartDate) : "mm/dd/yyyy"}</span>
                      </div>
                    </div>
                    <input type="time" name="votingStartTime" value={formData.votingStartTime} onChange={handleChange} disabled={isLive} className="w-28 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white disabled:bg-slate-100" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">Voting End</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1 group">
                      <input type="date" name="votingEndDate" value={formData.votingEndDate} min={formData.votingStartDate} onChange={handleChange} disabled={isLive} onClick={(e) => e.currentTarget.showPicker()} onKeyDown={(e) => e.preventDefault()} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 peer disabled:cursor-not-allowed" />
                      <div className="w-full h-full px-3 py-2 border border-slate-200 rounded-lg bg-white flex items-center transition-all peer-focus:ring-2 peer-focus:ring-primary-500">
                        <span className={formData.votingEndDate ? "text-slate-900 text-sm" : "text-slate-400 text-sm"}>{formData.votingEndDate ? formatInputDate(formData.votingEndDate) : "mm/dd/yyyy"}</span>
                      </div>
                    </div>
                    <input type="time" name="votingEndTime" value={formData.votingEndTime} onChange={handleChange} disabled={isLive} className="w-28 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white disabled:bg-slate-100" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="allowPublicNominations"
                  checked={formData.allowPublicNominations}
                  onChange={handleChange}
                  disabled={isLive}
                  className="w-4 h-4 text-primary-600 rounded disabled:cursor-not-allowed"
                />
                <span className="text-sm text-slate-700">
                  Allow public nominations for this event
                </span>
              </label>

              {/* Nomination Phase Timelines Removed - Managed in Nomination Settings */}
            </div>
          </div>
        )}

        {(formData.type === "TICKETING" || formData.type === "HYBRID") && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Ticket Types
                </h3>
                <p className="text-sm text-slate-500">
                  Manage ticket tiers with their own prices and quantities
                </p>
              </div>
              {!isLive && (
                <button
                  type="button"
                  onClick={addTicketType}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Ticket Type
                </button>
              )}
            </div>

            {ticketTypes.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Ticket className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>No ticket types configured</p>
                <button
                  type="button"
                  onClick={addTicketType}
                  className="mt-3 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Add your first ticket type
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {ticketTypes.map((ticket, index) => (
                  <div
                    key={ticket.id}
                    className="border border-slate-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-500">
                          Ticket Type {index + 1}
                        </span>
                        {ticket.soldCount > 0 && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            {ticket.soldCount} sold
                          </span>
                        )}
                      </div>
                      {ticketTypes.length > 1 &&
                        !isLive &&
                        ticket.soldCount === 0 && (
                          <button
                            type="button"
                            onClick={() => removeTicketType(ticket.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={ticket.name}
                          onChange={(e) =>
                            updateTicketType(ticket.id, "name", e.target.value)
                          }
                          disabled={isLive && ticket.soldCount > 0}
                          placeholder="e.g., Regular, VIP, VVIP"
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={ticket.description}
                          onChange={(e) =>
                            updateTicketType(
                              ticket.id,
                              "description",
                              e.target.value,
                            )
                          }
                          placeholder="e.g., Standard entry, Front row access"
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Price (GHS) *
                        </label>
                        <input
                          type="number"
                          value={ticket.price}
                          onChange={(e) =>
                            updateTicketType(ticket.id, "price", e.target.value)
                          }
                          disabled={isLive}
                          step="0.01"
                          min="0"
                          placeholder="200.00"
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Quantity *
                          </label>
                          <input
                            type="number"
                            value={ticket.quantity}
                            onChange={(e) =>
                              updateTicketType(
                                ticket.id,
                                "quantity",
                                e.target.value,
                              )
                            }
                            disabled={
                              isLive &&
                              parseInt(ticket.quantity) <= ticket.soldCount
                            }
                            min={ticket.soldCount || 1}
                            placeholder="500"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Max per Order
                          </label>
                          <input
                            type="number"
                            value={ticket.maxPerOrder}
                            onChange={(e) =>
                              updateTicketType(
                                ticket.id,
                                "maxPerOrder",
                                e.target.value,
                              )
                            }
                            min="1"
                            placeholder="10"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          {/* <Link
            href={backHref}
            className="px-6 py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link> */}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

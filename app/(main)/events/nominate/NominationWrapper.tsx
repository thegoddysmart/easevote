"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  UploadCloud,
  CheckCircle,
  Loader2,
  AlertCircle,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

interface NominationWrapperProps {
  event: any;
  formConfig: any; // EventNominationForm with fields
}

export default function NominationWrapper({
  event,
  formConfig,
}: NominationWrapperProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [nominationType, setNominationType] = useState<"SELF" | "THIRD_PARTY">(
    "SELF"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // File Upload State (Simulated for now, would be S3/UploadThing in prod)
  const [photoUrl, setPhotoUrl] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const formData = watch();

  const onSubmit = async (data: any) => {
    if (!photoUrl) {
      toast.error("Please upload a photo of the nominee");
      return;
    }

    setIsSubmitting(true);
    try {
      // Construct payload
      const payload = {
        eventId: event.id,
        categoryId: data.categoryId,
        nominationType,
        nomineeName:
          nominationType === "SELF" ? data.fullName : data.nomineeName,
        nomineeEmail:
          nominationType === "SELF" ? data.email : data.nomineeEmail,
        nomineePhone:
          nominationType === "SELF" ? data.phone : data.nomineePhone,
        bio: data.bio,
        nomineePhotoUrl: photoUrl,
        nominatorName:
          nominationType === "THIRD_PARTY" ? data.nominatorName : undefined,
        nominatorEmail:
          nominationType === "THIRD_PARTY" ? data.nominatorEmail : undefined,
        nominatorPhone:
          nominationType === "THIRD_PARTY" ? data.nominatorPhone : undefined,
        customFields: {
          // Extract custom fields based on formConfig.fields keys
          ...formConfig?.fields.reduce((acc: any, field: any) => {
            acc[field.key] = data[field.key];
            return acc;
          }, {}),
        },
      };

      const result = await api.post("/nominations", payload);

      if (result.success) {
        setIsSuccess(true);
        window.scrollTo(0, 0);
      } else {
        toast.error(result.message || "Failed to submit nomination");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="text-green-600" size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Nomination Received!
        </h2>
        <p className="text-gray-600 mb-8">
          Thank you for submitting your nomination. Our team will review your
          application and get back to you shortly.
        </p>

        {formConfig?.whatsappLink && (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="text-green-800 font-bold text-lg mb-2">
              Join the Nominee Community!
            </h3>
            <p className="text-green-700 text-sm mb-4">
              Connect with other nominees and get updates.
            </p>
            <a
              href={formConfig.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
            >
              <MessageCircle size={20} /> Join WhatsApp Group
            </a>
          </div>
        )}
        <button
          onClick={() => (window.location.href = `/events/${event.eventCode}`)}
          className="bg-primary-600 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-700 transition-colors"
        >
          Return to Event
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-primary-600 font-medium mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Nomination Form
        </h1>
        <p className="text-gray-600">{event.title}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Progress Bar */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <div
            className={`h-2 flex-1 rounded-full ${
              step >= 1 ? "bg-magenta-600" : "bg-gray-200"
            }`}
          />
          <div
            className={`h-2 flex-1 rounded-full ${
              step >= 2 ? "bg-magenta-600" : "bg-gray-200"
            }`}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
          {/* STEP 1: Nomination Type */}
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <h2 className="text-xl font-bold text-gray-900">
                Who are you nominating?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label
                  className={`cursor-pointer border-2 rounded-xl p-6 transition-all ${
                    nominationType === "SELF"
                      ? "border-magenta-600 bg-magenta-50"
                      : "border-gray-200 hover:border-magenta-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    className="hidden"
                    checked={nominationType === "SELF"}
                    onChange={() => setNominationType("SELF")}
                  />
                  <User
                    size={32}
                    className={`mb-3 ${
                      nominationType === "SELF"
                        ? "text-magenta-600"
                        : "text-gray-400"
                    }`}
                  />
                  <h3 className="font-bold text-gray-900">Myself</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    I am nominating myself for a category.
                  </p>
                </label>

                <label
                  className={`cursor-pointer border-2 rounded-xl p-6 transition-all ${
                    nominationType === "THIRD_PARTY"
                      ? "border-magenta-600 bg-magenta-50"
                      : "border-gray-200 hover:border-magenta-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    className="hidden"
                    checked={nominationType === "THIRD_PARTY"}
                    onChange={() => setNominationType("THIRD_PARTY")}
                  />
                  <User
                    size={32}
                    className={`mb-3 ${
                      nominationType === "THIRD_PARTY"
                        ? "text-magenta-600"
                        : "text-gray-400"
                    }`}
                  />
                  <h3 className="font-bold text-gray-900">Someone Else</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    I am nominating another person.
                  </p>
                </label>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Details Form */}
          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
              {/* Section: Category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register("categoryId", { required: true })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-magenta-500 outline-none bg-white"
                >
                  <option value="">Select a category...</option>
                  {event.categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <span className="text-red-500 text-xs mt-1">
                    Category is required
                  </span>
                )}
              </div>

              {/* Section: Nominee Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                  {nominationType === "SELF"
                    ? "Your Details"
                    : "Nominee Details"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register(
                        nominationType === "SELF" ? "fullName" : "nomineeName",
                        { required: true }
                      )}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-magenta-500 outline-none"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      {...register(
                        nominationType === "SELF" ? "email" : "nomineeEmail",
                        { required: true }
                      )}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-magenta-500 outline-none"
                      placeholder="name@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      {...register(
                        nominationType === "SELF" ? "phone" : "nomineePhone",
                        { required: true }
                      )}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-magenta-500 outline-none"
                      placeholder="024XXXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Short Bio / Description
                  </label>
                  <textarea
                    {...register("bio")}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-magenta-500 outline-none h-32 resize-none"
                    placeholder="Tell us about the nominee..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Nominee Photo *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
                    {photoUrl ? (
                      <div className="space-y-2">
                        <div className="relative w-32 h-32 mx-auto rounded-xl overflow-hidden shadow-sm">
                          <Image
                            src={photoUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setPhotoUrl("")}
                          className="text-red-600 text-sm font-bold hover:underline"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <UploadCloud
                          className="mx-auto text-gray-400"
                          size={40}
                        />
                        <p className="text-sm text-gray-500">
                          <span
                            className="text-magenta-600 font-bold cursor-pointer"
                            onClick={() => {
                              // Simulate upload for now by setting a dummy URL or prompt
                              const url = prompt(
                                "Enter image URL for testing (Simulated Upload):",
                                "https://via.placeholder.com/300"
                              );
                              if (url) setPhotoUrl(url);
                            }}
                          >
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">
                          SVG, PNG, JPG or GIF (max. 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section: Nominator Details (Only for Third Party) */}
              {nominationType === "THIRD_PARTY" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                    Your Information (Nominator)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        {...register("nominatorName", { required: true })}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-magenta-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Your Email
                      </label>
                      <input
                        type="email"
                        {...register("nominatorEmail")}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-magenta-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Your Phone
                      </label>
                      <input
                        type="tel"
                        {...register("nominatorPhone")}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-magenta-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Section: Custom Questions */}
              {formConfig && formConfig.fields.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                    Additional Questions
                  </h3>
                  {formConfig.fields.map((field: any) => (
                    <div key={field.id}>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        {field.label} {field.required && "*"}
                      </label>
                      {field.type === "TEXTAREA" ? (
                        <textarea
                          {...register(field.key, { required: field.required })}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-magenta-500 outline-none h-24 resize-none"
                        />
                      ) : field.type === "SELECT" ? (
                        <select
                          {...register(field.key, { required: field.required })}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-magenta-500 outline-none bg-white"
                        >
                          <option value="">Select option...</option>
                          {field.options &&
                            (field.options as any[]).map((opt: string) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                        </select>
                      ) : (
                        <input
                          type={field.type === "NUMBER" ? "number" : "text"}
                          {...register(field.key, { required: field.required })}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-magenta-500 outline-none"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />{" "}
                      Submitting...
                    </>
                  ) : (
                    "Submit Nomination"
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

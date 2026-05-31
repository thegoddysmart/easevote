"use client";

import { useState } from "react";
import { Facebook, Linkedin, Share2, Instagram } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

function XIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getUrl = () =>
    typeof window !== "undefined"
      ? `${window.location.origin}/blogs/${slug}`
      : `/blogs/${slug}`;

  const openPopup = (href: string) =>
    window.open(href, "_blank", "noopener,noreferrer,width=600,height=500");

  const handleFacebook = () => {
    openPopup(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`
    );
  };

  const handleX = () => {
    openPopup(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(getUrl())}`
    );
  };

  const handleLinkedIn = () => {
    openPopup(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getUrl())}`
    );
  };

  const handleInstagram = async () => {
    await navigator.clipboard.writeText(getUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    const url = getUrl();
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => null);
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const btnClass =
    "w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-primary-700 hover:text-white transition-all flex items-center justify-center shadow-sm";

  return (
    <div className="relative flex lg:flex-col gap-4">
      <button onClick={handleFacebook} className={btnClass} aria-label="Share on Facebook">
        <Facebook size={20} />
      </button>

      <button onClick={handleX} className={btnClass} aria-label="Share on X">
        <XIcon size={18} />
      </button>

      <button onClick={handleLinkedIn} className={btnClass} aria-label="Share on LinkedIn">
        <Linkedin size={20} />
      </button>

      <div className="relative">
        <button onClick={handleInstagram} className={btnClass} aria-label="Copy link for Instagram">
          <Instagram size={20} />
        </button>
        {copied && (
          <span className="absolute left-14 top-1/2 -translate-y-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:top-auto lg:bottom-full lg:mb-2 whitespace-nowrap bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg pointer-events-none">
            Link copied!
          </span>
        )}
      </div>

      <button onClick={handleNativeShare} className={btnClass} aria-label="Share via device">
        <Share2 size={20} />
      </button>
    </div>
  );
}

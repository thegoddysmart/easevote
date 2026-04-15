"use client";

import { siFacebook, siX, siInstagram, siTiktok } from "simple-icons/icons";

const iconBase =
  "w-10 h-10 rounded-full bg-neutral-500 hover:bg-secondary-700 flex items-center justify-center transition-colors cursor-pointer";

function Icon({ path }: { path: string }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
      <path d={path} />
    </svg>
  );
}

export default function SocialIcons() {
  return (
    <div className="flex gap-4">
      <a
        href="https://www.facebook.com/share/1C4eKQBYkn/"
        className={iconBase}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="sr-only">Facebook</span>
        <Icon path={siFacebook.path} />
      </a>

      <a
        href="https://x.com/ease_vote"
        className={iconBase}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="sr-only">X</span>
        <Icon path={siX.path} />
      </a>

      <a
        href="https://www.instagram.com/ease_vote"
        className={iconBase}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="sr-only">Instagram</span>
        <Icon path={siInstagram.path} />
      </a>

      <a href="#" className={iconBase}>
        <span className="sr-only">TikTok</span>
        <Icon path={siTiktok.path} />
      </a>
    </div>
  );
}

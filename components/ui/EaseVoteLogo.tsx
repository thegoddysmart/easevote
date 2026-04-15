import Image from "next/image";
import { russoOne } from "./fonts";

const Logo = ({ textColor = "text-primary-700" }) => {
  return (
    <div className="shrink-0 flex items-center gap-2 cursor-pointer">
      <div className="relative w-8 h-8">
        <Image
          src="/easevote.svg"
          alt="EaseVote Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <span
        className={`${russoOne.className} tracking-tight ${textColor} text-3xl`}
      >
        EaseVote
      </span>
    </div>
  );
};

export default Logo;

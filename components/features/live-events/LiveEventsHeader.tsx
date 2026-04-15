import { russoOne } from "../../ui/fonts";

export default function LiveEventsHeader() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        <span className="text-brand-bright font-bold uppercase text-sm tracking-wide">
          Events Happening Now
        </span>
      </div>

      <h2
        className={`${russoOne.className} tracking-tight text-brand-deep text-[35px] sm:text-[45px] lg:text-[60px]`}
      >
        Voting Events
      </h2>
    </div>
  );
}

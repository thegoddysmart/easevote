import localFont from "next/font/local";
import { Russo_One, Bebas_Neue } from "next/font/google";

// ========== GOOGLE FONTS ==========

// Headings → Russo One
export const russoOne = Russo_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// Optional → Bebas Neue
export const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// ========== LOCAL FONTS ==========

// Body → Neuwelt Medium
export const neuwelt = localFont({
  src: [
    {
      path: "../../public/font/Neuwelt-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/font/Neuwelt-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
  ],
  variable: "--font-neuwelt",
  display: "swap",
});

// Optional → Nexa
export const nexa = localFont({
  src: [
    {
      path: "../../public/font/Nexa-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/font/Nexa-Heavy.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-nexa",
  display: "swap",
});

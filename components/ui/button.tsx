"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-600 focus-visible:ring-offset-1";
const DISABLED = "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";
const BASE = `inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-150 ${FOCUS} ${DISABLED}`;

const variantClasses: Record<string, string> = {
  primary:        "bg-primary-700 text-white hover:bg-primary-800 px-6 py-3 shadow-sm",
  secondary:      "border-2 border-primary-700 text-primary-700 bg-transparent hover:bg-primary-700 hover:text-white px-6 py-3",
  danger:         "bg-error-600 text-white hover:bg-error-700 px-6 py-3 focus-visible:ring-error-500",
  ghost:          "bg-transparent text-primary-700 hover:bg-primary-50 active:bg-primary-100 px-4 py-2",
  "modal-confirm":"bg-primary-600 text-white hover:bg-primary-700 px-6 py-3.5 rounded-2xl shadow-lg active:scale-[0.98]",
  "modal-cancel": "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50 px-6 py-3.5 rounded-2xl shadow-sm active:scale-[0.98]",
  default:        "bg-neutral-900 text-white hover:bg-neutral-800 px-4 py-2",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(BASE, variantClasses[variant] ?? variantClasses.default, className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button };

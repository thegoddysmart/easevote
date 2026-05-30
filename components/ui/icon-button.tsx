"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const variantClasses = {
  edit:    "text-neutral-400 hover:text-primary-600 hover:bg-primary-50",
  delete:  "text-neutral-400 hover:text-error-600 hover:bg-error-100",
  default: "text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100",
};

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses;
  "aria-label": string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = "default", children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "p-2 rounded-lg transition-all duration-150 active:scale-90",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-600 focus-visible:ring-offset-1",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
IconButton.displayName = "IconButton";

export { IconButton };

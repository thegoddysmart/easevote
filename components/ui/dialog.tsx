"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Dialog = ({
  open,
  onOpenChange,
  children,
  className,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
      <div className={cn(
        "relative z-50 w-full max-w-lg rounded-[2.5rem] bg-white p-6 shadow-2xl border border-slate-100 overflow-hidden",
        className
      )}>
        {children}
        <button
          onClick={() => onOpenChange?.(false)}
          className="absolute right-6 top-6 p-2 rounded-full hover:bg-slate-50 transition-colors opacity-70 hover:opacity-100 cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

const DialogContent = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => <div className={cn("grid gap-4", className)}>{children}</div>;

const DialogHeader = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
  >
    {children}
  </div>
);

const DialogFooter = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
  >
    {children}
  </div>
);

const DialogTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <h2
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
  >
    {children}
  </h2>
);

const DialogDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
);

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

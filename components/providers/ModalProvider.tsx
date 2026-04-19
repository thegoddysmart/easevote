"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { ConfirmModal } from "../ui/ConfirmModal";

type ModalType = "alert" | "confirm" | "prompt";

interface ModalState {
  isOpen: boolean;
  type: ModalType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  defaultValue?: string;
  placeholder?: string;
  resolve?: (value: any) => void;
}

interface ModalContextType {
  alert: (options: Partial<ModalState>) => Promise<boolean>;
  confirm: (options: Partial<ModalState>) => Promise<boolean>;
  prompt: (options: Partial<ModalState>) => Promise<string | null>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: "alert",
    title: "",
    message: "",
  });

  const showModal = useCallback((type: ModalType, options: Partial<ModalState>) => {
    return new Promise<any>((resolve) => {
      setModal({
        isOpen: true,
        type,
        title: options.title || (type === "alert" ? "Notification" : type === "prompt" ? "Input Required" : "Are you sure?"),
        message: options.message || "",
        confirmText: options.confirmText,
        cancelText: options.cancelText,
        variant: options.variant || "info",
        defaultValue: options.defaultValue,
        placeholder: options.placeholder,
        resolve,
      });
    });
  }, []);

  const handleClose = useCallback(() => {
    if (modal.resolve) modal.resolve(modal.type === "prompt" ? null : false);
    setModal((prev) => ({ ...prev, isOpen: false }));
  }, [modal]);

  const handleConfirm = useCallback((value?: any) => {
    if (modal.resolve) modal.resolve(modal.type === "prompt" ? (value ?? "") : true);
    setModal((prev) => ({ ...prev, isOpen: false }));
  }, [modal]);

  return (
    <ModalContext.Provider
      value={{
        alert: (options) => showModal("alert", options),
        confirm: (options) => showModal("confirm", options),
        prompt: (options) => showModal("prompt", options),
      }}
    >
      {children}
      <ConfirmModal
        isOpen={modal.isOpen}
        type={modal.type}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={modal.title}
        message={modal.message}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        variant={modal.variant}
        defaultValue={modal.defaultValue}
        placeholder={modal.placeholder}
      />
    </ModalContext.Provider>
  );
}


export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

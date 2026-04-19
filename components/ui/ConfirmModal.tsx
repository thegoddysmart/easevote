import { useEffect, useState } from "react";
import { X, AlertTriangle, Trash2, Loader2, Info, AlertCircle } from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";

type ConfirmModalProps = {
  isOpen: boolean;
  type?: "alert" | "confirm" | "prompt";
  onClose: () => void;
  onConfirm: (value?: string) => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
  defaultValue?: string;
  placeholder?: string;
};

export function ConfirmModal({
  isOpen,
  type = "confirm",
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
  defaultValue = "",
  placeholder = "",
}: ConfirmModalProps) {
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      if (type === "prompt") setInputValue(defaultValue);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, loading, onClose, type, defaultValue]);

  const variantStyles = {
    danger: {
      icon: Trash2,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      buttonBg: "bg-red-500 hover:bg-red-600 shadow-red-200",
      accent: "border-red-100",
    },
    warning: {
      icon: AlertTriangle,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
      buttonBg: "bg-amber-500 hover:bg-amber-600 shadow-amber-200",
      accent: "border-amber-100",
    },
    info: {
      icon: Info,
      iconBg: "bg-magenta-50",
      iconColor: "text-magenta-600",
      buttonBg: "bg-magenta-600 hover:bg-magenta-700 shadow-magenta-200",
      accent: "border-magenta-100",
    },
  };

  const styles = variantStyles[variant] || variantStyles.info;
  const Icon = styles.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={loading ? undefined : onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-white/20"
          >
            <div className="p-8">
              <div className="flex flex-col items-center text-center">
                <div
                  className={clsx(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transform rotate-3 transition-transform hover:rotate-0",
                    styles.iconBg
                  )}
                >
                  <Icon className={clsx("h-8 w-8", styles.iconColor)} />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                  {title}
                </h3>
                <p className="text-slate-500 leading-relaxed mb-6">
                  {message}
                </p>

                {type === "prompt" && (
                  <div className="w-full mt-2">
                    <input
                      autoFocus
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={placeholder}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-magenta-100 focus:border-magenta-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !loading) {
                          onConfirm(inputValue);
                        }
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Close button top right */}
              <button
                onClick={onClose}
                disabled={loading}
                className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-full transition-colors disabled:opacity-50"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <div className="px-8 py-6 bg-slate-50/80 backdrop-blur-sm flex items-center justify-center gap-4">
              {type !== "alert" && (
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-6 py-3.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-white rounded-2xl transition-all disabled:opacity-50 border border-transparent hover:border-slate-200"
                >
                  {cancelText}
                </button>
              )}
              <button
                onClick={() => onConfirm(type === "prompt" ? inputValue : undefined)}
                disabled={loading}
                className={clsx(
                  "flex-1 px-6 py-3.5 text-sm font-bold text-white rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg active:scale-[0.98]",
                  styles.buttonBg
                )}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}



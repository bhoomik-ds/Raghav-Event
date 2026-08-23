import React from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export const ToastContainer = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex max-w-sm flex-col gap-2.5 pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";
        const isWarning = toast.type === "warning";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
              isSuccess
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : isError
                  ? "border-rose-200 bg-rose-50 text-rose-900"
                  : isWarning
                    ? "border-amber-200 bg-amber-50 text-amber-900"
                    : "border-[#E8DCC5] bg-white text-[#292929]"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
              {isError && <AlertCircle className="h-5 w-5 text-rose-600" />}
              {isWarning && <AlertTriangle className="h-5 w-5 text-amber-600" />}
              {!isSuccess && !isError && !isWarning && <Info className="h-5 w-5 text-[#C9A96E]" />}
            </div>

            <div className="flex-1 text-sm">
              {toast.title && <p className="font-extrabold leading-none mb-1 text-[#292929]">{toast.title}</p>}
              <p className="font-medium text-xs leading-relaxed opacity-90">{toast.message}</p>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 rounded-lg p-1 text-[#77736B] hover:bg-black/5 hover:text-[#292929] transition"
              aria-label="Dismiss toast"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;

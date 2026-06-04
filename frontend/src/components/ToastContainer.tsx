"use client";

import React from "react";
import { useDashboard } from "../context/DashboardContext";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useDashboard();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => {
        let Icon = Info;
        let colorClasses = "bg-[#0C0C0C] border-white/10 text-white";

        if (t.type === "success") {
          Icon = CheckCircle;
          colorClasses = "bg-white text-black border-white";
        } else if (t.type === "error") {
          Icon = AlertCircle;
          colorClasses = "bg-[#0C0C0C] border-red-500/50 text-red-400";
        }

        return (
          <div
            key={t.id}
            className={`flex items-center justify-between p-3 border text-xs tracking-wider uppercase font-mono transition-all duration-300 ${colorClasses}`}
          >
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 shrink-0" />
              <span>{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-4 opacity-55 hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

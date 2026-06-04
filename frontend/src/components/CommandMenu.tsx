"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDashboard, TabType } from "../context/DashboardContext";
import { Search, Command, Clock, FileText, CheckSquare, Users, Folder, TrendingUp, Sparkles } from "lucide-react";

export const CommandMenu: React.FC = () => {
  const {
    isCommandMenuOpen,
    setIsCommandMenuOpen,
    setActiveTab,
    setIsChatOpen,
    clients,
    tasks,
    startTimer
  } = useDashboard();

  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isCommandMenuOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSearch("");
    }
  }, [isCommandMenuOpen]);

  // Listen for shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandMenuOpen(!isCommandMenuOpen);
      }
      if (e.key === "Escape") {
        setIsCommandMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandMenuOpen, setIsCommandMenuOpen]);

  if (!isCommandMenuOpen) return null;

  const navigationCommands = [
    { name: "Go to Financial Command Center", action: () => setActiveTab("finance"), icon: TrendingUp },
    { name: "Go to Invoicing & Billing", action: () => setActiveTab("invoices"), icon: FileText },
    { name: "Go to Kanban Task Management", action: () => setActiveTab("tasks"), icon: CheckSquare },
    { name: "Go to Client CRM Directory", action: () => setActiveTab("crm"), icon: Users },
    { name: "Go to Time Tracking logbook", action: () => setActiveTab("timer"), icon: Clock },
    { name: "Go to Document Vault", action: () => setActiveTab("vault"), icon: Folder },
    { name: "Open AI Assistant Panel", action: () => setIsChatOpen(true), icon: Sparkles }
  ];

  // Filter commands and list items
  const filteredNav = navigationCommands.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredClients = clients.filter((c) =>
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.project_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCommandRun = (action: () => void) => {
    action();
    setIsCommandMenuOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#0C0C0C]/85 cmd-backdrop"
        onClick={() => setIsCommandMenuOpen(false)}
      />

      {/* Panel */}
      <div className="relative w-full max-w-xl bg-[#111111] border border-white/10 text-white overflow-hidden hover-subtle-grow">
        {/* Search header */}
        <div className="flex items-center px-4 border-b border-white/10">
          <Search className="w-4 h-4 mr-3 opacity-40 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            className="w-full h-12 bg-transparent border-0 outline-none text-sm font-sans tracking-wide text-white placeholder-white/30"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 h-5 select-none rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] text-white/50">
            ESC
          </kbd>
        </div>

        {/* Command list */}
        <div className="max-h-[350px] overflow-y-auto p-2 font-mono text-xs tracking-wider">
          {/* Navigation Commands */}
          {filteredNav.length > 0 && (
            <div className="mb-4">
              <div className="px-3 py-1.5 text-[10px] uppercase text-white/40 font-semibold tracking-widest">
                Navigation & Systems
              </div>
              <div className="mt-1 flex flex-col gap-0.5">
                {filteredNav.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.name}
                      onClick={() => handleCommandRun(cmd.action)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/5 border border-transparent hover:border-white/5 transition-all text-white/70 hover:text-white"
                    >
                      <Icon className="w-4 h-4 opacity-50" />
                      <span>{cmd.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dynamic Client Actions */}
          {filteredClients.length > 0 && search.length > 0 && (
            <div className="mb-4">
              <div className="px-3 py-1.5 text-[10px] uppercase text-white/40 font-semibold tracking-widest">
                Quick CRM Actions
              </div>
              <div className="mt-1 flex flex-col gap-0.5">
                {filteredClients.slice(0, 3).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleCommandRun(() => {
                      setActiveTab("crm");
                      // Optionally dispatch filter details
                    })}
                    className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-white/5 transition-all text-white/70 hover:text-white"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 opacity-50" />
                      <span>View details for {c.company}</span>
                    </div>
                    <span className="text-[10px] text-white/40">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Timer Triggers */}
          {search.length > 1 && (
            <div className="mb-2">
              <div className="px-3 py-1.5 text-[10px] uppercase text-white/40 font-semibold tracking-widest">
                Operations
              </div>
              <button
                onClick={() => handleCommandRun(() => startTimer(search.toUpperCase()))}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/5 transition-all text-white/70 hover:text-white"
              >
                <Clock className="w-4 h-4 opacity-50 text-white/60" />
                <span>Start timer for: <b className="text-white">"{search.toUpperCase()}"</b></span>
              </button>
            </div>
          )}

          {/* Empty state */}
          {filteredNav.length === 0 && filteredClients.length === 0 && filteredTasks.length === 0 && (
            <div className="py-6 text-center text-white/30 font-sans">
              No system commands matched "{search}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

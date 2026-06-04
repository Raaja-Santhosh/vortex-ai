"use client";

import React, { useEffect, useState } from "react";
import { useDashboard, TabType } from "../context/DashboardContext";
import { ToastContainer } from "./ToastContainer";
import { CommandMenu } from "./CommandMenu";
import { AIChatbot } from "./AIChatbot";

// Import modules
import { FinancialCenter } from "./FinancialCenter";
import { InvoicingBilling } from "./InvoicingBilling";
import { ProjectTasks } from "./ProjectTasks";
import { TimeTracker } from "./TimeTracker";
import { ClientCRM } from "./ClientCRM";
import { DocumentVault } from "./DocumentVault";

import { 
  TrendingUp, 
  FileText, 
  CheckSquare, 
  Clock, 
  Users, 
  Folder, 
  Search,
  Bell,
  Settings
} from "lucide-react";

export const DashboardShell: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsCommandMenuOpen,
    setIsChatOpen,
    activeTimer,
    stopTimer
  } = useDashboard();

  const [tickingSeconds, setTickingSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeTimer) {
      const startTime = new Date(activeTimer.start_time).getTime();
      const tick = () => {
        const now = new Date().getTime();
        setTickingSeconds(Math.max(0, Math.floor((now - startTime) / 1000)));
      };
      tick();
      interval = setInterval(tick, 1000);
    } else {
      setTickingSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer]);

  const formatTicking = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs > 0 ? hrs + ":" : ""}${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const navItems = [
    { label: "Financials", tab: "finance" as TabType, icon: TrendingUp },
    { label: "Invoices", tab: "invoices" as TabType, icon: FileText },
    { label: "Tasks", tab: "tasks" as TabType, icon: CheckSquare },
    { label: "Time Log", tab: "timer" as TabType, icon: Clock },
    { label: "CRM", tab: "crm" as TabType, icon: Users },
    { label: "Vault", tab: "vault" as TabType, icon: Folder },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "finance":
        return <FinancialCenter />;
      case "invoices":
        return <InvoicingBilling />;
      case "tasks":
        return <ProjectTasks />;
      case "timer":
        return <TimeTracker />;
      case "crm":
        return <ClientCRM />;
      case "vault":
        return <DocumentVault />;
      default:
        return <FinancialCenter />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background">
      
      {/* Icon-only Minimal Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-16 bg-background flex flex-col border-r border-border-subtle z-50 items-center py-6">
        <div className="mb-8 text-foreground hover:text-foreground cursor-pointer transition-colors" onClick={() => setIsChatOpen(true)}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-foreground text-background shadow-lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>
        
        <nav className="flex-grow w-full mt-4">
          <ul className="flex flex-col items-center space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <li key={item.tab} className="w-full flex justify-center relative group">
                  <button
                    onClick={() => setActiveTab(item.tab)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                      isActive 
                        ? "text-foreground bg-surface-dim border border-border-subtle shadow-sm" 
                        : "text-text-muted hover:text-foreground hover:bg-surface-dim/50 border border-transparent"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                  {/* Tooltip */}
                  <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2 py-1 bg-surface-dim border border-border-subtle rounded text-[10px] text-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto flex flex-col items-center space-y-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg text-text-muted hover:text-foreground hover:bg-surface-dim/50 transition-all">
            <Settings className="w-4 h-4" />
          </button>
          
          <div className="w-8 h-8 rounded-full border border-border-subtle bg-surface-dim flex items-center justify-center text-[10px] font-bold mt-2">
            A
          </div>
        </div>
      </aside>

      {/* Main Canvas Area */}
      <main style={{ marginLeft: '64px', width: 'calc(100% - 64px)' }} className="flex flex-col min-h-screen bg-background relative overflow-y-auto">
        
        {/* Top Header Navigation */}
        <header className="fixed top-0 right-0 w-[calc(100%-4rem)] z-40 bg-background/90 backdrop-blur-md flex justify-between items-center px-8 h-16 border-b border-border-subtle">
          <div className="flex items-center space-x-6">
            <h2 className="text-foreground font-medium tracking-tight">Vortex AI</h2>
          </div>

          <div className="flex items-center w-full max-w-md ml-auto mr-8">
            <div className="relative group cursor-pointer w-full" onClick={() => setIsCommandMenuOpen(true)}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4 group-hover:text-foreground transition-colors" />
              <input 
                className="bg-transparent border-none focus:ring-0 pl-10 text-[13px] text-foreground w-full placeholder:text-text-muted cursor-pointer outline-none h-10" 
                placeholder="Find anything" 
                type="text"
                readOnly
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="w-8 h-8 rounded-full bg-surface-dim overflow-hidden border border-border-subtle">
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Viktor&backgroundColor=121212" alt="User Avatar" className="w-full h-full object-cover opacity-80" />
            </div>
          </div>
        </header>

        {/* Content Render Panel */}
        <div className="flex-grow flex flex-col pt-16 relative z-10 px-10 pb-20">
          {renderActiveComponent()}
        </div>
      </main>

      {/* Global Modals & Layers */}
      <CommandMenu />
      <ToastContainer />
      <AIChatbot />
    </div>
  );
};
export default DashboardShell;

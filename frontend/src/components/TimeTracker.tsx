"use client";

import React, { useState, useEffect } from "react";
import { useDashboard } from "../context/DashboardContext";
import { Play, Square, Clock, Calendar } from "lucide-react";

export const TimeTracker: React.FC = () => {
  const {
    timerLogs,
    activeTimer,
    startTimer,
    stopTimer,
    addToast
  } = useDashboard();

  const [projectName, setProjectName] = useState("");
  const [timerNotes, setTimerNotes] = useState("");
  const [stopNotes, setStopNotes] = useState("");
  
  // Elapsed time state for active timer ticking
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (activeTimer) {
      // Calculate initial elapsed time
      const startTime = new Date(activeTimer.start_time).getTime();
      const tick = () => {
        const now = new Date().getTime();
        const diff = Math.max(0, Math.floor((now - startTime) / 1000));
        setElapsedSeconds(diff);
      };
      
      tick(); // Run initially
      interval = setInterval(tick, 1000);
    } else {
      setElapsedSeconds(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      addToast("Please enter a project name", "error");
      return;
    }
    startTimer(projectName, timerNotes);
    setProjectName("");
    setTimerNotes("");
  };

  const handleStop = () => {
    stopTimer(stopNotes);
    setStopNotes("");
  };

  // Helper to format duration seconds to HH:MM:SS
  const formatDuration = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    
    return [
      String(hrs).padStart(2, "0"),
      String(mins).padStart(2, "0"),
      String(secs).padStart(2, "0")
    ].join(":");
  };

  // Helper to format logs duration (e.g. "1h 15m")
  const formatLogDuration = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const totalTrackedSeconds = timerLogs.reduce((acc, log) => acc + log.duration_seconds, 0);
  const totalTrackedHours = (totalTrackedSeconds / 3600).toFixed(1);

  return (
    <div className="flex flex-col space-y-8 max-w-6xl w-full mx-auto animate-in fade-in duration-500 pt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-foreground">Time Tracker</h1>
          <p className="text-text-muted text-sm mt-1">Track billable hours for specific client projects and deployments.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted bg-surface-dim border border-border-subtle rounded-md px-3 py-1.5">
          <span>Total Tracked:</span>
          <span className="font-medium text-foreground">{totalTrackedHours} Hours</span>
        </div>
      </div>

      {/* Timer Control Center */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Active tracking widget / start form */}
        <div className="md:col-span-2 bg-surface-dim border border-border-subtle rounded-xl p-6 flex flex-col justify-center min-h-[160px]">
          {activeTimer ? (
            /* Active Timer View */
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col gap-1.5 items-center md:items-start text-center md:text-left w-full md:w-auto">
                <span className="text-xs text-green-400 flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Active Timer
                </span>
                <h3 className="text-lg font-medium text-foreground">
                  {activeTimer.project_name}
                </h3>
                {activeTimer.notes && (
                  <p className="text-sm text-text-muted">"{activeTimer.notes}"</p>
                )}
              </div>

              {/* Ticker & Stop Controls */}
              <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                <div className="text-4xl font-medium tracking-tight text-foreground select-none">
                  {formatDuration(elapsedSeconds)}
                </div>

                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Log session notes..."
                    value={stopNotes}
                    onChange={(e) => setStopNotes(e.target.value)}
                    className="bg-background border border-border-subtle p-2 rounded-md text-sm text-foreground outline-none w-full md:w-48 focus:border-text-muted transition-colors placeholder:text-border-subtle"
                  />
                  <button
                    onClick={handleStop}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90 transition-all"
                  >
                    <Square className="w-4 h-4 fill-background" /> Stop Timer
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Start Timer Form */
            <form onSubmit={handleStart} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 flex flex-col gap-1.5 w-full">
                <label className="text-xs text-text-muted">Active Client / Project Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Apex Portal Redesign"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="bg-background border border-border-subtle p-2 rounded-md text-sm text-foreground outline-none focus:border-text-muted transition-colors placeholder:text-border-subtle"
                />
              </div>

              <div className="flex-1 flex flex-col gap-1.5 w-full">
                <label className="text-xs text-text-muted">Session Scope</label>
                <input
                  type="text"
                  placeholder="e.g. Setting up API endpoints..."
                  value={timerNotes}
                  onChange={(e) => setTimerNotes(e.target.value)}
                  className="bg-background border border-border-subtle p-2 rounded-md text-sm text-foreground outline-none focus:border-text-muted transition-colors placeholder:text-border-subtle"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90 transition-all flex items-center gap-2 shrink-0 w-full md:w-auto justify-center"
              >
                <Play className="w-4 h-4 fill-background" /> Start Timer
              </button>
            </form>
          )}
        </div>

        {/* Tip / instruction panel */}
        <div className="bg-surface-dim border border-border-subtle rounded-xl p-6 flex flex-col justify-center text-sm text-text-muted leading-relaxed gap-3">
          <span className="text-foreground font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-text-muted" /> Billing Analytics
          </span>
          <p>
            Vortex billing calculates time tracking entries to generate milestone invoice logs.
          </p>
          <p>
            To associate a session, use client keywords (e.g. Apex, Acme, Zenith) in project names.
          </p>
        </div>
      </div>

      {/* Log Book table */}
      <div className="bg-surface-dim border border-border-subtle rounded-xl overflow-hidden mt-4">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-subtle text-text-muted text-xs bg-background/50">
              <th className="px-5 py-4 font-normal">Project / Ticket</th>
              <th className="px-5 py-4 font-normal">Session Date</th>
              <th className="px-5 py-4 font-normal">Start & End Times</th>
              <th className="px-5 py-4 font-normal">Notes</th>
              <th className="px-5 py-4 font-normal text-right">Logged Hours</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {timerLogs.map((log) => (
              <tr key={log.id} className="hover:bg-background/50 transition-colors">
                <td className="px-5 py-4 text-foreground font-medium">{log.project_name}</td>
                <td className="px-5 py-4 text-text-muted">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-border-subtle" />
                    {new Date(log.start_time).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-5 py-4 text-text-muted text-xs">
                  {new Date(log.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {log.end_time && ` - ${new Date(log.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                </td>
                <td className="px-5 py-4 text-text-muted text-xs max-w-xs truncate" title={log.notes || ""}>
                  {log.notes || "—"}
                </td>
                <td className="px-5 py-4 text-right font-medium text-foreground">
                  {formatLogDuration(log.duration_seconds)}
                </td>
              </tr>
            ))}
            {timerLogs.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-text-muted">
                  No logged session hours detected.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

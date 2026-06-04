"use client";

import React from "react";
import { Activity, Zap, Cpu, Bot, DollarSign, FolderKanban, Database, Server, Play, Key, FileCode, Settings2 } from "lucide-react";
import { useDashboardData } from "../hooks/useDashboardData";
import { useDashboard } from "../context/DashboardContext";

export const FinancialCenter: React.FC = () => {
  const data = useDashboardData();
  const { addToast } = useDashboard();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('en-US').format(val);
  };

  const generatePolyline = (history: number[]) => {
    if (history.length === 0) return "";
    const width = 100;
    const height = 20;
    const maxVal = Math.max(...history, 1);
    
    return history.map((val, i) => {
      const x = (i / (history.length - 1)) * width;
      const y = height - (val / maxVal) * height;
      return `${x},${y}`;
    }).join(" ");
  };

  return (
    <div className="flex flex-col space-y-8 max-w-6xl w-full mx-auto animate-in fade-in duration-500 pt-8">
      
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-medium tracking-tight">
          <span className="text-foreground">Command Center </span>
          <span className="text-text-muted">AIOS</span>
        </h1>
        <p className="text-text-muted text-sm mt-1">Live metrics across all autonomous agents and API clusters.</p>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Agent Operations */}
        <div className="bg-surface-dim border border-border-subtle rounded-xl p-5 flex flex-col justify-between min-h-[160px] hover-subtle-grow">
          <div className="flex justify-between items-center text-xs text-text-muted">
            <span className="flex items-center"><Activity className="w-3 h-3 mr-2" />Agent Operations</span>
            <span className="text-[10px] text-foreground animate-pulse flex items-center"><div className="w-1.5 h-1.5 bg-foreground rounded-full mr-1"></div>Live</span>
          </div>
          <div className="mt-4 flex-grow">
            <p className="text-sm leading-relaxed text-foreground/90">
              <span className="text-foreground font-medium transition-all">{formatNumber(data.apiRequests)}</span> requests processed. 
              <span className="text-foreground font-medium transition-all"> {data.apiErrors}</span> errors. 
              Success rate at <span className="text-foreground font-medium transition-all">{data.successRate.toFixed(1)}%</span> across <span className="text-foreground font-medium">{data.activeAgents} active agents</span>. <br/>
              <span className="text-text-muted">Systems optimal.</span>
            </p>
          </div>
          <div className="mt-4 flex justify-between items-center text-xs text-text-muted">
            <button onClick={() => addToast("Opening detailed agent operations logs...", "info")} className="flex items-center hover:text-foreground transition-colors"><span className="mr-1">👁️</span> View logs</button>
            <button onClick={() => addToast("Alert dismissed.", "success")} className="hover:text-foreground transition-colors">Dismiss</button>
          </div>
        </div>

        {/* Model Latency */}
        <div className="bg-surface-dim border border-border-subtle rounded-xl p-5 flex flex-col justify-between min-h-[160px] hover-subtle-grow">
          <div className="flex items-center text-xs text-text-muted">
            <Zap className="w-3 h-3 mr-2 text-foreground" />
            <span>Model Latency</span>
          </div>
          <div className="mt-2 text-sm text-text-muted">
            Current response latency <span className="text-foreground">across clusters</span> is <br/>
            <span className="text-foreground font-medium transition-all">{Math.round(data.latencyHistory[data.latencyHistory.length - 1])} ms</span>
          </div>
          
          {/* Dynamic Bar Chart */}
          <div className="flex items-end space-x-2 h-10 mt-4 opacity-80">
            {data.latencyHistory.map((val, i) => (
              <div 
                key={i}
                className={`w-2 rounded-t-sm transition-all duration-700 ease-in-out ${i % 2 === 0 ? 'bg-foreground' : 'bg-text-muted'}`}
                style={{ height: `${(val / 400) * 100}%` }}
              ></div>
            ))}
          </div>
          
          <button onClick={() => addToast("Loading latency breakdown...", "info")} className="mt-4 text-xs text-text-muted hover:text-foreground transition-colors text-left">
            See performance metrics
          </button>
        </div>

        {/* Compute & Resources */}
        <div className="bg-surface-dim border border-border-subtle rounded-xl p-5 flex flex-col justify-between min-h-[160px] hover-subtle-grow">
          <div className="flex items-center text-xs text-text-muted">
            <Cpu className="w-3 h-3 mr-2" />
            <span>Compute Cost</span>
          </div>
          <div className="mt-2 text-sm text-text-muted">
            Total compute cost this cycle is <span className="text-foreground transition-all">{formatCurrency(data.computeCost)}</span> & remaining GPU hours are
          </div>
          <div className="mt-2 text-2xl font-medium text-foreground transition-all">
            {data.gpuHoursRemaining.toFixed(1)} hrs
          </div>
          <button onClick={() => addToast("Redirecting to GPU instance manager...", "info")} className="mt-4 text-xs text-text-muted hover:text-foreground transition-colors text-left">
            Manage instances
          </button>
        </div>

        {/* Automated Actions */}
        <div className="bg-surface-dim border border-border-subtle rounded-xl p-5 flex flex-col justify-between min-h-[160px] hover-subtle-grow">
          <div className="flex items-center text-xs text-text-muted">
            <Bot className="w-3 h-3 mr-2" />
            <span>Automated Actions</span>
          </div>
          <div className="mt-2 text-sm text-text-muted transition-all">
            <span className="text-foreground">{formatNumber(data.automatedActions)} actions</span> executed automatically today, primarily categorized as <span className="text-foreground">client outreach</span>
          </div>
          <button onClick={() => addToast("Loading automated workflows...", "info")} className="mt-auto pt-4 text-xs text-text-muted hover:text-foreground transition-colors text-left">
            View workflows
          </button>
        </div>

        {/* API Spend */}
        <div className="bg-surface-dim border border-border-subtle rounded-xl p-5 flex flex-col justify-between min-h-[160px] hover-subtle-grow">
          <div className="flex items-center text-xs text-text-muted">
            <DollarSign className="w-3 h-3 mr-2" />
            <span>API Spend</span>
          </div>
          <div className="mt-2 text-sm text-text-muted">
            LLM Token spending this month
          </div>
          <div className="mt-6 text-3xl font-medium text-foreground tracking-tight transition-all">
            {formatCurrency(data.totalApiSpend)}
          </div>
          <button onClick={() => addToast("Generating API spend report...", "info")} className="mt-auto pt-4 text-xs text-text-muted hover:text-foreground transition-colors text-left">
            Analyze usage
          </button>
        </div>

        {/* Client Projects */}
        <div className="bg-surface-dim border border-border-subtle rounded-xl p-5 flex flex-col justify-between min-h-[160px] hover-subtle-grow">
          <div className="flex items-center text-xs text-text-muted">
            <FolderKanban className="w-3 h-3 mr-2" />
            <span>Client Projects</span>
          </div>
          <div className="mt-2 text-sm text-text-muted leading-relaxed transition-all">
            You currently have <span className="text-foreground">{data.activeProjects} active deployments</span> projecting <span className="text-foreground">{formatCurrency(data.projectedSpend)}</span> in usage revenue
          </div>
          <button onClick={() => addToast("Opening client deployments...", "info")} className="mt-auto pt-4 text-xs text-text-muted hover:text-foreground transition-colors text-left">
            View deployments
          </button>
        </div>

        {/* GPU Allocation */}
        <div className="bg-surface-dim border border-border-subtle rounded-xl p-5 flex flex-col justify-between min-h-[160px] hover-subtle-grow">
          <div className="flex items-center text-xs text-foreground space-x-1">
            <Database className="w-4 h-4 text-text-muted mr-1" />
            <span>Data Centers</span>
          </div>
          <div className="mt-2 text-sm text-text-muted leading-relaxed transition-all">
            Workloads distributed across <span className="text-foreground">us-east-1</span> and <span className="text-foreground">eu-west-2</span> with active redundancy
          </div>
          <button onClick={() => addToast("Running system health checks...", "info")} className="mt-auto pt-4 text-xs text-text-muted hover:text-foreground transition-colors text-left">
            Check health status
          </button>
        </div>

        {/* Cloud Infrastructure */}
        <div className="bg-surface-dim border border-border-subtle rounded-xl p-5 flex flex-col justify-between min-h-[160px] hover-subtle-grow">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <div className="flex items-center">
              <Server className="w-3 h-3 mr-2" />
              <span>Cloud Infrastructure</span>
            </div>
            <span className="text-[10px]">▼</span>
          </div>
          <div className="mt-2 text-sm text-text-muted leading-relaxed transition-all">
            Your <span className="text-foreground">storage costs increased by {data.cloudCostIncrease}%</span> this week
          </div>
          
          {/* Dynamic Line Chart */}
          <div className="mt-4 w-full h-8">
            <svg viewBox="0 0 100 20" className="w-full h-full overflow-visible transition-all duration-700 ease-in-out">
              <polyline 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5"
                className="text-foreground opacity-80"
                points={generatePolyline(data.cloudCostsHistory)}
              />
            </svg>
          </div>

          <button onClick={() => addToast("Loading cloud infrastructure metrics...", "info")} className="mt-auto pt-4 text-xs text-text-muted hover:text-foreground transition-colors text-left">
            Review resource usage
          </button>
        </div>

      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button 
          onClick={() => addToast("Deploying new Agent instance...", "info")}
          className="flex items-center px-4 py-2 text-xs text-foreground border border-border-subtle rounded-md hover:bg-surface-dim transition-colors bg-background"
        >
          <Play className="w-3 h-3 mr-2 text-text-muted" />
          Deploy Agent
        </button>
        <button 
          onClick={() => addToast("New API Key generated and copied to clipboard.", "success")}
          className="flex items-center px-4 py-2 text-xs text-foreground border border-border-subtle rounded-md hover:bg-surface-dim transition-colors bg-background"
        >
          <Key className="w-3 h-3 mr-2 text-text-muted" />
          Create API Key
        </button>
        <button 
          onClick={() => addToast("Fetching latest system logs...", "info")}
          className="flex items-center px-4 py-2 text-xs text-foreground border border-border-subtle rounded-md hover:bg-surface-dim transition-colors bg-background"
        >
          <FileCode className="w-3 h-3 mr-2 text-text-muted" />
          View Logs
        </button>
        <button 
          onClick={() => addToast("Opening Model Configuration Panel", "info")}
          className="flex items-center px-4 py-2 text-xs text-foreground border border-border-subtle rounded-md hover:bg-surface-dim transition-colors bg-background"
        >
          <Settings2 className="w-3 h-3 mr-2 text-text-muted" />
          Model Config
        </button>
      </div>

      {/* System Event Logs */}
      <div className="mt-8 flex flex-col space-y-4 pb-10">
        <h3 className="text-sm font-medium text-foreground">Recent System Events</h3>
        <div className="w-full bg-surface-dim border border-border-subtle rounded-xl overflow-hidden text-sm">
          <div className="px-5 py-3 border-b border-border-subtle flex justify-between items-center bg-background/50">
            <span className="text-text-muted text-xs">Timestamp</span>
            <span className="text-text-muted text-xs w-full max-w-[60%]">Event Details</span>
            <span className="text-text-muted text-xs text-right">Status</span>
          </div>
          <div className="px-5 py-3 border-b border-border-subtle flex justify-between items-center hover:bg-background/50 transition-colors">
            <span className="text-text-muted text-xs font-mono">10:42 AM</span>
            <span className="text-foreground text-sm w-full max-w-[60%] truncate">Web Scraper Agent encountered rate limit on target host</span>
            <span className="text-amber-500 text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">Warning</span>
          </div>
          <div className="px-5 py-3 border-b border-border-subtle flex justify-between items-center hover:bg-background/50 transition-colors">
            <span className="text-text-muted text-xs font-mono">10:15 AM</span>
            <span className="text-foreground text-sm w-full max-w-[60%] truncate">Successfully scaled up GPU cluster for Model Training</span>
            <span className="text-green-500 text-xs px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20">Resolved</span>
          </div>
          <div className="px-5 py-3 border-b border-border-subtle flex justify-between items-center hover:bg-background/50 transition-colors">
            <span className="text-text-muted text-xs font-mono">09:00 AM</span>
            <span className="text-foreground text-sm w-full max-w-[60%] truncate">Daily automated client reporting dispatched</span>
            <span className="text-text-muted border border-border-subtle text-xs px-2 py-0.5 rounded bg-background">Routine</span>
          </div>
          <div className="px-5 py-3 flex justify-between items-center hover:bg-background/50 transition-colors">
            <span className="text-text-muted text-xs font-mono">08:14 AM</span>
            <span className="text-foreground text-sm w-full max-w-[60%] truncate">New model weights pushed to production API</span>
            <span className="text-text-muted border border-border-subtle text-xs px-2 py-0.5 rounded bg-background">Routine</span>
          </div>
        </div>
      </div>
    </div>
  );
};

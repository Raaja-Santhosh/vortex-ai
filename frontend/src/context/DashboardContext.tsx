"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type TabType = "finance" | "invoices" | "tasks" | "timer" | "crm" | "vault";

export interface ClientData {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string;
  active_contract_value: number;
  lifetime_value: number;
  status: "Active" | "Inactive" | "Lead";
  notes: string | null;
  created_at: string;
}

export interface InvoiceData {
  id: number;
  client_id: number;
  invoice_number: string;
  amount: number;
  due_date: string;
  status: "Paid" | "Pending" | "Overdue";
  is_recurring: boolean;
  billing_frequency: string;
  created_at: string;
  client_name?: string;
}

export interface TaskData {
  id: number;
  title: string;
  description: string | null;
  status: "Todo" | "InProgress" | "Review" | "Done";
  project_name: string;
  priority: "Low" | "Medium" | "High";
  due_date: string | null;
  created_at: string;
}

export interface TimerData {
  id: number;
  project_name: string;
  duration_seconds: number;
  start_time: string;
  end_time: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
}

export interface DocumentData {
  id: number;
  name: string;
  file_path: string;
  category: "NDA" | "Tax" | "Contract" | "Asset";
  size_bytes: number;
  uploaded_at: string;
}

export interface ChatMessage {
  sender: "user" | "ai" | "system";
  text: string;
  timestamp: Date;
  intent?: string;
  action_data?: any;
  ticket_created?: boolean;
  ticket_id?: string;
}

interface FinancialMetrics {
  monthly_recurring_revenue: number;
  total_ltv: number;
  total_paid: number;
  total_pending: number;
  total_overdue: number;
  monthly_expenses: number;
  cash_reserve: number;
  runway_months: number;
  chart_data: Array<{ month: string; revenue: number; expenses: number }>;
}

interface ToastMessage {
  message: string;
  type: "success" | "info" | "error";
  id: number;
}

interface DashboardContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isCommandMenuOpen: boolean;
  setIsCommandMenuOpen: (open: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  clients: ClientData[];
  invoices: InvoiceData[];
  tasks: TaskData[];
  documents: DocumentData[];
  timerLogs: TimerData[];
  activeTimer: TimerData | null;
  metrics: FinancialMetrics | null;
  chatHistory: ChatMessage[];
  toasts: ToastMessage[];
  addToast: (message: string, type?: "success" | "info" | "error") => void;
  removeToast: (id: number) => void;
  
  // API triggers
  fetchClients: () => Promise<void>;
  fetchInvoices: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  fetchDocuments: () => Promise<void>;
  fetchTimerLogs: () => Promise<void>;
  fetchMetrics: () => Promise<void>;
  
  createClient: (client: Omit<ClientData, "id" | "created_at">) => Promise<void>;
  createInvoice: (invoice: Omit<InvoiceData, "id" | "created_at">) => Promise<void>;
  updateInvoiceStatus: (id: number, status: "Paid" | "Pending" | "Overdue") => Promise<void>;
  createTask: (task: Omit<TaskData, "id" | "created_at">) => Promise<void>;
  updateTaskStatus: (id: number, status: TaskData["status"]) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  
  startTimer: (projectName: string, notes?: string) => Promise<void>;
  stopTimer: (notes?: string) => Promise<void>;
  
  uploadDocument: (file: File, category: string) => Promise<void>;
  deleteDocument: (id: number) => Promise<void>;
  
  sendChatMessage: (message: string) => Promise<void>;
  clearChatHistory: () => void;
}

const API_BASE = "http://localhost:8000/api";

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<TabType>("finance");
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const [clients, setClients] = useState<ClientData[]>([]);
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [timerLogs, setTimerLogs] = useState<TimerData[]>([]);
  const [activeTimer, setActiveTimer] = useState<TimerData | null>(null);
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "Vortex OS active. Ask me to navigate, start timers, draft invoices, or query support FAQs.",
      timestamp: new Date()
    }
  ]);

  const addToast = useCallback((message: string, type: "success" | "info" | "error" = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { message, type, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const setActiveTab = useCallback((tab: TabType) => {
    setActiveTabState(tab);
    addToast(`Switched view to ${tab.toUpperCase()}`, "info");
  }, [addToast]);

  // Fetch API handlers
  const fetchClients = async () => {
    try {
      const res = await fetch(`${API_BASE}/clients`);
      if (res.ok) setClients(await res.json());
    } catch (e) {
      console.error("Fetch clients failed", e);
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await fetch(`${API_BASE}/invoices`);
      if (res.ok) setInvoices(await res.json());
    } catch (e) {
      console.error("Fetch invoices failed", e);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      if (res.ok) setTasks(await res.json());
    } catch (e) {
      console.error("Fetch tasks failed", e);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${API_BASE}/documents`);
      if (res.ok) setDocuments(await res.json());
    } catch (e) {
      console.error("Fetch documents failed", e);
    }
  };

  const fetchTimerLogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/timer/logs`);
      if (res.ok) setTimerLogs(await res.json());
    } catch (e) {
      console.error("Fetch timer logs failed", e);
    }
  };

  const fetchActiveTimer = async () => {
    try {
      const res = await fetch(`${API_BASE}/timer`);
      if (res.ok) {
        const data = await res.json();
        setActiveTimer(data || null);
      }
    } catch (e) {
      console.error("Fetch active timer failed", e);
    }
  };

  const fetchMetrics = async () => {
    try {
      const res = await fetch(`${API_BASE}/metrics`);
      if (res.ok) setMetrics(await res.json());
    } catch (e) {
      console.error("Fetch metrics failed", e);
    }
  };

  const loadAllData = useCallback(async () => {
    await Promise.all([
      fetchClients(),
      fetchInvoices(),
      fetchTasks(),
      fetchDocuments(),
      fetchTimerLogs(),
      fetchActiveTimer(),
      fetchMetrics()
    ]);
  }, []);

  useEffect(() => {
    loadAllData();
    // Poll active timer state every 30 seconds
    const interval = setInterval(() => {
      fetchActiveTimer();
    }, 30000);
    return () => clearInterval(interval);
  }, [loadAllData]);

  // Modifying API Operations
  const createClient = async (client: Omit<ClientData, "id" | "created_at">) => {
    try {
      const res = await fetch(`${API_BASE}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client),
      });
      if (res.ok) {
        addToast(`Client '${client.company}' created successfully.`, "success");
        await fetchClients();
        await fetchMetrics();
      } else {
        addToast("Failed to create client", "error");
      }
    } catch (e) {
      addToast("Connection error", "error");
    }
  };

  const createInvoice = async (invoice: Omit<InvoiceData, "id" | "created_at">) => {
    try {
      const res = await fetch(`${API_BASE}/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
      });
      if (res.ok) {
        addToast(`Invoice ${invoice.invoice_number} created.`, "success");
        await fetchInvoices();
        await fetchMetrics();
      } else {
        addToast("Failed to create invoice", "error");
      }
    } catch (e) {
      addToast("Connection error", "error");
    }
  };

  const updateInvoiceStatus = async (id: number, status: "Paid" | "Pending" | "Overdue") => {
    try {
      const res = await fetch(`${API_BASE}/invoices/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        addToast(`Invoice marked as ${status}.`, "success");
        await fetchInvoices();
        await fetchMetrics();
      }
    } catch (e) {
      addToast("Failed to update invoice", "error");
    }
  };

  const createTask = async (task: Omit<TaskData, "id" | "created_at">) => {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      if (res.ok) {
        addToast("Task added to backlog.", "success");
        await fetchTasks();
      }
    } catch (e) {
      addToast("Failed to create task", "error");
    }
  };

  const updateTaskStatus = async (id: number, status: TaskData["status"]) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status } : t))
        );
        addToast(`Task moved to ${status}`, "info");
      }
    } catch (e) {
      addToast("Failed to move task", "error");
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
      if (res.ok) {
        addToast("Task removed.", "success");
        await fetchTasks();
      }
    } catch (e) {
      addToast("Failed to delete task", "error");
    }
  };

  const startTimer = async (projectName: string, notes?: string) => {
    try {
      const res = await fetch(`${API_BASE}/timer/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_name: projectName, notes }),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveTimer(data);
        addToast(`Timer started for '${projectName}'`, "success");
        await fetchTimerLogs();
      }
    } catch (e) {
      addToast("Failed to start timer", "error");
    }
  };

  const stopTimer = async (notes?: string) => {
    try {
      const res = await fetch(`${API_BASE}/timer/stop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (res.ok) {
        setActiveTimer(null);
        addToast("Timer stopped and hours logged.", "success");
        await fetchTimerLogs();
      }
    } catch (e) {
      addToast("Failed to stop timer", "error");
    }
  };

  const uploadDocument = async (file: File, category: string) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      
      const res = await fetch(`${API_BASE}/documents`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        addToast(`Uploaded ${file.name} to Vault`, "success");
        await fetchDocuments();
      } else {
        addToast("Failed to upload document", "error");
      }
    } catch (e) {
      addToast("Upload connection error", "error");
    }
  };

  const deleteDocument = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/documents/${id}`, { method: "DELETE" });
      if (res.ok) {
        addToast("File deleted from Vault", "success");
        await fetchDocuments();
      }
    } catch (e) {
      addToast("Failed to delete file", "error");
    }
  };

  // AI Chat integration
  const sendChatMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: ChatMessage = { sender: "user", text, timestamp: new Date() };
    setChatHistory((prev) => [...prev, userMsg]);
    
    // Add thinking message placeholder
    const thinkingMsgId = Date.now();
    
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: chatHistory.map((m) => ({ role: m.sender === "user" ? "user" : "model", parts: [{ text: m.text }] }))
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          sender: "ai",
          text: data.response,
          timestamp: new Date(),
          intent: data.intent,
          action_data: data.action_data,
          ticket_created: data.ticket_created,
          ticket_id: data.ticket_id
        };
        
        setChatHistory((prev) => [...prev, aiMsg]);
        
        // Execute AI-driven triggers
        if (data.intent === "dashboard_nav" && data.action_data?.tab) {
          const targetTab = data.action_data.tab as TabType;
          setActiveTabState(targetTab);
        } else if (data.intent === "start_timer" && data.action_data?.project_name) {
          startTimer(data.action_data.project_name, "Started via AI Voice Command");
        } else if (data.intent === "stop_timer") {
          stopTimer("Stopped via AI Voice Command");
        } else if (data.intent === "create_invoice") {
          setActiveTabState("invoices");
          // Let invoices tab know to open create modal
          window.dispatchEvent(new CustomEvent("open-create-invoice-modal", { 
            detail: { 
              clientName: data.action_data?.client_name || "",
              amount: data.action_data?.amount || ""
            } 
          }));
        }
      } else {
        setChatHistory((prev) => [...prev, { sender: "system", text: "Vortex AI offline. Connection timeout.", timestamp: new Date() }]);
      }
    } catch (e) {
      setChatHistory((prev) => [...prev, { sender: "system", text: "FastAPI endpoint unavailable. Make sure backend is running on port 8000.", timestamp: new Date() }]);
    }
  };

  const clearChatHistory = () => {
    setChatHistory([
      {
        sender: "ai",
        text: "History cleared. How can I assist you?",
        timestamp: new Date()
      }
    ]);
  };

  return (
    <DashboardContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isCommandMenuOpen,
        setIsCommandMenuOpen,
        isChatOpen,
        setIsChatOpen,
        clients,
        invoices,
        tasks,
        documents,
        timerLogs,
        activeTimer,
        metrics,
        chatHistory,
        toasts,
        addToast,
        removeToast,
        fetchClients,
        fetchInvoices,
        fetchTasks,
        fetchDocuments,
        fetchTimerLogs,
        fetchMetrics,
        createClient,
        createInvoice,
        updateInvoiceStatus,
        createTask,
        updateTaskStatus,
        deleteTask,
        startTimer,
        stopTimer,
        uploadDocument,
        deleteDocument,
        sendChatMessage,
        clearChatHistory
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

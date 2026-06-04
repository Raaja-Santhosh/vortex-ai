"use client";

import React, { useState, useEffect } from "react";
import { useDashboard, InvoiceData } from "../context/DashboardContext";
import { Plus, X, Search, FileText } from "lucide-react";

export const InvoicingBilling: React.FC = () => {
  const {
    invoices,
    clients,
    createInvoice,
    updateInvoiceStatus,
    addToast
  } = useDashboard();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  // Form State
  const [clientId, setClientId] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("Monthly");

  // Listen to AI custom actions
  useEffect(() => {
    const handleOpenModal = (e: CustomEvent) => {
      const { clientName, amount } = e.detail;
      // Pre-fill client from name
      if (clientName) {
        const found = clients.find(c => c.company.toLowerCase().includes(clientName.toLowerCase()));
        if (found) setClientId(found.id.toString());
      }
      if (amount) {
        setAmount(amount.toString());
      }
      // Set default due date to 14 days from now
      const d = new Date();
      d.setDate(d.getDate() + 14);
      setDueDate(d.toISOString().substring(0, 10));
      
      setIsModalOpen(true);
    };

    window.addEventListener("open-create-invoice-modal" as any, handleOpenModal as any);
    return () => window.removeEventListener("open-create-invoice-modal" as any, handleOpenModal as any);
  }, [clients]);

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !amount || !dueDate) {
      addToast("Please fill all mandatory fields", "error");
      return;
    }

    const nextNum = `INV-2026-${String(invoices.length + 1).padStart(3, "0")}`;
    
    createInvoice({
      client_id: parseInt(clientId),
      invoice_number: nextNum,
      amount: parseFloat(amount),
      due_date: new Date(dueDate).toISOString(),
      status: "Pending",
      is_recurring: isRecurring,
      billing_frequency: isRecurring ? frequency : "One-time"
    });

    // Reset Form
    setClientId("");
    setAmount("");
    setDueDate("");
    setIsRecurring(false);
    setIsModalOpen(false);
  };

  // Filter invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = inv.invoice_number.toLowerCase().includes(search.toLowerCase()) || 
                          inv.client_name?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = filterStatus === "All" || inv.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col space-y-8 max-w-6xl w-full mx-auto animate-in fade-in duration-500 pt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-foreground">Invoicing & Billing</h1>
          <p className="text-text-muted text-sm mt-1">Manage API usage billing and client retainer contracts.</p>
        </div>
        <button
          onClick={() => {
            const d = new Date();
            d.setDate(d.getDate() + 14);
            setDueDate(d.toISOString().substring(0, 10));
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 text-xs text-foreground border border-border-subtle rounded-md hover:bg-surface-dim transition-colors bg-background"
        >
          <Plus className="w-3 h-3 mr-2" /> Draft Invoice
        </button>
      </div>

      {/* Statistics Mini Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-dim border border-border-subtle rounded-xl p-5 hover-subtle-grow">
          <div className="text-xs text-text-muted mb-2">Total Outstanding</div>
          <span className="text-2xl font-medium text-foreground tracking-tight">
            ${invoices.filter(i => i.status !== "Paid").reduce((acc, i) => acc + i.amount, 0).toLocaleString()}
          </span>
        </div>
        <div className="bg-surface-dim border border-border-subtle rounded-xl p-5 hover-subtle-grow">
          <div className="text-xs text-text-muted mb-2 font-medium">Total Collected</div>
          <span className="text-2xl font-medium text-foreground tracking-tight">
            ${invoices.filter(i => i.status === "Paid").reduce((acc, i) => acc + i.amount, 0).toLocaleString()}
          </span>
        </div>
        <div className="bg-surface-dim border border-border-subtle rounded-xl p-5 hover-subtle-grow">
          <div className="text-xs text-text-muted mb-2 font-medium">Overdue Balances</div>
          <span className="text-2xl font-medium text-red-400 tracking-tight">
            ${invoices.filter(i => i.status === "Overdue").reduce((acc, i) => acc + i.amount, 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Filter and search controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border-subtle pl-9 pr-4 py-2 rounded-md text-sm text-foreground outline-none focus:border-text-muted transition-colors placeholder:text-border-subtle"
          />
        </div>
        <div className="flex gap-2 text-sm overflow-x-auto w-full sm:w-auto">
          {["All", "Paid", "Pending", "Overdue"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1.5 rounded-full transition-all text-xs font-medium ${
                filterStatus === status 
                  ? "bg-foreground text-background" 
                  : "bg-surface-dim border border-border-subtle text-text-muted hover:text-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice Grid/Table */}
      <div className="bg-surface-dim border border-border-subtle rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-subtle text-text-muted text-xs bg-background/50">
              <th className="px-5 py-4 font-normal">Invoice ID</th>
              <th className="px-5 py-4 font-normal">Client Company</th>
              <th className="px-5 py-4 font-normal">Due Date</th>
              <th className="px-5 py-4 font-normal">Amount</th>
              <th className="px-5 py-4 font-normal">Type</th>
              <th className="px-5 py-4 font-normal text-center">Status</th>
              <th className="px-5 py-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-background/50 transition-colors">
                <td className="px-5 py-4 text-foreground font-medium">{inv.invoice_number}</td>
                <td className="px-5 py-4 text-text-muted">{inv.client_name}</td>
                <td className="px-5 py-4 text-text-muted">{new Date(inv.due_date).toLocaleDateString()}</td>
                <td className="px-5 py-4 text-foreground font-medium">${inv.amount.toLocaleString()}</td>
                <td className="px-5 py-4 text-xs text-text-muted">{inv.is_recurring ? `Recurring (${inv.billing_frequency})` : "One-time"}</td>
                <td className="px-5 py-4 text-center">
                  <span className={`inline-block px-2 py-1 rounded text-[10px] ${
                    inv.status === "Paid" 
                      ? "bg-foreground text-background" 
                      : inv.status === "Pending" 
                        ? "bg-border-subtle text-text-muted" 
                        : "bg-red-500/10 text-red-500 border border-red-500/20"
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  {inv.status !== "Paid" && (
                    <button
                      onClick={() => updateInvoiceStatus(inv.id, "Paid")}
                      className="px-3 py-1.5 rounded-md border border-border-subtle text-xs text-text-muted hover:text-foreground hover:bg-surface-dim transition-all"
                    >
                      Collect Pay
                    </button>
                  )}
                  {inv.status === "Paid" && (
                    <span className="text-text-muted text-xs mr-2">Reconciled</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-text-muted">
                  No invoices meet the search filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Invoice Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-surface-dim border border-border-subtle rounded-xl p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-border-subtle pb-4 mb-4">
              <div className="flex items-center gap-2 text-foreground">
                <FileText className="w-4 h-4 text-text-muted" />
                <h3 className="text-sm font-medium">Draft Invoice Ledger</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit} className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-muted">Select Client Company</label>
                <select
                  required
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full bg-background border border-border-subtle rounded-md p-2 text-foreground outline-none focus:border-text-muted transition-colors"
                >
                  <option value="" disabled className="text-border-subtle">Select Client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company} (Attn: {c.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-muted">Invoice Amount ($)</label>
                <input
                  required
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-background border border-border-subtle rounded-md p-2 text-foreground outline-none focus:border-text-muted transition-colors placeholder:text-border-subtle"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-muted">Due Date</label>
                <input
                  required
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-background border border-border-subtle rounded-md p-2 text-foreground outline-none focus:border-text-muted transition-colors"
                />
              </div>

              <div className="flex items-center justify-between border border-border-subtle rounded-md p-3 bg-background">
                <span className="text-xs text-foreground">Configure Recurring Billing</span>
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="accent-foreground cursor-pointer"
                />
              </div>

              {isRecurring && (
                <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-2">
                  <label className="text-xs text-text-muted">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full bg-background border border-border-subtle rounded-md p-2 text-foreground outline-none focus:border-text-muted transition-colors"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-foreground text-background p-2 rounded-md font-medium hover:bg-foreground/90 transition-all mt-2"
              >
                Log Drafted Invoice
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

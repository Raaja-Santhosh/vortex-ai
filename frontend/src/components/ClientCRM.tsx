"use client";

import React, { useState } from "react";
import { useDashboard } from "../context/DashboardContext";
import { Plus, X, Users, Mail, Briefcase } from "lucide-react";

export const ClientCRM: React.FC = () => {
  const {
    clients,
    createClient,
    addToast
  } = useDashboard();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [contractValue, setContractValue] = useState("");
  const [ltv, setLtv] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive" | "Lead">("Lead");
  const [notes, setNotes] = useState("");

  const handleCreateClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !company) {
      addToast("Please fill name, email, and company fields", "error");
      return;
    }

    createClient({
      name,
      email,
      phone: phone || null,
      company,
      active_contract_value: contractValue ? parseFloat(contractValue) : 0,
      lifetime_value: ltv ? parseFloat(ltv) : 0,
      status,
      notes: notes || null
    });

    // Reset Form
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setContractValue("");
    setLtv("");
    setStatus("Lead");
    setNotes("");
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col space-y-8 max-w-6xl w-full mx-auto animate-in fade-in duration-500 pt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-foreground">Client Directory</h1>
          <p className="text-text-muted text-sm mt-1">Manage active contracts and pipeline leads.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 text-xs text-foreground border border-border-subtle rounded-md hover:bg-surface-dim transition-colors bg-background"
        >
          <Plus className="w-3 h-3 mr-2" /> Onboard Client
        </button>
      </div>

      {/* Grid of Total Clients Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-dim border border-border-subtle rounded-xl p-5 hover-subtle-grow">
          <div className="text-xs text-text-muted mb-2">Active Accounts</div>
          <span className="text-2xl font-medium text-foreground">
            {clients.filter(c => c.status === "Active").length} Clients
          </span>
        </div>
        <div className="bg-surface-dim border border-border-subtle rounded-xl p-5 hover-subtle-grow">
          <div className="text-xs text-text-muted mb-2">Warm Leads</div>
          <span className="text-2xl font-medium text-foreground">
            {clients.filter(c => c.status === "Lead").length} Pipeline
          </span>
        </div>
        <div className="bg-surface-dim border border-border-subtle rounded-xl p-5 hover-subtle-grow">
          <div className="text-xs text-text-muted mb-2">Contract Value MRR</div>
          <span className="text-2xl font-medium text-foreground tracking-tight">
            ${clients.filter(c => c.status === "Active").reduce((acc, c) => acc + c.active_contract_value, 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Clients CRM Table */}
      <div className="bg-surface-dim border border-border-subtle rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-subtle text-text-muted text-xs bg-background/50">
              <th className="px-5 py-4 font-normal">Company Name</th>
              <th className="px-5 py-4 font-normal">Primary Contact</th>
              <th className="px-5 py-4 font-normal">Contact Email</th>
              <th className="px-5 py-4 font-normal">Contract Value</th>
              <th className="px-5 py-4 font-normal text-center">Status</th>
              <th className="px-5 py-4 font-normal max-w-xs">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {clients.map((c) => (
              <tr key={c.id} className="hover:bg-background/50 transition-colors">
                <td className="px-5 py-4 text-foreground">
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-text-muted shrink-0" />
                    {c.company}
                  </span>
                </td>
                <td className="px-5 py-4 text-foreground/90">{c.name}</td>
                <td className="px-5 py-4 text-text-muted">
                  <span className="flex items-center gap-1.5 hover:text-foreground cursor-pointer transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                    {c.email}
                  </span>
                </td>
                <td className="px-5 py-4 text-foreground font-medium">
                  ${c.active_contract_value.toLocaleString()}/mo
                </td>
                <td className="px-5 py-4 text-center">
                  <span className={`inline-block px-2 py-1 rounded text-[10px] ${
                    c.status === "Active"
                      ? "bg-foreground text-background"
                      : c.status === "Lead"
                        ? "bg-border-subtle text-text-muted"
                        : "bg-background border border-border-subtle text-text-muted"
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-text-muted text-xs truncate max-w-xs" title={c.notes || ""}>
                  {c.notes || "—"}
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-text-muted">
                  No clients onboarded in directory.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Onboard Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-surface-dim border border-border-subtle rounded-xl p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-border-subtle pb-4 mb-4">
              <div className="flex items-center gap-2 text-foreground">
                <Users className="w-4 h-4 text-text-muted" />
                <h3 className="text-sm font-medium">Onboard Client Account</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateClientSubmit} className="flex flex-col gap-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-muted">Company Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. ACME Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-background border border-border-subtle rounded-md p-2 text-foreground outline-none focus:border-text-muted transition-colors placeholder:text-border-subtle"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-muted">Contact Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-background border border-border-subtle rounded-md p-2 text-foreground outline-none focus:border-text-muted transition-colors placeholder:text-border-subtle"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-muted">Email</label>
                  <input
                    required
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background border border-border-subtle rounded-md p-2 text-foreground outline-none focus:border-text-muted transition-colors placeholder:text-border-subtle"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-muted">Phone (Optional)</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-background border border-border-subtle rounded-md p-2 text-foreground outline-none focus:border-text-muted transition-colors placeholder:text-border-subtle"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-muted">Contract Value ($/mo)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={contractValue}
                    onChange={(e) => setContractValue(e.target.value)}
                    className="w-full bg-background border border-border-subtle rounded-md p-2 text-foreground outline-none focus:border-text-muted transition-colors placeholder:text-border-subtle"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-muted">Estimated LTV ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 25000"
                    value={ltv}
                    onChange={(e) => setLtv(e.target.value)}
                    className="w-full bg-background border border-border-subtle rounded-md p-2 text-foreground outline-none focus:border-text-muted transition-colors placeholder:text-border-subtle"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-muted">Onboarding Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-background border border-border-subtle rounded-md p-2 text-foreground outline-none focus:border-text-muted transition-colors"
                >
                  <option value="Lead">Lead (Pipeline)</option>
                  <option value="Active">Active (Contracted)</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-muted">CRM Notes</label>
                <textarea
                  placeholder="Record customer briefs, notes, contracts scope..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-background border border-border-subtle rounded-md p-2 text-foreground outline-none focus:border-text-muted transition-colors resize-none placeholder:text-border-subtle"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-foreground text-background p-2 rounded-md font-medium hover:bg-foreground/90 transition-all mt-2"
              >
                Create CRM Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

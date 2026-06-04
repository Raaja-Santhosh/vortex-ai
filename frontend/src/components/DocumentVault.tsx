"use client";

import React, { useState, useRef } from "react";
import { useDashboard, DocumentData } from "../context/DashboardContext";
import { Upload, Shield, File, Trash2, Folder, Download } from "lucide-react";

export const DocumentVault: React.FC = () => {
  const {
    documents,
    uploadDocument,
    deleteDocument,
    addToast
  } = useDashboard();

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<"NDA" | "Tax" | "Contract" | "Asset">("NDA");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      addToast("File exceeds 10MB limit", "error");
      return;
    }

    uploadDocument(file, selectedCategory);
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "NDA":
        return Shield;
      case "Tax":
        return File;
      default:
        return Folder;
    }
  };

  const filteredDocs = documents.filter((doc) => {
    return activeCategory === "All" || doc.category === activeCategory;
  });

  const totalVaultSize = documents.reduce((acc, doc) => acc + doc.size_bytes, 0);

  return (
    <div className="flex flex-col space-y-8 max-w-6xl w-full mx-auto animate-in fade-in duration-500 pt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-foreground">Document Vault</h1>
          <p className="text-text-muted text-sm mt-1">Securely store and manage client assets and agreements.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted bg-surface-dim border border-border-subtle rounded-md px-3 py-1.5">
          <span>Storage:</span>
          <span className="font-medium text-foreground">
            {formatBytes(totalVaultSize)} / 5 GB
          </span>
        </div>
      </div>

      {/* Document controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Upload Zone */}
        <div className="bg-surface-dim border border-border-subtle rounded-xl p-5 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-medium text-foreground">Upload Document</h3>
            <p className="text-xs text-text-muted mt-1">Secure encrypted insertion</p>
          </div>

          <div className="flex flex-col gap-3 text-sm mt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-muted">Choose Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="w-full bg-background border border-border-subtle rounded-md p-2 text-foreground outline-none focus:border-text-muted transition-colors"
              >
                <option value="NDA">NDA Agreements</option>
                <option value="Tax">Tax Filing Forms</option>
                <option value="Contract">Service Contracts (SOW)</option>
                <option value="Asset">Project Assets</option>
              </select>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={handleUploadClick}
              className="mt-2 border border-dashed border-border-subtle hover:border-text-muted bg-background hover:bg-background/50 p-6 rounded-md cursor-pointer transition-all flex flex-col items-center gap-2"
            >
              <Upload className="w-5 h-5 text-text-muted" />
              <div className="text-sm font-medium text-foreground">Select File</div>
              <div className="text-xs text-text-muted">PDF, DOCX, PNG (Max 10MB)</div>
            </button>
          </div>
        </div>

        {/* Categories description info */}
        <div className="md:col-span-2 bg-surface-dim border border-border-subtle rounded-xl p-6 flex flex-col justify-center text-sm text-text-muted leading-relaxed gap-3">
          <span className="text-foreground font-medium flex items-center gap-2"><Shield className="w-4 h-4"/> Vault Security Standards</span>
          <p>
            Vortex Document Vault automatically encrypts files at rest using AES-256 standards. Direct server paths are obfuscated.
          </p>
          <p>
            NDA and Tax folders have isolated access metrics. Access logs are automatically registered to audit trails.
          </p>
          <p>
            <span className="text-foreground font-medium">AI Integration:</span> The chatbot handles queries about vault items, matching file names and categories to let owners quickly search assets via natural language (e.g. "show nda templates").
          </p>
        </div>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex gap-2 text-sm border-b border-border-subtle pb-3 overflow-x-auto">
        {["All", "NDA", "Tax", "Contract", "Asset"].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full transition-all text-xs font-medium ${
              activeCategory === cat
                ? "bg-foreground text-background"
                : "bg-surface-dim border border-border-subtle text-text-muted hover:text-foreground"
            }`}
          >
            {cat}s
          </button>
        ))}
      </div>

      {/* Vault Files Table */}
      <div className="bg-surface-dim border border-border-subtle rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-subtle text-text-muted text-xs bg-background/50">
              <th className="px-5 py-4 font-normal">File Name</th>
              <th className="px-5 py-4 font-normal">Category</th>
              <th className="px-5 py-4 font-normal">File Size</th>
              <th className="px-5 py-4 font-normal">Uploaded At</th>
              <th className="px-5 py-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {filteredDocs.map((doc) => {
              const Icon = getCategoryIcon(doc.category);
              return (
                <tr key={doc.id} className="hover:bg-background/50 transition-colors">
                  <td className="px-5 py-4 text-foreground">
                    <span className="flex items-center gap-2 truncate max-w-[200px] md:max-w-sm">
                      <Icon className="w-4 h-4 text-text-muted shrink-0" />
                      {doc.name}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-block px-2 py-1 rounded text-[10px] bg-background border border-border-subtle text-text-muted">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-text-muted">{formatBytes(doc.size_bytes)}</td>
                  <td className="px-5 py-4 text-text-muted text-xs">
                    {new Date(doc.uploaded_at).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-right flex justify-end gap-2">
                    <button
                      onClick={() => addToast(`Opening file '${doc.name}'`, "info")}
                      className="p-1.5 rounded bg-background border border-border-subtle text-text-muted hover:text-foreground hover:border-text-muted transition-all"
                      title="Download File"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="p-1.5 rounded bg-background border border-border-subtle text-text-muted hover:text-red-400 hover:border-red-400 transition-all"
                      title="Delete File"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredDocs.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-text-muted">
                  Vault is empty for category '{activeCategory}'
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

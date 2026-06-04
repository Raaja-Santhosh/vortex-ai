"use client";

import React, { useState } from "react";
import { useDashboard, TaskData } from "../context/DashboardContext";
import { Plus, X, ArrowLeft, ArrowRight, Trash2, CheckCircle2 } from "lucide-react";

export const ProjectTasks: React.FC = () => {
  const {
    tasks,
    createTask,
    updateTaskStatus,
    deleteTask,
    addToast
  } = useDashboard();

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectName, setProjectName] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !projectName) {
      addToast("Please fill in task title and project name", "error");
      return;
    }

    createTask({
      title,
      description: description || null,
      status: "Todo",
      project_name: projectName,
      priority,
      due_date: null
    });

    // Reset Form
    setTitle("");
    setDescription("");
    setProjectName("");
    setPriority("Medium");
    setIsModalOpen(false);
  };

  const columns: { label: string; key: TaskData["status"] }[] = [
    { label: "Todo", key: "Todo" },
    { label: "In Progress", key: "InProgress" },
    { label: "Review", key: "Review" },
    { label: "Done", key: "Done" }
  ];

  // Helper to move task status
  const moveTask = (task: TaskData, direction: "left" | "right") => {
    const statusOrder: TaskData["status"][] = ["Todo", "InProgress", "Review", "Done"];
    const currentIndex = statusOrder.indexOf(task.status);
    let nextIndex = currentIndex;

    if (direction === "left" && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    } else if (direction === "right" && currentIndex < statusOrder.length - 1) {
      nextIndex = currentIndex + 1;
    }

    if (nextIndex !== currentIndex) {
      updateTaskStatus(task.id, statusOrder[nextIndex]);
    }
  };

  return (
    <div className="flex flex-col space-y-8 max-w-6xl w-full mx-auto animate-in fade-in duration-500 pt-8 h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-foreground">Project Tasks</h1>
          <p className="text-text-muted text-sm mt-1">Manage agent deployments and client deliveries.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 text-xs text-foreground border border-border-subtle rounded-md hover:bg-surface-dim transition-colors bg-background"
        >
          <Plus className="w-3 h-3 mr-2" /> Initialize Task
        </button>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-grow min-h-0 overflow-hidden">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className="flex flex-col bg-surface-dim border border-border-subtle rounded-xl overflow-hidden h-full">
              {/* Column Header */}
              <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-background/30 shrink-0">
                <span className="text-xs text-foreground font-medium">
                  {col.label}
                </span>
                <span className="text-xs bg-background border border-border-subtle text-text-muted px-2 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>

              {/* Column Tasks */}
              <div className="p-4 flex flex-col gap-3 overflow-y-auto flex-grow custom-scrollbar">
                {colTasks.map((t) => (
                  <div
                    key={t.id}
                    className="border border-border-subtle p-4 bg-background rounded-lg hover:border-text-muted/50 transition-all flex flex-col gap-3 relative hover-subtle-grow group"
                  >
                    {/* Top row */}
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[10px] text-text-muted truncate max-w-[120px]">
                        {t.project_name}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                        t.priority === "High"
                          ? "bg-red-500/10 text-red-500 border border-red-500/20"
                          : t.priority === "Medium"
                            ? "bg-foreground/5 text-foreground/70 border border-border-subtle"
                            : "bg-background text-text-muted border border-border-subtle"
                      }`}>
                        {t.priority}
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground leading-tight">{t.title}</h4>
                      {t.description && (
                        <p className="text-xs text-text-muted mt-1.5 leading-relaxed line-clamp-3">
                          {t.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom Actions Row */}
                    <div className="flex justify-between items-center pt-1 mt-auto">
                      {/* Left/Right movement hooks */}
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={t.status === "Todo"}
                          onClick={() => moveTask(t, "left")}
                          className="p-1.5 rounded bg-surface-dim border border-border-subtle text-text-muted hover:text-foreground hover:bg-background disabled:opacity-30 transition-all"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                        <button
                          disabled={t.status === "Done"}
                          onClick={() => moveTask(t, "right")}
                          className="p-1.5 rounded bg-surface-dim border border-border-subtle text-text-muted hover:text-foreground hover:bg-background disabled:opacity-30 transition-all"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Trash */}
                      <button
                        onClick={() => deleteTask(t.id)}
                        className="p-1.5 text-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="py-8 text-center text-text-muted text-xs border border-dashed border-border-subtle rounded-lg">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-surface-dim border border-border-subtle rounded-xl p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-border-subtle pb-4 mb-4">
              <div className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="w-4 h-4 text-text-muted" />
                <h3 className="text-sm font-medium">Initialize New Task</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTaskSubmit} className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-muted">Task Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Train new NLP model"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-background border border-border-subtle rounded-md p-2 text-foreground outline-none focus:border-text-muted transition-colors placeholder:text-border-subtle"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-muted">Project Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. AI Customer Service Agent"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-background border border-border-subtle rounded-md p-2 text-foreground outline-none focus:border-text-muted transition-colors placeholder:text-border-subtle"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-muted">Task Details</label>
                <textarea
                  placeholder="Describe the scope of the ticket..."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-background border border-border-subtle rounded-md p-2 text-foreground outline-none focus:border-text-muted transition-colors resize-none placeholder:text-border-subtle"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-muted">Priority</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {["Low", "Medium", "High"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p as any)}
                      className={`py-2 rounded-md transition-all ${
                        priority === p
                          ? "bg-foreground text-background font-medium"
                          : "bg-background border border-border-subtle text-text-muted hover:border-text-muted"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-foreground text-background p-2 rounded-md font-medium hover:bg-foreground/90 transition-all mt-2"
              >
                Insert Task to Backlog
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

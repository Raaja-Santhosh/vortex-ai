"use client";

import React from "react";
import { DashboardProvider } from "../context/DashboardContext";
import DashboardShell from "../components/DashboardShell";

export default function Page() {
  return (
    <DashboardProvider>
      <DashboardShell />
    </DashboardProvider>
  );
}

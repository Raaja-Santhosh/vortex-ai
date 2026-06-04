import { useState, useEffect } from 'react';

export interface DashboardData {
  apiRequests: number;
  apiErrors: number;
  activeAgents: number;
  successRate: number;
  latencyHistory: number[]; // ms
  computeCost: number;
  gpuHoursRemaining: number;
  automatedActions: number;
  totalApiSpend: number;
  activeProjects: number;
  projectedSpend: number;
  cloudCostIncrease: number;
  cloudCostsHistory: number[];
}

const initialData: DashboardData = {
  apiRequests: 142500,
  apiErrors: 12,
  activeAgents: 8,
  successRate: 99.8,
  latencyHistory: [150, 160, 200, 140, 180, 250, 170, 160, 155], // ms
  computeCost: 450.50,
  gpuHoursRemaining: 124.5,
  automatedActions: 1420,
  totalApiSpend: 5278.50,
  activeProjects: 4,
  projectedSpend: 12500,
  cloudCostIncrease: 10,
  cloudCostsHistory: [15, 12, 14, 6, 11, 8, 5, 10, 12, 10],
};

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>(initialData);

  useEffect(() => {
    // Simulate live data fluctuating every 3 seconds
    const interval = setInterval(() => {
      setData((prev) => {
        const rand = () => (Math.random() - 0.5) * 2; // -1 to 1

        const newLatencyHistory = [...prev.latencyHistory];
        newLatencyHistory.shift();
        newLatencyHistory.push(Math.max(100, Math.min(400, newLatencyHistory[newLatencyHistory.length - 1] + rand() * 40)));

        const newCloudHistory = [...prev.cloudCostsHistory];
        newCloudHistory.shift();
        newCloudHistory.push(Math.max(5, Math.min(30, newCloudHistory[newCloudHistory.length - 1] + rand() * 5)));

        return {
          ...prev,
          apiRequests: prev.apiRequests + Math.floor(Math.random() * 500),
          apiErrors: Math.random() > 0.8 ? prev.apiErrors + 1 : prev.apiErrors,
          successRate: Math.max(90, Math.min(100, prev.successRate + (rand() * 0.1))),
          latencyHistory: newLatencyHistory,
          computeCost: prev.computeCost + (Math.random() * 2),
          gpuHoursRemaining: Math.max(0, prev.gpuHoursRemaining - (Math.random() * 0.5)),
          automatedActions: prev.automatedActions + Math.floor(Math.random() * 5),
          totalApiSpend: prev.totalApiSpend + (Math.random() * 5),
          cloudCostsHistory: newCloudHistory,
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return data;
};

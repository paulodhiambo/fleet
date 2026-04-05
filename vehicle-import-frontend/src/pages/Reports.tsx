import { useEffect, useState } from "react";
import { api, Summary } from "../services/api";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#f59e0b", "#3b82f6", "#8b5cf6", "#6366f1", "#22c55e", "#ef4444", "#14b8a6", "#f97316"];

export default function Reports() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [byStatus, setByStatus] = useState<{ status: string; count: number }[]>([]);
  const [byOrigin, setByOrigin] = useState<{ country: string; count: number }[]>([]);
  const [inspectionRates, setInspectionRates] = useState<Record<string, unknown>>({});
  const [issuesSummary, setIssuesSummary] = useState<Record<string, unknown>>({});
  const [serviceSummary, setServiceSummary] = useState<Record<string, unknown>>({});
  const [remindersSummary, setRemindersSummary] = useState<Record<string, unknown>>({});

  useEffect(() => {
    api.reports.summary().then(setSummary);
    api.reports.vehiclesByStatus().then(setByStatus);
    api.reports.vehiclesByOrigin().then(setByOrigin);
    api.reports.inspectionRates().then(setInspectionRates);
    api.reports.issuesSummary().then(setIssuesSummary);
    api.reports.serviceSummary().then(setServiceSummary);
    api.reports.remindersSummary().then(setRemindersSummary);
  }, []);

  if (!summary) return (
    <div className="p-8 flex items-center justify-center h-full">
      <div className="animate-pulse text-gray-400 dark:text-gray-500">Loading reports...</div>
    </div>
  );

  const preInsp = (inspectionRates.pre_import || {}) as Record<string, unknown>;
  const postInsp = (inspectionRates.post_import || {}) as Record<string, unknown>;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Fleet Status Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={byStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={100} label>
                {byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "13px" }} /><Legend wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Vehicles by Origin Country</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byOrigin}>
              <XAxis dataKey="country" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip contentStyle={{ borderRadius: "8px", fontSize: "13px" }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-6">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Pre-Import Inspections</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{(preInsp.total as number) || 0}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pass Rate: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{(preInsp.pass_rate as number) || 0}%</span></p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating: {(preInsp.average_rating as number) || 0}/5</p>
        </div>
        <div className="card p-6">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Post-Import Inspections</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{(postInsp.total as number) || 0}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pass Rate: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{(postInsp.pass_rate as number) || 0}%</span></p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating: {(postInsp.average_rating as number) || 0}/5</p>
        </div>
        <div className="card p-6">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Issues</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{(issuesSummary.total as number) || 0}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Open: <span className="font-semibold text-red-600 dark:text-red-400">{(issuesSummary.open as number) || 0}</span></p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Resolved: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{(issuesSummary.resolved as number) || 0}</span></p>
        </div>
        <div className="card p-6">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Service</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{(serviceSummary.total as number) || 0}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Cost: <span className="font-semibold text-gray-900 dark:text-white">${(serviceSummary.total_cost as number) || 0}</span></p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Completed: {(serviceSummary.completed as number) || 0}</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Reminders Overview</h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total", value: (remindersSummary.total as number) || 0, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
            { label: "Pending", value: (remindersSummary.pending as number) || 0, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
            { label: "Completed", value: (remindersSummary.completed as number) || 0, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
            { label: "Overdue", value: (remindersSummary.overdue as number) || 0, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20" },
          ].map((item) => (
            <div key={item.label} className={`text-center p-4 ${item.bg} rounded-xl`}>
              <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

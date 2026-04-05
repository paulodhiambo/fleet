import { useEffect, useState } from "react";
import { api, Summary } from "../services/api";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Car, Clock, ShieldCheck, Truck, CheckCircle, XCircle, AlertTriangle, Wrench } from "lucide-react";

const COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#6366f1", "#22c55e", "#ef4444"];

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [byStatus, setByStatus] = useState<{ status: string; count: number }[]>([]);
  const [byOrigin, setByOrigin] = useState<{ country: string; count: number }[]>([]);
  const [issuesSummary, setIssuesSummary] = useState<Record<string, unknown>>({});
  const [serviceSummary, setServiceSummary] = useState<Record<string, unknown>>({});

  useEffect(() => {
    api.reports.summary().then(setSummary);
    api.reports.vehiclesByStatus().then(setByStatus);
    api.reports.vehiclesByOrigin().then(setByOrigin);
    api.reports.issuesSummary().then(setIssuesSummary);
    api.reports.serviceSummary().then(setServiceSummary);
  }, []);

  if (!summary) return (
    <div className="p-8 flex items-center justify-center h-full">
      <div className="animate-pulse text-gray-400 dark:text-gray-500">Loading dashboard...</div>
    </div>
  );

  const statCards = [
    { label: "Total Vehicles", value: summary.total_vehicles, icon: Car, gradient: "from-blue-500 to-blue-600" },
    { label: "Pending", value: summary.pending, icon: Clock, gradient: "from-amber-500 to-amber-600" },
    { label: "Pre-Inspection", value: summary.pre_inspection, icon: ShieldCheck, gradient: "from-cyan-500 to-cyan-600" },
    { label: "In Transit", value: summary.in_transit, icon: Truck, gradient: "from-purple-500 to-purple-600" },
    { label: "Cleared", value: summary.cleared, icon: CheckCircle, gradient: "from-emerald-500 to-emerald-600" },
    { label: "Rejected", value: summary.rejected, icon: XCircle, gradient: "from-red-500 to-red-600" },
    { label: "Open Issues", value: (issuesSummary.open as number) || 0, icon: AlertTriangle, gradient: "from-orange-500 to-orange-600" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {statCards.map((c) => (
          <div key={c.label} className="card p-4 group">
            <div className={`bg-gradient-to-br ${c.gradient} w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform duration-200`}>
              <c.icon size={18} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{c.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Vehicles by Status</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={byStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={100} label>
                {byStatus.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "13px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Vehicles by Origin</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byOrigin}>
              <XAxis dataKey="country" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "13px" }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle size={18} className="text-orange-500" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Issues Overview</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Open", value: (issuesSummary.open as number) || 0, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20" },
              { label: "In Progress", value: (issuesSummary.in_progress as number) || 0, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
              { label: "Resolved", value: (issuesSummary.resolved as number) || 0, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
              { label: "Total", value: (issuesSummary.total as number) || 0, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
            ].map((item) => (
              <div key={item.label} className={`text-center p-4 ${item.bg} rounded-xl`}>
                <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Wrench size={18} className="text-blue-500" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Service Overview</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Scheduled", value: (serviceSummary.scheduled as number) || 0, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
              { label: "In Progress", value: (serviceSummary.in_progress as number) || 0, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
              { label: "Completed", value: (serviceSummary.completed as number) || 0, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
              { label: "Total Cost", value: `$${(serviceSummary.total_cost as number) || 0}`, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" },
            ].map((item) => (
              <div key={item.label} className={`text-center p-4 ${item.bg} rounded-xl`}>
                <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

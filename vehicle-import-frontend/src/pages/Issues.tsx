import { useEffect, useState } from "react";
import { api, Issue, IssueCreate, Vehicle } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function Issues() {
  const [items, setItems] = useState<Issue[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Issue | null>(null);
  const [form, setForm] = useState<IssueCreate>({ vehicle_id: 0, title: "", reported_date: new Date().toISOString().slice(0, 10) });
  const [filterStatus, setFilterStatus] = useState("");

  const load = () => {
    const p: Record<string, string> = {};
    if (filterStatus) p.status = filterStatus;
    api.issues.list(p).then(setItems); api.vehicles.list().then(setVehicles);
  };
  useEffect(() => { load(); }, [filterStatus]);

  const vName = (id: number) => { const v = vehicles.find(x => x.id === id); return v ? `${v.make} ${v.model}` : `#${id}`; };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) await api.issues.update(editing.id, form);
    else await api.issues.create(form);
    setShowForm(false); setEditing(null); load();
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="page-header">Issues</h1>
        <button onClick={() => { setEditing(null); setForm({ vehicle_id: vehicles[0]?.id || 0, title: "", reported_date: new Date().toISOString().slice(0, 10), priority: "medium", status: "open" }); setShowForm(true); }} className="btn-primary"><Plus size={16} /> Report Issue</button>
      </div>
      <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field w-auto">
        <option value="">All Status</option>
        {["open","in_progress","resolved","closed"].map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead className="table-header"><tr>
            <th>Title</th>
            <th>Vehicle</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Reported By</th>
            <th>Date</th>
            <th>Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((i) => (
              <tr key={i.id} className="table-row">
                <td className="table-cell font-medium text-gray-900 dark:text-white">{i.title}</td>
                <td className="table-cell">{vName(i.vehicle_id)}</td>
                <td className="table-cell"><StatusBadge status={i.priority} /></td>
                <td className="table-cell"><StatusBadge status={i.status} /></td>
                <td className="table-cell">{i.reported_by || "—"}</td>
                <td className="table-cell">{i.reported_date}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => { setEditing(i); setForm({ vehicle_id: i.vehicle_id, title: i.title, description: i.description || "", priority: i.priority, status: i.status, reported_by: i.reported_by || "", assigned_to: i.assigned_to || "", reported_date: i.reported_date, due_date: i.due_date || "", notes: i.notes || "" }); setShowForm(true); }} className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"><Pencil size={16} /></button>
                  <button onClick={() => { if (confirm("Delete?")) api.issues.remove(i.id).then(load); }} className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500 py-12">No issues found</td></tr>}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="modal-overlay">
          <form onSubmit={handleSubmit} className="modal-content max-w-lg">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editing ? "Edit Issue" : "Report Issue"}</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="label-text">Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required /></div>
              <div><label className="label-text">Vehicle</label><select value={form.vehicle_id} onChange={(e) => setForm({ ...form, vehicle_id: Number(e.target.value) })} className="input-field">{vehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model}</option>)}</select></div>
              <div><label className="label-text">Priority</label><select value={form.priority || "medium"} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="input-field">{["low","medium","high","critical"].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div><label className="label-text">Status</label><select value={form.status || "open"} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">{["open","in_progress","resolved","closed"].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div><label className="label-text">Reported Date</label><input type="date" value={form.reported_date} onChange={(e) => setForm({ ...form, reported_date: e.target.value })} className="input-field" /></div>
              <div><label className="label-text">Reported By</label><input value={form.reported_by || ""} onChange={(e) => setForm({ ...form, reported_by: e.target.value })} className="input-field" /></div>
              <div><label className="label-text">Assigned To</label><input value={form.assigned_to || ""} onChange={(e) => setForm({ ...form, assigned_to: e.target.value })} className="input-field" /></div>
              <div><label className="label-text">Due Date</label><input type="date" value={form.due_date || ""} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className="input-field" /></div>
              <div className="col-span-2"><label className="label-text">Description</label><textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={2} /></div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">{editing ? "Update" : "Create"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

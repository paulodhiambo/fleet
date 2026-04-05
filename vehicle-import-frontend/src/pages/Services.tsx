import { useEffect, useState } from "react";
import { api, ServiceEntry, ServiceCreate, Vehicle } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function Services() {
  const [items, setItems] = useState<ServiceEntry[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ServiceEntry | null>(null);
  const [form, setForm] = useState<ServiceCreate>({ vehicle_id: 0, service_type: "", service_date: "" });

  const load = () => { api.services.list().then(setItems); api.vehicles.list().then(setVehicles); };
  useEffect(() => { load(); }, []);

  const vName = (id: number) => { const v = vehicles.find(x => x.id === id); return v ? `${v.make} ${v.model}` : `#${id}`; };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) await api.services.update(editing.id, form);
    else await api.services.create(form);
    setShowForm(false); setEditing(null); load();
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="page-header">Service</h1>
        <button onClick={() => { setEditing(null); setForm({ vehicle_id: vehicles[0]?.id || 0, service_type: "", service_date: new Date().toISOString().slice(0, 10), status: "scheduled", priority: "medium" }); setShowForm(true); }} className="btn-primary"><Plus size={16} /> New Service</button>
      </div>
      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead className="table-header"><tr>
            <th>Vehicle</th>
            <th>Type</th>
            <th>Date</th>
            <th>Technician</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Total Cost</th>
            <th>Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((s) => (
              <tr key={s.id} className="table-row">
                <td className="table-cell">{vName(s.vehicle_id)}</td>
                <td className="table-cell">{s.service_type}</td>
                <td className="table-cell">{s.service_date}</td>
                <td className="table-cell">{s.technician || "—"}</td>
                <td className="table-cell"><StatusBadge status={s.status} /></td>
                <td className="table-cell"><StatusBadge status={s.priority} /></td>
                <td className="table-cell">{s.total_cost ? `$${s.total_cost.toLocaleString()}` : "—"}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => { setEditing(s); setForm({ vehicle_id: s.vehicle_id, service_type: s.service_type, description: s.description || "", service_date: s.service_date, completed_date: s.completed_date || "", technician: s.technician || "", labor_cost: s.labor_cost || undefined, parts_cost: s.parts_cost || undefined, total_cost: s.total_cost || undefined, meter_reading: s.meter_reading || undefined, status: s.status, priority: s.priority, notes: s.notes || "" }); setShowForm(true); }} className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"><Pencil size={16} /></button>
                  <button onClick={() => { if (confirm("Delete?")) api.services.remove(s.id).then(load); }} className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500 py-12">No service entries</td></tr>}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="modal-overlay">
          <form onSubmit={handleSubmit} className="modal-content max-w-lg max-h-screen overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editing ? "Edit Service" : "New Service"}</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label-text">Vehicle</label><select value={form.vehicle_id} onChange={(e) => setForm({ ...form, vehicle_id: Number(e.target.value) })} className="input-field">{vehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model}</option>)}</select></div>
              <div><label className="label-text">Service Type</label><input value={form.service_type} onChange={(e) => setForm({ ...form, service_type: e.target.value })} className="input-field" required /></div>
              <div><label className="label-text">Date</label><input type="date" value={form.service_date} onChange={(e) => setForm({ ...form, service_date: e.target.value })} className="input-field" required /></div>
              <div><label className="label-text">Completed Date</label><input type="date" value={form.completed_date || ""} onChange={(e) => setForm({ ...form, completed_date: e.target.value })} className="input-field" /></div>
              <div><label className="label-text">Technician</label><input value={form.technician || ""} onChange={(e) => setForm({ ...form, technician: e.target.value })} className="input-field" /></div>
              <div><label className="label-text">Status</label><select value={form.status || "scheduled"} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">{["scheduled","in_progress","completed","cancelled"].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div><label className="label-text">Priority</label><select value={form.priority || "medium"} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="input-field">{["low","medium","high","critical"].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div><label className="label-text">Meter Reading</label><input type="number" value={form.meter_reading || ""} onChange={(e) => setForm({ ...form, meter_reading: Number(e.target.value) })} className="input-field" /></div>
              <div><label className="label-text">Labor Cost</label><input type="number" step="0.01" value={form.labor_cost || ""} onChange={(e) => setForm({ ...form, labor_cost: Number(e.target.value) })} className="input-field" /></div>
              <div><label className="label-text">Parts Cost</label><input type="number" step="0.01" value={form.parts_cost || ""} onChange={(e) => setForm({ ...form, parts_cost: Number(e.target.value) })} className="input-field" /></div>
              <div><label className="label-text">Total Cost</label><input type="number" step="0.01" value={form.total_cost || ""} onChange={(e) => setForm({ ...form, total_cost: Number(e.target.value) })} className="input-field" /></div>
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

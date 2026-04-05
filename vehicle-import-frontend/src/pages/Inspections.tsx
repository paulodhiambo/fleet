import { useEffect, useState } from "react";
import { api, Inspection, InspectionCreate, Vehicle } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function Inspections() {
  const [items, setItems] = useState<Inspection[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Inspection | null>(null);
  const [form, setForm] = useState<InspectionCreate>({ vehicle_id: 0, inspection_type: "routine", inspection_date: "", inspector_name: "" });

  const load = () => { api.inspections.list().then(setItems); api.vehicles.list().then(setVehicles); };
  useEffect(() => { load(); }, []);

  const vName = (id: number) => { const v = vehicles.find(x => x.id === id); return v ? `${v.make} ${v.model} (${v.vin})` : `#${id}`; };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) await api.inspections.update(editing.id, form);
    else await api.inspections.create(form);
    setShowForm(false); setEditing(null); load();
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="page-header">Inspections</h1>
        <button onClick={() => { setEditing(null); setForm({ vehicle_id: vehicles[0]?.id || 0, inspection_type: "routine", inspection_date: new Date().toISOString().slice(0, 10), inspector_name: "" }); setShowForm(true); }} className="btn-primary"><Plus size={16} /> New Inspection</button>
      </div>
      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead className="table-header"><tr>
            <th>Vehicle</th>
            <th>Type</th>
            <th>Date</th>
            <th>Inspector</th>
            <th>Status</th>
            <th>Passed</th>
            <th>Items</th>
            <th>Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((i) => (
              <tr key={i.id} className="table-row">
                <td className="table-cell">{vName(i.vehicle_id)}</td>
                <td className="px-4 py-3 capitalize">{i.inspection_type}</td>
                <td className="table-cell">{i.inspection_date}</td>
                <td className="table-cell">{i.inspector_name}</td>
                <td className="table-cell"><StatusBadge status={i.status} /></td>
                <td className="table-cell">{i.passed ? <span className="text-green-600 font-medium">Pass</span> : <span className="text-red-600 font-medium">Fail</span>}</td>
                <td className="table-cell">{i.items.length}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => { setEditing(i); setForm({ vehicle_id: i.vehicle_id, inspection_type: i.inspection_type, inspection_date: i.inspection_date, inspector_name: i.inspector_name, status: i.status, passed: i.passed, notes: i.notes || "" }); setShowForm(true); }} className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"><Pencil size={16} /></button>
                  <button onClick={() => { if (confirm("Delete?")) api.inspections.remove(i.id).then(load); }} className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500 py-12">No inspections found</td></tr>}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="modal-overlay">
          <form onSubmit={handleSubmit} className="modal-content max-w-lg">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editing ? "Edit Inspection" : "New Inspection"}</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label-text">Vehicle</label>
                <select value={form.vehicle_id} onChange={(e) => setForm({ ...form, vehicle_id: Number(e.target.value) })} className="input-field">
                  {vehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model}</option>)}
                </select>
              </div>
              <div><label className="label-text">Type</label>
                <select value={form.inspection_type} onChange={(e) => setForm({ ...form, inspection_type: e.target.value })} className="input-field">
                  {["routine", "safety", "emissions", "compliance", "damage", "other"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div><label className="label-text">Date</label>
                <input type="date" value={form.inspection_date} onChange={(e) => setForm({ ...form, inspection_date: e.target.value })} className="input-field" />
              </div>
              <div><label className="label-text">Inspector</label>
                <input value={form.inspector_name} onChange={(e) => setForm({ ...form, inspector_name: e.target.value })} className="input-field" />
              </div>
              <div><label className="label-text">Status</label>
                <select value={form.status || "pending"} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                  {["pending", "in_progress", "completed"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.passed || false} onChange={(e) => setForm({ ...form, passed: e.target.checked })} /> Passed</label>
              </div>
            </div>
            <div className="mt-3"><label className="label-text">Notes</label><textarea value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" rows={2} /></div>
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

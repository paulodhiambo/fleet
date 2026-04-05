import { useEffect, useState } from "react";
import { api, Reminder, ReminderCreate, Vehicle } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import { Plus, Pencil, Trash2, Bell } from "lucide-react";

export default function Reminders() {
  const [items, setItems] = useState<Reminder[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Reminder | null>(null);
  const [form, setForm] = useState<ReminderCreate>({ reminder_type: "service", title: "", due_date: "" });

  const load = () => { api.reminders.list().then(setItems); api.vehicles.list().then(setVehicles); };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) await api.reminders.update(editing.id, form);
    else await api.reminders.create(form);
    setShowForm(false); setEditing(null); load();
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="page-header">Reminders</h1>
        <button onClick={() => { setEditing(null); setForm({ reminder_type: "service", title: "", due_date: new Date().toISOString().slice(0, 10) }); setShowForm(true); }} className="btn-primary"><Plus size={16} /> Add Reminder</button>
      </div>
      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead className="table-header"><tr>
            <th>Title</th>
            <th>Type</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Recurring</th>
            <th>Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((r) => (
              <tr key={r.id} className="table-row">
                <td className="px-4 py-3 font-medium flex items-center gap-2"><Bell size={14} className="text-yellow-500" />{r.title}</td>
                <td className="px-4 py-3 capitalize">{r.reminder_type}</td>
                <td className="table-cell">{r.due_date}</td>
                <td className="table-cell"><StatusBadge status={r.status} /></td>
                <td className="table-cell">{r.is_recurring ? `Every ${r.recurrence_interval} ${r.recurrence_unit}` : "No"}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => { setEditing(r); setForm({ vehicle_id: r.vehicle_id || undefined, reminder_type: r.reminder_type, title: r.title, description: r.description || "", due_date: r.due_date, status: r.status, is_recurring: r.is_recurring, recurrence_interval: r.recurrence_interval || undefined, recurrence_unit: r.recurrence_unit || undefined }); setShowForm(true); }} className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"><Pencil size={16} /></button>
                  <button onClick={() => { if (confirm("Delete?")) api.reminders.remove(r.id).then(load); }} className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500 py-12">No reminders</td></tr>}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="modal-overlay">
          <form onSubmit={handleSubmit} className="modal-content max-w-lg">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editing ? "Edit Reminder" : "Add Reminder"}</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="label-text">Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required /></div>
              <div><label className="label-text">Type</label><select value={form.reminder_type} onChange={(e) => setForm({ ...form, reminder_type: e.target.value })} className="input-field">{["service","renewal","inspection","insurance","license","other"].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div><label className="label-text">Due Date</label><input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className="input-field" required /></div>
              <div><label className="label-text">Vehicle (optional)</label><select value={form.vehicle_id || ""} onChange={(e) => setForm({ ...form, vehicle_id: e.target.value ? Number(e.target.value) : undefined })} className="input-field"><option value="">None</option>{vehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model}</option>)}</select></div>
              <div><label className="label-text">Status</label><select value={form.status || "pending"} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">{["pending","completed","overdue"].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div className="flex items-end pb-1"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_recurring || false} onChange={(e) => setForm({ ...form, is_recurring: e.target.checked })} /> Recurring</label></div>
              {form.is_recurring && <>
                <div><label className="label-text">Interval</label><input type="number" value={form.recurrence_interval || ""} onChange={(e) => setForm({ ...form, recurrence_interval: Number(e.target.value) })} className="input-field" /></div>
                <div><label className="label-text">Unit</label><select value={form.recurrence_unit || "days"} onChange={(e) => setForm({ ...form, recurrence_unit: e.target.value })} className="input-field">{["days","weeks","months","years"].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              </>}
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

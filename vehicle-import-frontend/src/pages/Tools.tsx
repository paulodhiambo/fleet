import { useEffect, useState } from "react";
import { api, Tool, ToolCreate } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import { Plus, Pencil, Trash2 } from "lucide-react";

const emptyForm: ToolCreate = { name: "", status: "available" };

export default function Tools() {
  const [items, setItems] = useState<Tool[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Tool | null>(null);
  const [form, setForm] = useState<ToolCreate>({ ...emptyForm });

  const load = () => api.tools.list().then(setItems);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) await api.tools.update(editing.id, form);
    else await api.tools.create(form);
    setShowForm(false); setEditing(null); setForm({ ...emptyForm }); load();
  };

  const handleEdit = (t: Tool) => {
    setEditing(t);
    setForm({ name: t.name, tool_type: t.tool_type || "", serial_number: t.serial_number || "", manufacturer: t.manufacturer || "", assigned_to: t.assigned_to || "", location: t.location || "", status: t.status, notes: t.notes || "" });
    setShowForm(true);
  };

  const F = (field: keyof ToolCreate, label: string, type = "text") => (
    <div>
      <label className="label-text">{label}</label>
      <input type={type} value={(form[field] as string | number) ?? ""} onChange={(e) => setForm({ ...form, [field]: type === "number" ? Number(e.target.value) : e.target.value })} className="input-field" />
    </div>
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div />
        <button onClick={() => { setEditing(null); setForm({ ...emptyForm }); setShowForm(true); }} className="btn-primary"><Plus size={16} /> Add Tool</button>
      </div>
      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead className="table-header"><tr>
            <th>Name</th><th>Type</th><th>Serial #</th><th>Assigned To</th><th>Location</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((t) => (
              <tr key={t.id} className="table-row">
                <td className="table-cell font-medium text-gray-900 dark:text-white">{t.name}</td>
                <td className="table-cell">{t.tool_type || "—"}</td>
                <td className="table-cell font-mono text-xs">{t.serial_number || "—"}</td>
                <td className="table-cell">{t.assigned_to || "—"}</td>
                <td className="table-cell">{t.location || "—"}</td>
                <td className="table-cell"><StatusBadge status={t.status} /></td>
                <td className="table-cell">
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(t)} className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"><Pencil size={15} /></button>
                    <button onClick={() => { if (confirm("Delete?")) api.tools.remove(t.id).then(load); }} className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={7} className="table-cell text-center text-gray-400 dark:text-gray-500 py-12">No tools found</td></tr>}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="modal-overlay">
          <form onSubmit={handleSubmit} className="modal-content max-w-lg">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editing ? "Edit Tool" : "Add Tool"}</h2>
            <div className="grid grid-cols-2 gap-3">
              {F("name", "Name")}{F("tool_type", "Type")}{F("serial_number", "Serial #")}{F("manufacturer", "Manufacturer")}
              {F("assigned_to", "Assigned To")}{F("location", "Location")}
              {F("purchase_date", "Purchase Date", "date")}{F("purchase_cost", "Purchase Cost", "number")}
              {F("last_service_date", "Last Service", "date")}{F("next_service_date", "Next Service", "date")}
              <div>
                <label className="label-text">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                  {["available", "in-use", "maintenance", "retired"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-3"><label className="label-text">Notes</label><textarea value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" rows={2} /></div>
            <div className="flex justify-end gap-3 mt-5">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">{editing ? "Update" : "Create"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { api, DocRecord, DocCreate, Vehicle } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";

export default function Documents() {
  const [items, setItems] = useState<DocRecord[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DocRecord | null>(null);
  const [form, setForm] = useState<DocCreate>({ title: "", document_type: "registration" });

  const load = () => { api.documents.list().then(setItems); api.vehicles.list().then(setVehicles); };
  useEffect(() => { load(); }, []);

  const vName = (id: number | null) => { if (!id) return "—"; const v = vehicles.find(x => x.id === id); return v ? `${v.make} ${v.model}` : `#${id}`; };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) await api.documents.update(editing.id, form);
    else await api.documents.create(form);
    setShowForm(false); setEditing(null); load();
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="page-header">Documents</h1>
        <button onClick={() => { setEditing(null); setForm({ title: "", document_type: "registration", status: "active" }); setShowForm(true); }} className="btn-primary"><Plus size={16} /> Add Document</button>
      </div>
      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead className="table-header"><tr>
            <th>Title</th>
            <th>Type</th>
            <th>Vehicle</th>
            <th>File</th>
            <th>Expiry</th>
            <th>Status</th>
            <th>Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((d) => (
              <tr key={d.id} className="table-row">
                <td className="px-4 py-3 font-medium flex items-center gap-2"><FileText size={16} className="text-gray-400" />{d.title}</td>
                <td className="px-4 py-3 capitalize">{d.document_type}</td>
                <td className="table-cell">{vName(d.vehicle_id)}</td>
                <td className="table-cell">{d.file_name || "—"}</td>
                <td className="table-cell">{d.expiry_date || "—"}</td>
                <td className="table-cell"><StatusBadge status={d.status} /></td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => { setEditing(d); setForm({ vehicle_id: d.vehicle_id || undefined, title: d.title, document_type: d.document_type, file_name: d.file_name || "", file_url: d.file_url || "", expiry_date: d.expiry_date || "", status: d.status, notes: d.notes || "" }); setShowForm(true); }} className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"><Pencil size={16} /></button>
                  <button onClick={() => { if (confirm("Delete?")) api.documents.remove(d.id).then(load); }} className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500 py-12">No documents found</td></tr>}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="modal-overlay">
          <form onSubmit={handleSubmit} className="modal-content max-w-lg">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editing ? "Edit Document" : "Add Document"}</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="label-text">Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required /></div>
              <div><label className="label-text">Type</label><select value={form.document_type} onChange={(e) => setForm({ ...form, document_type: e.target.value })} className="input-field">{["registration","insurance","inspection","license","import_permit","customs","title","warranty","invoice","other"].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div><label className="label-text">Vehicle (optional)</label><select value={form.vehicle_id || ""} onChange={(e) => setForm({ ...form, vehicle_id: e.target.value ? Number(e.target.value) : undefined })} className="input-field"><option value="">None</option>{vehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model}</option>)}</select></div>
              <div><label className="label-text">File Name</label><input value={form.file_name || ""} onChange={(e) => setForm({ ...form, file_name: e.target.value })} className="input-field" /></div>
              <div><label className="label-text">File URL</label><input value={form.file_url || ""} onChange={(e) => setForm({ ...form, file_url: e.target.value })} className="input-field" /></div>
              <div><label className="label-text">Expiry Date</label><input type="date" value={form.expiry_date || ""} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} className="input-field" /></div>
              <div><label className="label-text">Status</label><select value={form.status || "active"} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">{["active","expired","archived"].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div className="col-span-2"><label className="label-text">Notes</label><textarea value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" rows={2} /></div>
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

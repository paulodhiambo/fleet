import { useEffect, useState } from "react";
import { api, Part, PartCreate } from "../services/api";
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";

export default function Parts() {
  const [items, setItems] = useState<Part[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Part | null>(null);
  const [form, setForm] = useState<PartCreate>({ name: "" });

  const load = () => api.parts.list().then(setItems);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) await api.parts.update(editing.id, form);
    else await api.parts.create(form);
    setShowForm(false); setEditing(null); load();
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="page-header">Parts Inventory</h1>
        <button onClick={() => { setEditing(null); setForm({ name: "", quantity_in_stock: 0, minimum_stock: 0 }); setShowForm(true); }} className="btn-primary"><Plus size={16} /> Add Part</button>
      </div>
      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead className="table-header"><tr>
            <th>Name</th>
            <th>Part #</th>
            <th>Category</th>
            <th>Manufacturer</th>
            <th>In Stock</th>
            <th>Min Stock</th>
            <th>Unit Cost</th>
            <th>Location</th>
            <th>Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((p) => (
              <tr key={p.id} className={`hover:bg-gray-50 ${p.quantity_in_stock <= p.minimum_stock ? "bg-red-50" : ""}`}>
                <td className="table-cell font-medium text-gray-900 dark:text-white">{p.name}</td>
                <td className="px-4 py-3 font-mono text-xs">{p.part_number || "—"}</td>
                <td className="table-cell">{p.category || "—"}</td>
                <td className="table-cell">{p.manufacturer || "—"}</td>
                <td className="table-cell">
                  <span className="flex items-center gap-1">
                    {p.quantity_in_stock}
                    {p.quantity_in_stock <= p.minimum_stock && <AlertTriangle size={14} className="text-red-500" />}
                  </span>
                </td>
                <td className="table-cell">{p.minimum_stock}</td>
                <td className="table-cell">{p.unit_cost ? `$${p.unit_cost.toFixed(2)}` : "—"}</td>
                <td className="table-cell">{p.location || "—"}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => { setEditing(p); setForm({ name: p.name, part_number: p.part_number || "", category: p.category || "", manufacturer: p.manufacturer || "", quantity_in_stock: p.quantity_in_stock, minimum_stock: p.minimum_stock, unit_cost: p.unit_cost || undefined, location: p.location || "", compatible_vehicles: p.compatible_vehicles || "", notes: p.notes || "" }); setShowForm(true); }} className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"><Pencil size={16} /></button>
                  <button onClick={() => { if (confirm("Delete?")) api.parts.remove(p.id).then(load); }} className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500 py-12">No parts found</td></tr>}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="modal-overlay">
          <form onSubmit={handleSubmit} className="modal-content max-w-lg">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editing ? "Edit Part" : "Add Part"}</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label-text">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required /></div>
              <div><label className="label-text">Part #</label><input value={form.part_number || ""} onChange={(e) => setForm({ ...form, part_number: e.target.value })} className="input-field" /></div>
              <div><label className="label-text">Category</label><input value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field" /></div>
              <div><label className="label-text">Manufacturer</label><input value={form.manufacturer || ""} onChange={(e) => setForm({ ...form, manufacturer: e.target.value })} className="input-field" /></div>
              <div><label className="label-text">Qty In Stock</label><input type="number" value={form.quantity_in_stock ?? 0} onChange={(e) => setForm({ ...form, quantity_in_stock: Number(e.target.value) })} className="input-field" /></div>
              <div><label className="label-text">Min Stock</label><input type="number" value={form.minimum_stock ?? 0} onChange={(e) => setForm({ ...form, minimum_stock: Number(e.target.value) })} className="input-field" /></div>
              <div><label className="label-text">Unit Cost</label><input type="number" step="0.01" value={form.unit_cost || ""} onChange={(e) => setForm({ ...form, unit_cost: Number(e.target.value) })} className="input-field" /></div>
              <div><label className="label-text">Location</label><input value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" /></div>
              <div className="col-span-2"><label className="label-text">Compatible Vehicles</label><input value={form.compatible_vehicles || ""} onChange={(e) => setForm({ ...form, compatible_vehicles: e.target.value })} className="input-field" placeholder="e.g. Toyota Hilux, Ford Ranger" /></div>
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

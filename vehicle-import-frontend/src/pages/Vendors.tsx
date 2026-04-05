import { useEffect, useState } from "react";
import { api, Vendor, VendorCreate } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import { Plus, Globe, Mail, Phone } from "lucide-react";

export default function Vendors() {
  const [items, setItems] = useState<Vendor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Vendor | null>(null);
  const [form, setForm] = useState<VendorCreate>({ name: "" });

  const load = () => api.vendors.list().then(setItems);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) await api.vendors.update(editing.id, form);
    else await api.vendors.create(form);
    setShowForm(false); setEditing(null); load();
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="page-header">Vendors</h1>
        <button onClick={() => { setEditing(null); setForm({ name: "", status: "active" }); setShowForm(true); }} className="btn-primary"><Plus size={16} /> Add Vendor</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((v) => (
          <div key={v.id} className="card p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{v.name}</h3>
                {v.vendor_type && <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{v.vendor_type}</p>}
                {v.city && <p className="text-sm text-gray-600 dark:text-gray-400">{v.city}{v.country ? `, ${v.country}` : ""}</p>}
              </div>
              <StatusBadge status={v.status} />
            </div>
            <div className="mt-3 space-y-1">
              {v.email && <p className="text-sm flex items-center gap-2"><Mail size={14} className="text-gray-400" />{v.email}</p>}
              {v.phone && <p className="text-sm flex items-center gap-2"><Phone size={14} className="text-gray-400" />{v.phone}</p>}
              {v.website && <p className="text-sm flex items-center gap-2"><Globe size={14} className="text-gray-400" />{v.website}</p>}
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button onClick={() => { setEditing(v); setForm({ name: v.name, vendor_type: v.vendor_type || "", email: v.email || "", phone: v.phone || "", address: v.address || "", city: v.city || "", country: v.country || "", website: v.website || "", status: v.status, notes: v.notes || "" }); setShowForm(true); }} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">Edit</button>
              <button onClick={() => { if (confirm("Delete?")) api.vendors.remove(v.id).then(load); }} className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium">Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-gray-400 dark:text-gray-500 col-span-3 text-center py-8">No vendors found</p>}
      </div>
      {showForm && (
        <div className="modal-overlay">
          <form onSubmit={handleSubmit} className="modal-content max-w-lg">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editing ? "Edit Vendor" : "Add Vendor"}</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label-text">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required /></div>
              <div><label className="label-text">Type</label><select value={form.vendor_type || ""} onChange={(e) => setForm({ ...form, vendor_type: e.target.value })} className="input-field"><option value="">Select...</option>{["parts","service","fuel","insurance","shipping","other"].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div><label className="label-text">Email</label><input type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" /></div>
              <div><label className="label-text">Phone</label><input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" /></div>
              <div><label className="label-text">City</label><input value={form.city || ""} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" /></div>
              <div><label className="label-text">Country</label><input value={form.country || ""} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input-field" /></div>
              <div><label className="label-text">Website</label><input value={form.website || ""} onChange={(e) => setForm({ ...form, website: e.target.value })} className="input-field" /></div>
              <div><label className="label-text">Status</label><select value={form.status || "active"} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">{["active","inactive"].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div className="col-span-2"><label className="label-text">Address</label><input value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field" /></div>
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

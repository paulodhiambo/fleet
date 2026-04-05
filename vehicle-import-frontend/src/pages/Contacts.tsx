import { useEffect, useState } from "react";
import { api, Contact, ContactCreate } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import { Plus, Mail, Phone } from "lucide-react";

export default function Contacts() {
  const [items, setItems] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [form, setForm] = useState<ContactCreate>({ name: "", role: "operator" });

  const load = () => api.contacts.list().then(setItems);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) await api.contacts.update(editing.id, form);
    else await api.contacts.create(form);
    setShowForm(false); setEditing(null); load();
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="page-header">Contacts</h1>
        <button onClick={() => { setEditing(null); setForm({ name: "", role: "operator", status: "active" }); setShowForm(true); }} className="btn-primary"><Plus size={16} /> Add Contact</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((c) => (
          <div key={c.id} className="card p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{c.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{c.role}</p>
                {c.company && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{c.company}</p>}
              </div>
              <StatusBadge status={c.status} />
            </div>
            <div className="mt-3 space-y-1">
              {c.email && <p className="text-sm flex items-center gap-2"><Mail size={14} className="text-gray-400" />{c.email}</p>}
              {c.phone && <p className="text-sm flex items-center gap-2"><Phone size={14} className="text-gray-400" />{c.phone}</p>}
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button onClick={() => { setEditing(c); setForm({ name: c.name, role: c.role, email: c.email || "", phone: c.phone || "", company: c.company || "", address: c.address || "", status: c.status, notes: c.notes || "" }); setShowForm(true); }} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">Edit</button>
              <button onClick={() => { if (confirm("Delete?")) api.contacts.remove(c.id).then(load); }} className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium">Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-gray-400 dark:text-gray-500 col-span-3 text-center py-8">No contacts found</p>}
      </div>
      {showForm && (
        <div className="modal-overlay">
          <form onSubmit={handleSubmit} className="modal-content max-w-lg">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editing ? "Edit Contact" : "Add Contact"}</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label-text">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required /></div>
              <div><label className="label-text">Role</label><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input-field">{["fleet_manager","technician","operator","driver","admin","other"].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div><label className="label-text">Email</label><input type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" /></div>
              <div><label className="label-text">Phone</label><input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" /></div>
              <div><label className="label-text">Company</label><input value={form.company || ""} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input-field" /></div>
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

import { useEffect, useState } from "react";
import { api, Place, PlaceCreate } from "../services/api";
import { Plus, MapPin } from "lucide-react";

export default function Places() {
  const [items, setItems] = useState<Place[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Place | null>(null);
  const [form, setForm] = useState<PlaceCreate>({ name: "" });

  const load = () => api.places.list().then(setItems);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) await api.places.update(editing.id, form);
    else await api.places.create(form);
    setShowForm(false); setEditing(null); load();
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="page-header">Places</h1>
        <button onClick={() => { setEditing(null); setForm({ name: "" }); setShowForm(true); }} className="btn-primary"><Plus size={16} /> Add Place</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((p) => (
          <div key={p.id} className="card p-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg"><MapPin size={20} className="text-blue-600" /></div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{p.name}</h3>
                {p.place_type && <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{p.place_type}</p>}
                {p.address && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{p.address}</p>}
                {p.city && <p className="text-sm text-gray-600 dark:text-gray-400">{p.city}{p.country ? `, ${p.country}` : ""}</p>}
                {p.contact_name && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Contact: {p.contact_name}{p.contact_phone ? ` (${p.contact_phone})` : ""}</p>}
              </div>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button onClick={() => { setEditing(p); setForm({ name: p.name, place_type: p.place_type || "", address: p.address || "", city: p.city || "", country: p.country || "", latitude: p.latitude || undefined, longitude: p.longitude || undefined, contact_name: p.contact_name || "", contact_phone: p.contact_phone || "", notes: p.notes || "" }); setShowForm(true); }} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">Edit</button>
              <button onClick={() => { if (confirm("Delete?")) api.places.remove(p.id).then(load); }} className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium">Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-gray-400 dark:text-gray-500 col-span-3 text-center py-8">No places found</p>}
      </div>
      {showForm && (
        <div className="modal-overlay">
          <form onSubmit={handleSubmit} className="modal-content max-w-lg">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editing ? "Edit Place" : "Add Place"}</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label-text">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required /></div>
              <div><label className="label-text">Type</label><select value={form.place_type || ""} onChange={(e) => setForm({ ...form, place_type: e.target.value })} className="input-field"><option value="">Select...</option>{["depot","warehouse","port","workshop","office","yard","other"].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div className="col-span-2"><label className="label-text">Address</label><input value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field" /></div>
              <div><label className="label-text">City</label><input value={form.city || ""} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" /></div>
              <div><label className="label-text">Country</label><input value={form.country || ""} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input-field" /></div>
              <div><label className="label-text">Latitude</label><input type="number" step="any" value={form.latitude || ""} onChange={(e) => setForm({ ...form, latitude: Number(e.target.value) })} className="input-field" /></div>
              <div><label className="label-text">Longitude</label><input type="number" step="any" value={form.longitude || ""} onChange={(e) => setForm({ ...form, longitude: Number(e.target.value) })} className="input-field" /></div>
              <div><label className="label-text">Contact Name</label><input value={form.contact_name || ""} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} className="input-field" /></div>
              <div><label className="label-text">Contact Phone</label><input value={form.contact_phone || ""} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} className="input-field" /></div>
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

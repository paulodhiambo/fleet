import { useEffect, useState } from "react";
import { api, PreInspection, PreInspectionCreate, Vehicle } from "../services/api";
import { Plus, Trash2, Star } from "lucide-react";

export default function PreInspections() {
  const [items, setItems] = useState<PreInspection[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<PreInspectionCreate>({ vehicle_id: 0, inspection_date: "", inspector_name: "", engine_condition: 3, body_condition: 3, tire_condition: 3, electrical_condition: 3, emissions_passed: false, overall_rating: 3, passed: false });

  const load = () => { api.preInspections.list().then(setItems); api.vehicles.list().then(setVehicles); };
  useEffect(() => { load(); }, []);

  const vName = (id: number) => { const v = vehicles.find(x => x.id === id); return v ? `${v.make} ${v.model} (${v.vin})` : `#${id}`; };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.preInspections.create(form);
    setShowForm(false); load();
  };

  const stars = (n: number) => Array.from({ length: 5 }, (_, i) => <Star key={i} size={14} className={i < n ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="page-header">Pre-Import Inspections</h1>
        <button onClick={() => { setForm({ vehicle_id: vehicles[0]?.id || 0, inspection_date: new Date().toISOString().slice(0, 10), inspector_name: "", engine_condition: 3, body_condition: 3, tire_condition: 3, electrical_condition: 3, emissions_passed: false, overall_rating: 3, passed: false }); setShowForm(true); }} className="btn-primary"><Plus size={16} /> New Inspection</button>
      </div>
      <div className="space-y-4">
        {items.map((i) => (
          <div key={i.id} className="card p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{vName(i.vehicle_id)}</h3>
                <p className="text-sm text-gray-500">Inspector: {i.inspector_name} | Date: {i.inspection_date}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${i.passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{i.passed ? "PASSED" : "FAILED"}</span>
                <button onClick={() => { if (confirm("Delete?")) api.preInspections.remove(i.id).then(load); }} className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3">
              <div><p className="text-xs text-gray-500">Engine</p><div className="flex">{stars(i.engine_condition)}</div></div>
              <div><p className="text-xs text-gray-500">Body</p><div className="flex">{stars(i.body_condition)}</div></div>
              <div><p className="text-xs text-gray-500">Tires</p><div className="flex">{stars(i.tire_condition)}</div></div>
              <div><p className="text-xs text-gray-500">Electrical</p><div className="flex">{stars(i.electrical_condition)}</div></div>
              <div><p className="text-xs text-gray-500">Overall</p><div className="flex">{stars(i.overall_rating)}</div></div>
            </div>
            <div className="mt-2 flex items-center gap-4 text-sm">
              <span className={i.emissions_passed ? "text-green-600" : "text-red-600"}>Emissions: {i.emissions_passed ? "Passed" : "Failed"}</span>
              {i.notes && <span className="text-gray-500">| {i.notes}</span>}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-gray-400 text-center py-8">No pre-import inspections</p>}
      </div>
      {showForm && (
        <div className="modal-overlay">
          <form onSubmit={handleSubmit} className="modal-content max-w-lg">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">New Pre-Import Inspection</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label-text">Vehicle</label><select value={form.vehicle_id} onChange={(e) => setForm({ ...form, vehicle_id: Number(e.target.value) })} className="input-field">{vehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model}</option>)}</select></div>
              <div><label className="label-text">Date</label><input type="date" value={form.inspection_date} onChange={(e) => setForm({ ...form, inspection_date: e.target.value })} className="input-field" required /></div>
              <div className="col-span-2"><label className="label-text">Inspector</label><input value={form.inspector_name} onChange={(e) => setForm({ ...form, inspector_name: e.target.value })} className="input-field" required /></div>
              {(["engine_condition", "body_condition", "tire_condition", "electrical_condition", "overall_rating"] as const).map(f => (
                <div key={f}><label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{f.replace("_", " ")}</label><select value={form[f]} onChange={(e) => setForm({ ...form, [f]: Number(e.target.value) })} className="input-field">{[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
              ))}
              <div className="flex items-end pb-1"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.emissions_passed} onChange={(e) => setForm({ ...form, emissions_passed: e.target.checked })} /> Emissions Passed</label></div>
              <div className="flex items-end pb-1"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.passed} onChange={(e) => setForm({ ...form, passed: e.target.checked })} /> Overall Passed</label></div>
              <div className="col-span-2"><label className="label-text">Notes</label><textarea value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" rows={2} /></div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Create</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

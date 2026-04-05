import { useEffect, useState } from "react";
import { api, PostInspection, PostInspectionCreate, Vehicle } from "../services/api";
import { Plus, Trash2, CheckCircle, XCircle } from "lucide-react";

export default function PostInspections() {
  const [items, setItems] = useState<PostInspection[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<PostInspectionCreate>({ vehicle_id: 0, inspection_date: "", inspector_name: "", customs_clearance_passed: false, documentation_complete: false, safety_inspection_passed: false, roadworthiness_passed: false, compliance_passed: false, overall_rating: 3, passed: false });

  const load = () => { api.postInspections.list().then(setItems); api.vehicles.list().then(setVehicles); };
  useEffect(() => { load(); }, []);

  const vName = (id: number) => { const v = vehicles.find(x => x.id === id); return v ? `${v.make} ${v.model} (${v.vin})` : `#${id}`; };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.postInspections.create(form);
    setShowForm(false); load();
  };

  const checkIcon = (v: boolean) => v ? <CheckCircle size={16} className="text-green-600" /> : <XCircle size={16} className="text-red-600" />;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="page-header">Post-Import Inspections</h1>
        <button onClick={() => { setForm({ vehicle_id: vehicles[0]?.id || 0, inspection_date: new Date().toISOString().slice(0, 10), inspector_name: "", customs_clearance_passed: false, documentation_complete: false, safety_inspection_passed: false, roadworthiness_passed: false, compliance_passed: false, overall_rating: 3, passed: false }); setShowForm(true); }} className="btn-primary"><Plus size={16} /> New Inspection</button>
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
                <button onClick={() => { if (confirm("Delete?")) api.postInspections.remove(i.id).then(load); }} className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3">
              <div className="flex items-center gap-2">{checkIcon(i.customs_clearance_passed)}<span className="text-sm">Customs</span></div>
              <div className="flex items-center gap-2">{checkIcon(i.documentation_complete)}<span className="text-sm">Documentation</span></div>
              <div className="flex items-center gap-2">{checkIcon(i.safety_inspection_passed)}<span className="text-sm">Safety</span></div>
              <div className="flex items-center gap-2">{checkIcon(i.roadworthiness_passed)}<span className="text-sm">Roadworthiness</span></div>
              <div className="flex items-center gap-2">{checkIcon(i.compliance_passed)}<span className="text-sm">Compliance</span></div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Overall Rating: {i.overall_rating}/5
              {i.notes && <span className="ml-2">| {i.notes}</span>}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-gray-400 text-center py-8">No post-import inspections</p>}
      </div>
      {showForm && (
        <div className="modal-overlay">
          <form onSubmit={handleSubmit} className="modal-content max-w-lg">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">New Post-Import Inspection</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label-text">Vehicle</label><select value={form.vehicle_id} onChange={(e) => setForm({ ...form, vehicle_id: Number(e.target.value) })} className="input-field">{vehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model}</option>)}</select></div>
              <div><label className="label-text">Date</label><input type="date" value={form.inspection_date} onChange={(e) => setForm({ ...form, inspection_date: e.target.value })} className="input-field" required /></div>
              <div className="col-span-2"><label className="label-text">Inspector</label><input value={form.inspector_name} onChange={(e) => setForm({ ...form, inspector_name: e.target.value })} className="input-field" required /></div>
              {([["customs_clearance_passed", "Customs Clearance"], ["documentation_complete", "Documentation Complete"], ["safety_inspection_passed", "Safety Inspection"], ["roadworthiness_passed", "Roadworthiness"], ["compliance_passed", "Compliance"]] as const).map(([f, label]) => (
                <div key={f} className="flex items-center"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.checked })} /> {label}</label></div>
              ))}
              <div><label className="label-text">Overall Rating</label><select value={form.overall_rating} onChange={(e) => setForm({ ...form, overall_rating: Number(e.target.value) })} className="input-field">{[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
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

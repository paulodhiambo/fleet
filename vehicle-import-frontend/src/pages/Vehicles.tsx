import { useEffect, useState } from "react";
import { api, Vehicle, VehicleCreate } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

const emptyForm: VehicleCreate = {
  vin: "", make: "", model: "", year: 2024, origin_country: "",
  destination_country: "Kenya", status: "pending",
};

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [form, setForm] = useState<VehicleCreate>({ ...emptyForm });

  const load = () => {
    const params: Record<string, string> = {};
    if (search) params.make = search;
    if (filterStatus) params.status = filterStatus;
    api.vehicles.list(params).then(setVehicles);
  };

  useEffect(() => { load(); }, [search, filterStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await api.vehicles.update(editing.id, form);
    } else {
      await api.vehicles.create(form);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ ...emptyForm });
    load();
  };

  const handleEdit = (v: Vehicle) => {
    setEditing(v);
    setForm({
      vin: v.vin, make: v.make, model: v.model, year: v.year,
      color: v.color || "", license_plate: v.license_plate || "",
      engine_type: v.engine_type || "", fuel_type: v.fuel_type || "",
      transmission: v.transmission || "", mileage: v.mileage || 0,
      origin_country: v.origin_country, destination_country: v.destination_country,
      purchase_price: v.purchase_price || 0, purchase_date: v.purchase_date || "",
      owner_name: v.owner_name || "", owner_contact: v.owner_contact || "",
      assigned_to: v.assigned_to || "", group: v.group || "",
      status: v.status, notes: v.notes || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this vehicle?")) {
      await api.vehicles.remove(id);
      load();
    }
  };

  const F = (field: keyof VehicleCreate, label: string, type = "text") => (
    <div>
      <label className="label-text">{label}</label>
      <input type={type} value={(form[field] as string | number) ?? ""} onChange={(e) => setForm({ ...form, [field]: type === "number" ? Number(e.target.value) : e.target.value })} className="input-field" />
    </div>
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div />
        <button onClick={() => { setEditing(null); setForm({ ...emptyForm }); setShowForm(true); }} className="btn-primary"><Plus size={16} /> Add Vehicle</button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
          <input placeholder="Search by make..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field w-auto">
          <option value="">All Status</option>
          {["pending","pre-inspection","in-transit","post-inspection","cleared","rejected"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead className="table-header">
            <tr>
              <th>VIN</th><th>Vehicle</th><th>Year</th><th>Origin</th><th>Mileage</th><th>Status</th><th>Assigned To</th><th>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {vehicles.map((v) => (
              <tr key={v.id} className="table-row">
                <td className="table-cell font-mono text-xs">{v.vin}</td>
                <td className="table-cell font-medium text-gray-900 dark:text-white">{v.make} {v.model}</td>
                <td className="table-cell">{v.year}</td>
                <td className="table-cell">{v.origin_country}</td>
                <td className="table-cell">{v.mileage?.toLocaleString() ?? "—"}</td>
                <td className="table-cell"><StatusBadge status={v.status} /></td>
                <td className="table-cell">{v.assigned_to || "—"}</td>
                <td className="table-cell">
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(v)} className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(v.id)} className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && <tr><td colSpan={8} className="table-cell text-center text-gray-400 dark:text-gray-500 py-12">No vehicles found</td></tr>}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <form onSubmit={handleSubmit} className="modal-content max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editing ? "Edit Vehicle" : "Add Vehicle"}</h2>
            <div className="grid grid-cols-2 gap-3">
              {F("vin", "VIN")}{F("make", "Make")}{F("model", "Model")}{F("year", "Year", "number")}
              {F("color", "Color")}{F("license_plate", "License Plate")}
              {F("engine_type", "Engine Type")}{F("fuel_type", "Fuel Type")}
              {F("transmission", "Transmission")}{F("mileage", "Mileage", "number")}
              {F("origin_country", "Origin Country")}{F("destination_country", "Destination Country")}
              {F("purchase_price", "Purchase Price", "number")}{F("purchase_date", "Purchase Date", "date")}
              {F("owner_name", "Owner Name")}{F("owner_contact", "Owner Contact")}
              {F("assigned_to", "Assigned To")}{F("group", "Group")}
              <div>
                <label className="label-text">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                  {["pending","pre-inspection","in-transit","post-inspection","cleared","rejected"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="label-text">Notes</label>
                <textarea value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" rows={2} />
              </div>
            </div>
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

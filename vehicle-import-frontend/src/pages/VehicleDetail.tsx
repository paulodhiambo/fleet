import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, Vehicle } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import { ArrowLeft, Pencil, Trash2, Car, MapPin, User, Calendar, DollarSign, FileText, Gauge, Settings } from "lucide-react";

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.vehicles.get(Number(id)).then((v) => {
        setVehicle(v);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    }
  }, [id]);

  const handleDelete = async () => {
    if (vehicle && confirm("Delete this vehicle?")) {
      await api.vehicles.remove(vehicle.id);
      navigate("/vehicles");
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="p-6">
        <div className="card p-12 text-center">
          <Car size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Vehicle Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">The vehicle you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate("/vehicles")} className="btn-primary mx-auto">
            <ArrowLeft size={16} /> Back to Vehicles
          </button>
        </div>
      </div>
    );
  }

  const InfoItem = ({ icon: Icon, label, value }: { icon: typeof Car; label: string; value: string | number | null | undefined }) => (
    <div className="flex items-start gap-3 py-3">
      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mt-0.5">
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{value || "—"}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/vehicles")} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {vehicle.make} {vehicle.model}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">VIN: {vehicle.vin}</p>
        </div>
        <StatusBadge status={vehicle.status} />
        <button onClick={() => navigate(`/vehicles?edit=${vehicle.id}`)} className="btn-secondary">
          <Pencil size={15} /> Edit
        </button>
        <button onClick={handleDelete} className="p-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
          <Trash2 size={18} />
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle Information */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Car size={20} className="text-blue-600 dark:text-blue-400" />
            Vehicle Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 divide-y sm:divide-y-0 divide-gray-100 dark:divide-gray-800">
            <div className="space-y-1 divide-y divide-gray-100 dark:divide-gray-800">
              <InfoItem icon={Car} label="Make" value={vehicle.make} />
              <InfoItem icon={Car} label="Model" value={vehicle.model} />
              <InfoItem icon={Calendar} label="Year" value={vehicle.year} />
              <InfoItem icon={FileText} label="VIN" value={vehicle.vin} />
              <InfoItem icon={Car} label="Color" value={vehicle.color} />
              <InfoItem icon={FileText} label="License Plate" value={vehicle.license_plate} />
            </div>
            <div className="space-y-1 divide-y divide-gray-100 dark:divide-gray-800">
              <InfoItem icon={Settings} label="Engine Type" value={vehicle.engine_type} />
              <InfoItem icon={Settings} label="Fuel Type" value={vehicle.fuel_type} />
              <InfoItem icon={Settings} label="Transmission" value={vehicle.transmission} />
              <InfoItem icon={Gauge} label="Mileage" value={vehicle.mileage?.toLocaleString()} />
              <InfoItem icon={FileText} label="Group" value={vehicle.group} />
              <InfoItem icon={FileText} label="Status" value={vehicle.status} />
            </div>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Origin & Destination */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-purple-600 dark:text-purple-400" />
              Origin & Destination
            </h2>
            <div className="space-y-1 divide-y divide-gray-100 dark:divide-gray-800">
              <InfoItem icon={MapPin} label="Origin Country" value={vehicle.origin_country} />
              <InfoItem icon={MapPin} label="Destination" value={vehicle.destination_country} />
            </div>
          </div>

          {/* Owner & Assignment */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User size={20} className="text-emerald-600 dark:text-emerald-400" />
              Owner & Assignment
            </h2>
            <div className="space-y-1 divide-y divide-gray-100 dark:divide-gray-800">
              <InfoItem icon={User} label="Owner Name" value={vehicle.owner_name} />
              <InfoItem icon={User} label="Owner Contact" value={vehicle.owner_contact} />
              <InfoItem icon={User} label="Assigned To" value={vehicle.assigned_to} />
            </div>
          </div>

          {/* Purchase Info */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-amber-600 dark:text-amber-400" />
              Purchase Details
            </h2>
            <div className="space-y-1 divide-y divide-gray-100 dark:divide-gray-800">
              <InfoItem icon={DollarSign} label="Purchase Price" value={vehicle.purchase_price ? `$${vehicle.purchase_price.toLocaleString()}` : null} />
              <InfoItem icon={Calendar} label="Purchase Date" value={vehicle.purchase_date} />
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {vehicle.notes && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <FileText size={20} className="text-gray-600 dark:text-gray-400" />
            Notes
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{vehicle.notes}</p>
        </div>
      )}

      {/* Timestamps */}
      <div className="flex gap-6 text-xs text-gray-400 dark:text-gray-500">
        <span>Created: {new Date(vehicle.created_at).toLocaleDateString()}</span>
        <span>Updated: {new Date(vehicle.updated_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

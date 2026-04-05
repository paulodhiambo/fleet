import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, Vehicle, PreInspection, PostInspection, ServiceEntry, Issue, DocRecord } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import { ArrowLeft, Pencil, Trash2, Car, MapPin, User, Calendar, DollarSign, FileText, Gauge, Settings, ClipboardCheck, Shield, Wrench, CheckCircle, XCircle, AlertTriangle, FolderOpen, ExternalLink } from "lucide-react";

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [preInspections, setPreInspections] = useState<PreInspection[]>([]);
  const [postInspections, setPostInspections] = useState<PostInspection[]>([]);
  const [services, setServices] = useState<ServiceEntry[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [documents, setDocuments] = useState<DocRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const vehicleId = Number(id);
      Promise.all([
        api.vehicles.get(vehicleId),
        api.preInspections.list({ vehicle_id: String(vehicleId) }),
        api.postInspections.list({ vehicle_id: String(vehicleId) }),
        api.services.list({ vehicle_id: String(vehicleId) }),
        api.issues.list({ vehicle_id: String(vehicleId) }),
        api.documents.list({ vehicle_id: String(vehicleId) }),
      ]).then(([v, pre, post, svc, iss, docs]) => {
        setVehicle(v);
        setPreInspections(pre);
        setPostInspections(post);
        setServices(svc);
        setIssues(iss);
        setDocuments(docs);
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

      {/* Pre-Import Inspections */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <ClipboardCheck size={20} className="text-blue-600 dark:text-blue-400" />
          Pre-Import Inspections
          <span className="ml-auto text-sm font-normal text-gray-500 dark:text-gray-400">{preInspections.length} record{preInspections.length !== 1 ? "s" : ""}</span>
        </h2>
        {preInspections.length === 0 ? (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
            <ClipboardCheck size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No pre-import inspections recorded</p>
          </div>
        ) : (
          <div className="space-y-4">
            {preInspections.map((pi) => (
              <div key={pi.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{new Date(pi.inspection_date).toLocaleDateString()}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">by {pi.inspector_name}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${pi.passed ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                    {pi.passed ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {pi.passed ? "Passed" : "Failed"}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <ConditionBar label="Engine" value={pi.engine_condition} />
                  <ConditionBar label="Body" value={pi.body_condition} />
                  <ConditionBar label="Tires" value={pi.tire_condition} />
                  <ConditionBar label="Electrical" value={pi.electrical_condition} />
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Emissions</span>
                    <span className={`text-xs font-semibold ${pi.emissions_passed ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                      {pi.emissions_passed ? "Passed" : "Failed"}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Overall Rating:</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className={`w-5 h-1.5 rounded-full ${star <= pi.overall_rating ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"}`} />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{pi.overall_rating}/5</span>
                </div>
                {pi.notes && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{pi.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post-Import Inspections */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Shield size={20} className="text-indigo-600 dark:text-indigo-400" />
          Post-Import Inspections
          <span className="ml-auto text-sm font-normal text-gray-500 dark:text-gray-400">{postInspections.length} record{postInspections.length !== 1 ? "s" : ""}</span>
        </h2>
        {postInspections.length === 0 ? (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
            <Shield size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No post-import inspections recorded</p>
          </div>
        ) : (
          <div className="space-y-4">
            {postInspections.map((po) => (
              <div key={po.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{new Date(po.inspection_date).toLocaleDateString()}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">by {po.inspector_name}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${po.passed ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                    {po.passed ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {po.passed ? "Passed" : "Failed"}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <CheckItem label="Customs Clearance" passed={po.customs_clearance_passed} />
                  <CheckItem label="Documentation" passed={po.documentation_complete} />
                  <CheckItem label="Safety" passed={po.safety_inspection_passed} />
                  <CheckItem label="Roadworthiness" passed={po.roadworthiness_passed} />
                  <CheckItem label="Compliance" passed={po.compliance_passed} />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Overall Rating:</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className={`w-5 h-1.5 rounded-full ${star <= po.overall_rating ? "bg-indigo-500" : "bg-gray-200 dark:bg-gray-700"}`} />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{po.overall_rating}/5</span>
                </div>
                {po.notes && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{po.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Service History */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Wrench size={20} className="text-amber-600 dark:text-amber-400" />
          Service History
          <span className="ml-auto text-sm font-normal text-gray-500 dark:text-gray-400">{services.length} record{services.length !== 1 ? "s" : ""}</span>
        </h2>
        {services.length === 0 ? (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
            <Wrench size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No service records found</p>
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="table-header">
                <tr>
                  <th>Date</th><th>Type</th><th>Technician</th><th>Status</th><th>Priority</th><th>Labor</th><th>Parts</th><th>Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {services.map((svc) => (
                  <tr key={svc.id} className="table-row">
                    <td className="table-cell">{new Date(svc.service_date).toLocaleDateString()}</td>
                    <td className="table-cell font-medium text-gray-900 dark:text-white">{svc.service_type}</td>
                    <td className="table-cell">{svc.technician || "—"}</td>
                    <td className="table-cell"><StatusBadge status={svc.status} /></td>
                    <td className="table-cell"><StatusBadge status={svc.priority} /></td>
                    <td className="table-cell">{svc.labor_cost != null ? `$${svc.labor_cost.toLocaleString()}` : "—"}</td>
                    <td className="table-cell">{svc.parts_cost != null ? `$${svc.parts_cost.toLocaleString()}` : "—"}</td>
                    <td className="table-cell font-medium text-gray-900 dark:text-white">{svc.total_cost != null ? `$${svc.total_cost.toLocaleString()}` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {services.length > 0 && (
              <div className="flex justify-end p-4 border-t border-gray-100 dark:border-gray-800">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  Total Cost: ${services.reduce((sum, s) => sum + (s.total_cost || 0), 0).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Issues */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
          Issues
          <span className="ml-auto text-sm font-normal text-gray-500 dark:text-gray-400">{issues.length} record{issues.length !== 1 ? "s" : ""}</span>
        </h2>
        {issues.length === 0 ? (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
            <AlertTriangle size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No issues reported</p>
          </div>
        ) : (
          <div className="space-y-3">
            {issues.map((issue) => (
              <div key={issue.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{issue.title}</h3>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={issue.priority} />
                    <StatusBadge status={issue.status} />
                  </div>
                </div>
                {issue.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{issue.description}</p>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>Reported: {new Date(issue.reported_date).toLocaleDateString()}</span>
                  {issue.reported_by && <span>By: {issue.reported_by}</span>}
                  {issue.assigned_to && <span>Assigned: {issue.assigned_to}</span>}
                  {issue.due_date && <span>Due: {new Date(issue.due_date).toLocaleDateString()}</span>}
                  {issue.resolved_date && <span>Resolved: {new Date(issue.resolved_date).toLocaleDateString()}</span>}
                </div>
                {issue.notes && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">{issue.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Documents */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FolderOpen size={20} className="text-teal-600 dark:text-teal-400" />
          Documents
          <span className="ml-auto text-sm font-normal text-gray-500 dark:text-gray-400">{documents.length} record{documents.length !== 1 ? "s" : ""}</span>
        </h2>
        {documents.length === 0 ? (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
            <FolderOpen size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No documents attached</p>
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="table-header">
                <tr>
                  <th>Title</th><th>Type</th><th>File</th><th>Expiry</th><th>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {documents.map((doc) => (
                  <tr key={doc.id} className="table-row">
                    <td className="table-cell font-medium text-gray-900 dark:text-white">{doc.title}</td>
                    <td className="table-cell">{doc.document_type}</td>
                    <td className="table-cell">
                      {doc.file_url ? (
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline">
                          {doc.file_name || "View"}
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="text-gray-400">{doc.file_name || "—"}</span>
                      )}
                    </td>
                    <td className="table-cell">
                      {doc.expiry_date ? (
                        <span className={new Date(doc.expiry_date) < new Date() ? "text-red-600 dark:text-red-400 font-medium" : ""}>
                          {new Date(doc.expiry_date).toLocaleDateString()}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="table-cell"><StatusBadge status={doc.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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

function ConditionBar({ label, value }: { label: string; value: number }) {
  const colors = ["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-lime-500", "bg-emerald-500"];
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`w-4 h-1.5 rounded-full ${i <= value ? colors[value - 1] : "bg-gray-200 dark:bg-gray-700"}`} />
        ))}
      </div>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-0.5">{value}/5</span>
    </div>
  );
}

function CheckItem({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      {passed ? (
        <CheckCircle size={18} className="text-emerald-500" />
      ) : (
        <XCircle size={18} className="text-red-500" />
      )}
    </div>
  );
}

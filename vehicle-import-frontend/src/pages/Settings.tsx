import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Database, Bell, Shield, Globe, Plus, Pencil, Trash2, Check } from "lucide-react";
import { api } from "../services/api";

interface Permission {
  id: number;
  name: string;
  description: string | null;
  module: string;
}

interface Role {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  permissions: Permission[];
}

const ALL_PERMISSIONS = [
  { module: "vehicles", actions: ["view", "create", "edit", "delete"] },
  { module: "inspections", actions: ["view", "create", "edit", "delete"] },
  { module: "issues", actions: ["view", "create", "edit", "delete"] },
  { module: "services", actions: ["view", "create", "edit", "delete"] },
  { module: "contacts", actions: ["view", "create", "edit", "delete"] },
  { module: "vendors", actions: ["view", "create", "edit", "delete"] },
  { module: "parts", actions: ["view", "create", "edit", "delete"] },
  { module: "documents", actions: ["view", "create", "edit", "delete"] },
  { module: "reports", actions: ["view", "export"] },
  { module: "settings", actions: ["view", "manage"] },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleForm, setRoleForm] = useState({ name: "", description: "" });
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [expandedRole, setExpandedRole] = useState<number | null>(null);

  const loadRoles = () => {
    api.roles.list().then(setRoles);
    api.permissions.list().then(setPermissions);
  };
  useEffect(() => { if (activeTab === "roles") loadRoles(); }, [activeTab]);

  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRole) {
      await api.roles.update(editingRole.id, { ...roleForm, permission_ids: selectedPermissions });
    } else {
      await api.roles.create({ ...roleForm, permission_ids: selectedPermissions });
    }
    setShowRoleForm(false);
    setEditingRole(null);
    loadRoles();
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleForm({ name: role.name, description: role.description || "" });
    setSelectedPermissions(role.permissions.map(p => p.id));
    setShowRoleForm(true);
  };

  const handleDeleteRole = async (id: number) => {
    if (confirm("Delete this role?")) {
      await api.roles.remove(id);
      loadRoles();
    }
  };

  const togglePermission = (id: number) => {
    setSelectedPermissions(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const tabs = [
    { id: "general", label: "General" },
    { id: "notifications", label: "Notifications" },
    { id: "roles", label: "Roles & Permissions" },
    { id: "data", label: "Data" },
    { id: "integrations", label: "Integrations" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General tab */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <SettingsIcon size={18} className="text-white" />
              </div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">System Configuration</h2>
            </div>
            <div className="space-y-4">
              <div><label className="label-text">System Name</label><input defaultValue="FleetTrack" className="input-field" /></div>
              <div><label className="label-text">Timezone</label><select className="input-field"><option>UTC</option><option>Africa/Nairobi</option><option>America/New_York</option><option>Europe/London</option><option>Asia/Tokyo</option></select></div>
              <div><label className="label-text">Date Format</label><select className="input-field"><option>YYYY-MM-DD</option><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option></select></div>
              <div><label className="label-text">Currency</label><select className="input-field"><option>USD ($)</option><option>KES (KSh)</option><option>EUR</option><option>GBP</option></select></div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications tab */}
      {activeTab === "notifications" && (
        <div className="card p-6 max-w-xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Bell size={18} className="text-white" />
            </div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Notification Settings</h2>
          </div>
          <div className="space-y-3">
            {[
              "Email notifications for overdue reminders",
              "Alert when parts reach minimum stock",
              "Notify on inspection failures",
              "Service completion notifications",
              "Issue status change alerts",
              "Document expiry warnings",
            ].map((label) => (
              <label key={label} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Roles & Permissions tab */}
      {activeTab === "roles" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Shield size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Roles & Permissions</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage user roles and their access levels</p>
              </div>
            </div>
            <button onClick={() => { setEditingRole(null); setRoleForm({ name: "", description: "" }); setSelectedPermissions([]); setShowRoleForm(true); }} className="btn-primary">
              <Plus size={16} /> Add Role
            </button>
          </div>

          <div className="space-y-3">
            {roles.map(role => (
              <div key={role.id} className="card">
                <div className="p-5 flex items-center justify-between cursor-pointer" onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold ${role.is_active ? "bg-gradient-to-br from-blue-500 to-blue-600" : "bg-gray-400 dark:bg-gray-600"}`}>
                      {role.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{role.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{role.description || "No description"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-md font-semibold ring-1 ring-inset ${role.is_active ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-400/20" : "bg-gray-50 text-gray-600 ring-gray-500/20 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-400/20"}`}>
                      {role.is_active ? "Active" : "Inactive"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md font-medium">
                      {role.permissions.length} permissions
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); handleEditRole(role); }} className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"><Pencil size={15} /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteRole(role.id); }} className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </div>
                {expandedRole === role.id && role.permissions.length > 0 && (
                  <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Assigned Permissions</p>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map(p => (
                        <span key={p.id} className="inline-flex items-center gap-1.5 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2.5 py-1.5 rounded-md font-medium">
                          <Check size={12} /> {p.module}:{p.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {roles.length === 0 && (
              <div className="card p-12 text-center">
                <Shield size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No roles created yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Click "Add Role" to create your first role</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Data tab */}
      {activeTab === "data" && (
        <div className="card p-6 max-w-xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <Database size={18} className="text-white" />
            </div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Data Management</h2>
          </div>
          <div className="space-y-3">
            {[
              { title: "Export Data", desc: "Export all fleet data as CSV/JSON" },
              { title: "Import Data", desc: "Import data from CSV/JSON files" },
              { title: "Backup Database", desc: "Create a backup of the database" },
            ].map(item => (
              <button key={item.title} className="w-full text-left px-4 py-3.5 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <p className="font-medium text-sm text-gray-900 dark:text-white">{item.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Integrations tab */}
      {activeTab === "integrations" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
              <Globe size={18} className="text-white" />
            </div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Integrations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "GPS Tracking", desc: "Real-time vehicle location tracking", connected: false },
              { name: "Fuel Cards", desc: "Automatic fuel expense tracking", connected: false },
              { name: "Accounting Software", desc: "Sync expenses and invoices", connected: false },
              { name: "Telematics", desc: "Vehicle diagnostics and metrics", connected: false },
              { name: "Email Service", desc: "Send notifications and alerts", connected: true },
              { name: "SMS Gateway", desc: "Send SMS notifications", connected: false },
            ].map((i) => (
              <div key={i.name} className="card p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm text-gray-900 dark:text-white">{i.name}</h3>
                  <span className={`text-xs px-2.5 py-1 rounded-md font-semibold ring-1 ring-inset ${i.connected ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-400/20" : "bg-gray-50 text-gray-600 ring-gray-500/20 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-400/20"}`}>
                    {i.connected ? "Connected" : "Not Connected"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{i.desc}</p>
                <button className="mt-3 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">{i.connected ? "Configure" : "Connect"}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Role Form Modal */}
      {showRoleForm && (
        <div className="modal-overlay">
          <form onSubmit={handleRoleSubmit} className="modal-content max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editingRole ? "Edit Role" : "Create Role"}</h2>
            <div className="space-y-4">
              <div><label className="label-text">Role Name</label><input value={roleForm.name} onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })} className="input-field" required placeholder="e.g. Fleet Manager" /></div>
              <div><label className="label-text">Description</label><textarea value={roleForm.description} onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })} className="input-field" rows={2} placeholder="What can this role do?" /></div>

              <div>
                <label className="label-text">Permissions</label>
                <div className="mt-2 space-y-4 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  {ALL_PERMISSIONS.map(group => {
                    const groupPerms = permissions.filter(p => p.module === group.module);
                    return (
                      <div key={group.module}>
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">{group.module}</p>
                        <div className="flex flex-wrap gap-2">
                          {groupPerms.map(p => (
                            <label key={p.id} className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                              selectedPermissions.includes(p.id)
                                ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 ring-1 ring-blue-300 dark:ring-blue-600"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}>
                              <input type="checkbox" checked={selectedPermissions.includes(p.id)} onChange={() => togglePermission(p.id)} className="sr-only" />
                              {selectedPermissions.includes(p.id) && <Check size={12} />}
                              {p.name}
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button type="button" onClick={() => setShowRoleForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">{editingRole ? "Update Role" : "Create Role"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

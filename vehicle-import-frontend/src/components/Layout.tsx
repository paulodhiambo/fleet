import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Car, Wrench, ClipboardCheck, AlertTriangle,
  Bell, Settings as SettingsIcon, Users, Building2, Package,
  MapPin, FileText, BarChart3, Truck, ShieldCheck, ShieldX,
  Sun, Moon, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

const navGroups = [
  {
    label: "Overview",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Fleet",
    items: [
      { to: "/vehicles", label: "Vehicles", icon: Car },
      { to: "/tools", label: "Tools", icon: Wrench },
      { to: "/parts", label: "Parts", icon: Package },
      { to: "/places", label: "Places", icon: MapPin },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/inspections", label: "Inspections", icon: ClipboardCheck },
      { to: "/pre-inspections", label: "Pre-Import", icon: ShieldCheck },
      { to: "/post-inspections", label: "Post-Import", icon: ShieldX },
      { to: "/services", label: "Service", icon: Truck },
    ],
  },
  {
    label: "Tracking",
    items: [
      { to: "/issues", label: "Issues", icon: AlertTriangle },
      { to: "/reminders", label: "Reminders", icon: Bell },
      { to: "/documents", label: "Documents", icon: FileText },
    ],
  },
  {
    label: "People",
    items: [
      { to: "/contacts", label: "Contacts", icon: Users },
      { to: "/vendors", label: "Vendors", icon: Building2 },
    ],
  },
  {
    label: "Analytics",
    items: [
      { to: "/reports", label: "Reports", icon: BarChart3 },
      { to: "/settings", label: "Settings", icon: SettingsIcon },
    ],
  },
];

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/vehicles": "Vehicles",
  "/tools": "Tools & Equipment",
  "/inspections": "Inspections",
  "/pre-inspections": "Pre-Import Inspections",
  "/post-inspections": "Post-Import Inspections",
  "/issues": "Issues",
  "/reminders": "Reminders",
  "/services": "Service",
  "/contacts": "Contacts",
  "/vendors": "Vendors",
  "/parts": "Parts Inventory",
  "/places": "Places",
  "/documents": "Documents",
  "/reports": "Reports",
  "/settings": "Settings",
};

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const currentTitle = pageTitles[location.pathname] || "FleetTrack";

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-[68px]" : "w-60"
        } bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 flex-shrink-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center flex-shrink-0">
            <Car size={16} className="text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              FleetTrack
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3 mb-2">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                      }`
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon size={18} className="flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse button */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header bar */}
        <header className="h-16 flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{currentTitle}</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              P
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import VehicleDetail from "./pages/VehicleDetail";
import Tools from "./pages/Tools";
import Inspections from "./pages/Inspections";
import PreInspections from "./pages/PreInspections";
import PostInspections from "./pages/PostInspections";
import Issues from "./pages/Issues";
import Reminders from "./pages/Reminders";
import Services from "./pages/Services";
import Contacts from "./pages/Contacts";
import Vendors from "./pages/Vendors";
import Parts from "./pages/Parts";
import Places from "./pages/Places";
import Documents from "./pages/Documents";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/vehicles/:id" element={<VehicleDetail />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/inspections" element={<Inspections />} />
            <Route path="/pre-inspections" element={<PreInspections />} />
            <Route path="/post-inspections" element={<PostInspections />} />
            <Route path="/issues" element={<Issues />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/parts" element={<Parts />} />
            <Route path="/places" element={<Places />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import PatientDashboard from "./pages/PatientDashboard";

function App() {
  const path = window.location.pathname;
  if (path === '/admin') return <AdminDashboard />;
  if (path === '/dashboard') return <PatientDashboard />;
  return <Home />;
}

createRoot(document.getElementById("root")!).render(<App />);

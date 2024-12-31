import { useState } from "react";
import { Banknote, Users, Receipt, BarChart, Wrench, Shield } from "lucide-react";

// Importar todas las páginas
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Billing from "./pages/Billing";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";

export default function App() {
  const [currentSection, setCurrentSection] = useState("disponible");

  const sections = [
    { id: "disponible", name: "Dinero Disponible", icon: Banknote, component: Dashboard },
    { id: "clientes", name: "Análisis de Clientes", icon: Users, component: Clients },
    { id: "facturacion", name: "Facturación", icon: Receipt, component: Billing },
    { id: "reportes", name: "Reportes y Estadísticas", icon: BarChart, component: Reports },
    { id: "configuracion", name: "Configuración", icon: Wrench, component: Settings },
    { id: "admin", name: "Panel de Administración", icon: Shield, component: Admin }
  ];

  const CurrentComponent = sections.find(s => s.id === currentSection)?.component;

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">GP Capital</h1>
        </div>
        
        <nav className="p-4">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setCurrentSection(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  currentSection === section.id
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={20} />
                <span>{section.name}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {sections.find(s => s.id === currentSection)?.name}
          </h2>
        </header>
        <div className="bg-white rounded-lg shadow-sm p-6">
          {CurrentComponent && <CurrentComponent />}
        </div>
      </main>
    </div>
  );
}
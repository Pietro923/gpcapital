import { useState } from "react";
import { 
  Users, 
  Receipt, 
  Calculator, 
  Building2, 
  ClipboardList, 
  Menu,
  UserCheck,
  CreditCard,
  LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

// Importar componentes de páginas
import ClientList from "./pages/ClientList";
import LoanDetails from "./pages/LoanDetails";
import LoanSimulator from "./pages/LoanSimulator";
import ClientAnalysis from "./pages/ClientAnalysis";
import Providers from "./pages/Providers";
import Billing from "./pages/Billing";

// Definición de tipos
interface Section {
  id: "clientes" | "cuotas" | "simulador" | "analisis" | "proveedores" | "facturacion";
  name: string;
  icon: LucideIcon;
  component?: React.FC;
  description: string;
}

// Componente placeholder para las secciones no implementadas
const PlaceholderComponent: React.FC = () => (
  <div className="text-center py-8 text-slate-500">
    Sección en desarrollo...
  </div>
);

export default function App() {
  const [currentSection, setCurrentSection] = useState<Section["id"]>("clientes");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const sections: Section[] = [
    { 
      id: "clientes", 
      name: "Listado de Clientes", 
      icon: Users, 
      component: ClientList,
      description: "Gestión y seguimiento de solicitantes de créditos"
    },
    { 
      id: "cuotas", 
      name: "Detalle de Cuotas", 
      icon: ClipboardList, 
      component: LoanDetails,
      description: "Seguimiento de pagos y cuotas de préstamos"
    },
    { 
      id: "simulador", 
      name: "Simulador de Préstamos", 
      icon: Calculator, 
      component: LoanSimulator,
      description: "Simulación de préstamos con diferentes condiciones"
    },
    { 
      id: "analisis", 
      name: "Análisis de Clientes", 
      icon: UserCheck, 
      component: ClientAnalysis,
      description: "Evaluación de aptitud crediticia"
    },
    { 
      id: "proveedores", 
      name: "Proveedores", 
      icon: Building2, 
      component: Providers,
      description: "Gestión de empresas del Grupo Pueble"
    },
    { 
      id: "facturacion", 
      name: "Facturación AFIP", 
      icon: Receipt, 
      component: Billing,
      description: "Generación de facturas tipo A/B"
    }
  ];

  const currentSectionData = sections.find(s => s.id === currentSection);
  const CurrentComponent = currentSectionData?.component || PlaceholderComponent;

  const handleSectionChange = (sectionId: Section["id"]) => {
    setCurrentSection(sectionId);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-slate-200 transition-all duration-300",
        isSidebarCollapsed ? "w-20" : "w-64"
      )}>
        {/* Logo y título */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6 text-blue-600" />
            <h1 className={cn(
              "font-bold text-blue-600 transition-all duration-300",
              isSidebarCollapsed ? "hidden" : "text-xl"
            )}>
              GP Capital
            </h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Navegación */}
        <nav className="p-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Button
                key={section.id}
                variant={currentSection === section.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start mb-1",
                  isSidebarCollapsed ? "px-2" : "px-4",
                )}
                onClick={() => handleSectionChange(section.id)}
              >
                <Icon className={cn(
                  "h-4 w-4",
                  currentSection === section.id ? "text-white" : "text-slate-500"
                )} />
                {!isSidebarCollapsed && (
                  <span className="ml-3">{section.name}</span>
                )}
              </Button>
            );
          })}
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {currentSectionData?.name}
              </h2>
              <p className="text-sm text-slate-500">
                {currentSectionData?.description}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                Soporte
              </Button>
              <Button size="sm">
                Nuevo Registro
              </Button>
            </div>
          </div>
        </header>

        {/* Área de contenido */}
        <div className="p-8">
          <Card>
            <CardContent className="p-6">
              <CurrentComponent />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
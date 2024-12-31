// src/pages/Settings/index.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Settings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración General</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre de la Empresa</label>
              <Input defaultValue="GP Capital" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email de Contacto</label>
              <Input type="email" />
            </div>
            <Button>Guardar Cambios</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
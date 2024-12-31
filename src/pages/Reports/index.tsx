// src/pages/Reports/index.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export default function Reports() {
  return (
    <Tabs defaultValue="monthly">
      <TabsList>
        <TabsTrigger value="monthly">Reporte Mensual</TabsTrigger>
        <TabsTrigger value="quarterly">Reporte Trimestral</TabsTrigger>
        <TabsTrigger value="yearly">Reporte Anual</TabsTrigger>
      </TabsList>

      <TabsContent value="monthly">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">Ingresos Totales</h4>
                <p className="text-2xl font-bold">$25,000</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Préstamos Otorgados</h4>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
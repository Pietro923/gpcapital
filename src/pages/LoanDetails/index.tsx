import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LoanDetails: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Cuotas</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Contenido del detalle de cuotas */}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanDetails;
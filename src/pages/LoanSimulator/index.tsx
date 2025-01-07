import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LoanSimulator: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Simulador de Préstamos</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Contenido del simulador de préstamos */}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanSimulator;
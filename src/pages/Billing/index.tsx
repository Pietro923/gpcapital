import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Billing: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Facturación AFIP</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Contenido de facturación */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
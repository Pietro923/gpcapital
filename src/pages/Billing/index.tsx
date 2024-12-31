// src/pages/Billing/index.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function Billing() {
  const invoices = [
    { id: 1, client: "Juan Pérez", amount: 1500, status: "Pagado", date: "2024-01-15" },
    { id: 2, client: "María García", amount: 2000, status: "Pendiente", date: "2024-01-20" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Facturas Recientes</h3>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva Factura
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.client}</TableCell>
              <TableCell>${invoice.amount}</TableCell>
              <TableCell>{invoice.status}</TableCell>
              <TableCell>{invoice.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
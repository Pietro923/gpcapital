import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Cuota {
  id: string;
  numeroCuota: number;
  fechaVencimiento: string;
  montoTotal: number;
  montoPagado: number;
  estado: 'pagada' | 'pendiente' | 'vencida';
  fechaPago?: string;
}

interface Prestamo {
  id: string;
  cliente: string;
  producto: string;
  montoTotal: number;
  cantidadCuotas: number;
  cuotasPagadas: number;
  cuotas: Cuota[];
}

const LoanDetails: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Datos de ejemplo
  const prestamos: Prestamo[] = [
    {
      id: '1',
      cliente: 'Juan Pérez',
      producto: 'Case Tractor',
      montoTotal: 15000000,
      cantidadCuotas: 12,
      cuotasPagadas: 3,
      cuotas: [
        {
          id: '1-1',
          numeroCuota: 1,
          fechaVencimiento: '2024-01-05',
          montoTotal: 1250000,
          montoPagado: 1250000,
          estado: 'pagada',
          fechaPago: '2024-01-03'
        },
        {
          id: '1-2',
          numeroCuota: 2,
          fechaVencimiento: '2024-02-05',
          montoTotal: 1250000,
          montoPagado: 1250000,
          estado: 'pagada',
          fechaPago: '2024-02-04'
        },
        {
          id: '1-3',
          numeroCuota: 3,
          fechaVencimiento: '2024-03-05',
          montoTotal: 1250000,
          montoPagado: 0,
          estado: 'vencida'
        }
      ]
    }
  ];

  const getEstadoColor = (estado: Cuota['estado']) => {
    switch (estado) {
      case 'pagada':
        return 'text-green-600 bg-green-100';
      case 'vencida':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };
  
  interface ExcelRow {
    [key: string]: string | number;
  }

  const filteredPrestamos = prestamos.filter(prestamo =>
    prestamo.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToExcel = () => {
    const excelData: ExcelRow[] = filteredPrestamos.flatMap(prestamo => 
      prestamo.cuotas.map(cuota => ({
        'Cliente': prestamo.cliente,
        'Producto': prestamo.producto,
        'Número de Cuota': cuota.numeroCuota,
        'Fecha Vencimiento': new Date(cuota.fechaVencimiento).toLocaleDateString('es-AR'),
        'Monto Total': cuota.montoTotal,
        'Monto Pagado': cuota.montoPagado,
        'Estado': cuota.estado,
        'Fecha Pago': cuota.fechaPago ? new Date(cuota.fechaPago).toLocaleDateString('es-AR') : ''
      }))
    );

    // Crear el contenido del Excel
    let csvContent = '\ufeff'; // BOM para caracteres especiales
    
    // Agregar headers
    const headers = Object.keys(excelData[0]);
    csvContent += headers.join(';') + '\n';

    // Agregar datos
    excelData.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value}"` : value;
      });
      csvContent += values.join(';') + '\n';
    });

    // Crear y descargar el archivo
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cuotas_${new Date().toISOString().split('T')[0]}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Detalle de Cuotas</CardTitle>
          <Button variant="outline" onClick={exportToExcel}>
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por cliente..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Alerta de cuotas vencidas */}
            {filteredPrestamos.some(p => p.cuotas.some(c => c.estado === 'vencida')) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Hay cuotas vencidas que requieren atención inmediata.
                </AlertDescription>
              </Alert>
            )}

            {/* Tabla */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Cuota</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead className="text-right">Pagado</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Pago</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrestamos.flatMap(prestamo =>
                    prestamo.cuotas.map(cuota => (
                      <TableRow key={cuota.id}>
                        <TableCell>{prestamo.cliente}</TableCell>
                        <TableCell>{prestamo.producto}</TableCell>
                        <TableCell className="text-right">{cuota.numeroCuota}/{prestamo.cantidadCuotas}</TableCell>
                        <TableCell>{new Date(cuota.fechaVencimiento).toLocaleDateString('es-AR')}</TableCell>
                        <TableCell className="text-right">${cuota.montoTotal.toLocaleString('es-AR')}</TableCell>
                        <TableCell className="text-right">${cuota.montoPagado.toLocaleString('es-AR')}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(cuota.estado)}`}>
                            {cuota.estado.toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell>
                          {cuota.fechaPago ? new Date(cuota.fechaPago).toLocaleDateString('es-AR') : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanDetails;
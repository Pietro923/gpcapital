import React, { useState, useEffect } from 'react';
import Database from '@tauri-apps/plugin-sql';
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
import { Search, Download, AlertCircle, ChevronDown, ChevronRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Cuota {
  id: number;
  prestamo_id: number;
  numero_cuota: number;
  fecha_vencimiento: string;
  monto_total: number;
  monto_pagado: number;
  estado: 'pagada' | 'pendiente' | 'vencida';
  fecha_pago: string | null;
}

interface PrestamoConCuotas {
  id: number;
  cliente_nombre: string;
  producto: string;
  monto_total: number;
  cantidad_cuotas: number;
  cuotas_pagadas: number;
  cuotas: Cuota[];
}

interface QueryResult {
  id: number;
  cliente_nombre: string;
  producto: string;
  monto_total: number;
  cantidad_cuotas: number;
  cuotas_pagadas: number;
  cuota_id: number;
  numero_cuota: number;
  fecha_vencimiento: string;
  monto_cuota: number;
  monto_pagado: number;
  estado_cuota: 'pagada' | 'pendiente' | 'vencida';
  fecha_pago: string | null;
}

interface ExcelRow {
  Cliente: string;
  Producto: string;
  'Número de Cuota': number;
  'Fecha Vencimiento': string;
  'Monto Total': number;
  'Monto Pagado': number;
  Estado: 'pagada' | 'pendiente' | 'vencida';
  'Fecha Pago': string;
}

const LoanDetails = () => {
  const [prestamos, setPrestamos] = useState<PrestamoConCuotas[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPrestamos, setExpandedPrestamos] = useState<number[]>([]);

  useEffect(() => {
    loadPrestamos();
  }, []);

  const loadPrestamos = async () => {
    setLoading(true);
    setError(null);
    try {
      const db = await Database.load('sqlite:gp-capital.db');
      
      const result = await db.select<QueryResult[]>(`
        SELECT 
          p.id,
          c.nombre as cliente_nombre,
          p.producto,
          p.monto_total,
          p.cantidad_cuotas,
          p.cuotas_pagadas,
          cu.id as cuota_id,
          cu.numero_cuota,
          cu.fecha_vencimiento,
          cu.monto_total as monto_cuota,
          cu.monto_pagado,
          cu.estado as estado_cuota,
          cu.fecha_pago
        FROM prestamos p
        JOIN clientes c ON p.cliente_id = c.id
        JOIN cuotas cu ON p.id = cu.prestamo_id
        ORDER BY c.nombre, p.id, cu.numero_cuota
      `);

      const prestamosMap = new Map<number, PrestamoConCuotas>();
      
      result.forEach((row) => {
        if (!prestamosMap.has(row.id)) {
          prestamosMap.set(row.id, {
            id: row.id,
            cliente_nombre: row.cliente_nombre,
            producto: row.producto,
            monto_total: row.monto_total,
            cantidad_cuotas: row.cantidad_cuotas,
            cuotas_pagadas: row.cuotas_pagadas,
            cuotas: []
          });
        }

        const prestamo = prestamosMap.get(row.id)!;
        prestamo.cuotas.push({
          id: row.cuota_id,
          prestamo_id: row.id,
          numero_cuota: row.numero_cuota,
          fecha_vencimiento: row.fecha_vencimiento,
          monto_total: row.monto_cuota,
          monto_pagado: row.monto_pagado,
          estado: row.estado_cuota,
          fecha_pago: row.fecha_pago
        });
      });

      setPrestamos(Array.from(prestamosMap.values()));
    } catch (err) {
      console.error('Error al cargar préstamos:', err);
      setError('Error al cargar los datos de préstamos');
    } finally {
      setLoading(false);
    }
  };

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

  const filteredPrestamos = prestamos.filter(prestamo =>
    prestamo.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToExcel = () => {
    const excelData: ExcelRow[] = filteredPrestamos.flatMap(prestamo => 
      prestamo.cuotas.map(cuota => ({
        'Cliente': prestamo.cliente_nombre,
        'Producto': prestamo.producto,
        'Número de Cuota': cuota.numero_cuota,
        'Fecha Vencimiento': new Date(cuota.fecha_vencimiento).toLocaleDateString('es-AR'),
        'Monto Total': cuota.monto_total,
        'Monto Pagado': cuota.monto_pagado,
        'Estado': cuota.estado,
        'Fecha Pago': cuota.fecha_pago ? new Date(cuota.fecha_pago).toLocaleDateString('es-AR') : ''
      }))
    );

    let csvContent = '\ufeff';
    const headers = Object.keys(excelData[0]) as (keyof ExcelRow)[];
    csvContent += headers.join(';') + '\n';

    excelData.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value}"` : value;
      });
      csvContent += values.join(';') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cuotas_${new Date().toISOString().split('T')[0]}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="flex justify-center p-4">Cargando...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const toggleExpanded = (prestamoId: number) => {
    setExpandedPrestamos(prev => 
      prev.includes(prestamoId) 
        ? prev.filter(id => id !== prestamoId)
        : [...prev, prestamoId]
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Detalle de Préstamos y Cuotas</CardTitle>
          <Button variant="outline" onClick={exportToExcel}>
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por cliente..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredPrestamos.some(p => p.cuotas.some(c => c.estado === 'vencida')) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Hay cuotas vencidas que requieren atención inmediata.
                </AlertDescription>
              </Alert>
            )}

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Monto Total</TableHead>
                    <TableHead className="text-right">Cuotas Pagadas</TableHead>
                    <TableHead>Progreso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrestamos.map(prestamo => (
                    <React.Fragment key={prestamo.id}>
                      <TableRow 
                        className="cursor-pointer hover:bg-slate-50"
                        onClick={() => toggleExpanded(prestamo.id)}
                      >
                        <TableCell>
                          {expandedPrestamos.includes(prestamo.id) ? 
                            <ChevronDown className="h-4 w-4" /> : 
                            <ChevronRight className="h-4 w-4" />}
                        </TableCell>
                        <TableCell className="font-medium">{prestamo.cliente_nombre}</TableCell>
                        <TableCell>{prestamo.producto}</TableCell>
                        <TableCell className="text-right">
                          ${prestamo.monto_total.toLocaleString('es-AR')}
                        </TableCell>
                        <TableCell className="text-right">
                          {prestamo.cuotas_pagadas}/{prestamo.cantidad_cuotas}
                        </TableCell>
                        <TableCell>
                          <div className="w-full bg-slate-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${(prestamo.cuotas_pagadas / prestamo.cantidad_cuotas) * 100}%` }}
                            ></div>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedPrestamos.includes(prestamo.id) && prestamo.cuotas.map(cuota => (
                        <TableRow key={cuota.id} className="bg-slate-50">
                          <TableCell></TableCell>
                          <TableCell colSpan={2} className="text-sm">
                            Cuota {cuota.numero_cuota}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            ${cuota.monto_total.toLocaleString('es-AR')}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            ${cuota.monto_pagado.toLocaleString('es-AR')}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(cuota.estado)}`}>
                              {cuota.estado.toUpperCase()}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
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
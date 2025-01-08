import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Plus, FileText, UserX, UserCheck, Download } from "lucide-react";

// Tipos
interface Cliente {
  id: string;
  nombre: string;
  dni: string;
  empresa: string;
  producto: string;
  monto: number;
  estado: 'aprobado' | 'rechazado' | 'pendiente';
  fechaSolicitud: string;
}

interface ExcelRow {
  [key: string]: string | number;
}

const ClientList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEmpresa, setFilterEmpresa] = useState('todas');
  const [filterEstado, setFilterEstado] = useState('todos');

  // Datos de ejemplo
  const clientes: Cliente[] = [
    {
      id: '1',
      nombre: 'Juan Pérez',
      dni: '28456789',
      empresa: 'Pueble',
      producto: 'Case Tractor',
      monto: 15000000,
      estado: 'aprobado',
      fechaSolicitud: '2024-01-05'
    },
    {
      id: '2',
      nombre: 'María González',
      dni: '30789456',
      empresa: 'Magi',
      producto: 'Ducati Monster',
      monto: 8000000,
      estado: 'pendiente',
      fechaSolicitud: '2024-01-06'
    },
    {
      id: '3',
      nombre: 'Carlos Rodríguez',
      dni: '25123456',
      empresa: 'ub.ti',
      producto: 'Audi A3',
      monto: 12000000,
      estado: 'rechazado',
      fechaSolicitud: '2024-01-07'
    }
  ];

  const getEstadoColor = (estado: Cliente['estado']) => {
    switch (estado) {
      case 'aprobado':
        return 'text-green-600 bg-green-100';
      case 'rechazado':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getEstadoIcon = (estado: Cliente['estado']) => {
    switch (estado) {
      case 'aprobado':
        return <UserCheck className="w-4 h-4" />;
      case 'rechazado':
        return <UserX className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const filteredClientes = clientes
    .filter(cliente => 
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.dni.includes(searchTerm)
    )
    .filter(cliente => 
      filterEmpresa === 'todas' || cliente.empresa === filterEmpresa
    )
    .filter(cliente => 
      filterEstado === 'todos' || cliente.estado === filterEstado
    );

    const exportToExcel = () => {
      // Preparar los datos para el Excel
      const excelData: ExcelRow[] = filteredClientes.map(cliente => ({
        'Nombre': cliente.nombre,
        'DNI': cliente.dni,
        'Empresa': cliente.empresa,
        'Producto': cliente.producto,
        'Monto': cliente.monto,
        'Estado': cliente.estado,
        'Fecha Solicitud': new Date(cliente.fechaSolicitud).toLocaleDateString('es-AR')
      }));
  
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
      link.setAttribute('download', `clientes_${new Date().toISOString().split('T')[0]}.xls`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Listado de Clientes</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={exportToExcel}>
              <Download className="mr-2 h-4 w-4" /> Exportar
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {/* Filtros */}
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por nombre o DNI..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={filterEmpresa}
                onValueChange={setFilterEmpresa}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las empresas</SelectItem>
                  <SelectItem value="Pueble">Pueble</SelectItem>
                  <SelectItem value="Semage">Semage</SelectItem>
                  <SelectItem value="Magi">Magi</SelectItem>
                  <SelectItem value="ub.ti">ub.ti</SelectItem>
                  <SelectItem value="Cpm">Cpm</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filterEstado}
                onValueChange={setFilterEstado}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="aprobado">Aprobado</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="rechazado">Rechazado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabla */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>DNI</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClientes.map((cliente) => (
                    <TableRow key={cliente.id} className="cursor-pointer hover:bg-slate-50">
                      <TableCell className="font-medium">{cliente.nombre}</TableCell>
                      <TableCell>{cliente.dni}</TableCell>
                      <TableCell>{cliente.empresa}</TableCell>
                      <TableCell>{cliente.producto}</TableCell>
                      <TableCell className="text-right">
                        ${cliente.monto.toLocaleString('es-AR')}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(cliente.estado)}`}>
                          {getEstadoIcon(cliente.estado)}
                          <span className="ml-1 capitalize">{cliente.estado}</span>
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(cliente.fechaSolicitud).toLocaleDateString('es-AR')}
                      </TableCell>
                    </TableRow>
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

export default ClientList;
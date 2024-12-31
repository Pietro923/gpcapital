// src/pages/Clients/index.tsx
import { useState } from 'react';
import { Search, Filter, UserPlus, Download } from 'lucide-react';

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const mockClients = [
    { id: 1, name: 'Juan Pérez', debt: 5000, status: 'Al día', risk: 'Bajo' },
    { id: 2, name: 'María García', debt: 10000, status: 'Atrasado', risk: 'Alto' },
  ];

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar cliente..."
              className="pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter size={20} />
            <span>Filtros</span>
          </button>
        </div>
        
        <div className="flex space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <UserPlus size={20} />
            <span>Nuevo Cliente</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Download size={20} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Tabla de clientes */}
      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deuda
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Riesgo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockClients.map((client) => (
              <tr key={client.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{client.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${client.debt}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    client.status === 'Al día' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{client.risk}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-900">Ver detalles</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
import { useState } from 'react';
import Database from '@tauri-apps/plugin-sql';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface Cliente {
  id: number;
  nombre: string;
  dni: string;
  empresa: string;
  producto: string;
  monto: number;
  estado: string;
  fechaSolicitud: string;
}

const DatabaseConnectionCheck = () => {
  const [connectionStatus, setConnectionStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cliente, setCliente] = useState<Cliente | null>(null);

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const db = await Database.load('sqlite:gp-capital.db');
      
      // Consulta para obtener el primer cliente
      const result = await db.select<Cliente[]>('SELECT * FROM clientes WHERE id = 4');
      console.log('Cliente encontrado:', result);
      
      if (result.length > 0) {
        setCliente(result[0]);
        setConnectionStatus('success');
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const closeClientInfo = () => {
    setCliente(null);
    setConnectionStatus(''); // Reinicia el estado de conexión
  };

  return (
    <div>
      <Button 
        onClick={checkConnection}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Verificando...' : 'Verificar Conexión'}
      </Button>
      
      {connectionStatus === 'success' && cliente && (
        <div className="space-y-4">
          <Alert className="bg-green-50 border-green-200">
            <AlertTitle className="text-green-800">Conexión exitosa</AlertTitle>
            <AlertDescription className="text-green-700">
              La conexión a la base de datos se ha establecido correctamente.
            </AlertDescription>
          </Alert>
          
          <div className="bg-white p-4 rounded-lg shadow space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Datos del Cliente:</h3>
              <div className="space-y-2">
                <p><strong>Nombre:</strong> {cliente.nombre}</p>
                <p><strong>DNI:</strong> {cliente.dni}</p>
                <p><strong>Empresa:</strong> {cliente.empresa}</p>
                <p><strong>Producto:</strong> {cliente.producto}</p>
                <p><strong>Monto:</strong> ${cliente.monto.toFixed(2)}</p>
                <p><strong>Estado:</strong> {cliente.estado}</p>
                <p><strong>Fecha de Solicitud:</strong> {cliente.fechaSolicitud}</p>
              </div>
            </div>
            <Button 
              onClick={closeClientInfo} 
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Cerrar Información
            </Button>
          </div>
        </div>
      )}
      
      {connectionStatus === 'error' && (
        <Alert className="bg-red-50 border-red-200">
          <AlertTitle className="text-red-800">Error de conexión</AlertTitle>
          <AlertDescription className="text-red-700">
            No se pudo establecer la conexión con la base de datos o no se encontraron datos.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DatabaseConnectionCheck;

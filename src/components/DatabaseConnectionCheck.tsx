import { useState } from 'react';
import Database from '@tauri-apps/plugin-sql';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const DatabaseConnectionCheck = () => {
  const [connectionStatus, setConnectionStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      // La ruta es relativa a BaseDirectory::AppConfig
      const db = await Database.load('sqlite:gp-capital.db');
      
      // Realizamos una consulta de prueba
      const result = await db.select('SELECT 1');
      console.log('Resultado de la consulta:', result);
      
      setConnectionStatus('success');
    } catch (error) {
      console.error('Error de conexión:', error);
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Button 
        onClick={checkConnection}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Verificando...' : 'Verificar Conexión'}
      </Button>
      {connectionStatus === 'success' && (
        <Alert className="bg-green-50 border-green-200">
          <AlertTitle className="text-green-800">Conexión exitosa</AlertTitle>
          <AlertDescription className="text-green-700">
            La conexión a la base de datos se ha establecido correctamente.
          </AlertDescription>
        </Alert>
      )}
      {connectionStatus === 'error' && (
        <Alert className="bg-red-50 border-red-200">
          <AlertTitle className="text-red-800">Error de conexión</AlertTitle>
          <AlertDescription className="text-red-700">
            No se pudo establecer la conexión con la base de datos. Por favor, verifica la ruta y los permisos.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DatabaseConnectionCheck;
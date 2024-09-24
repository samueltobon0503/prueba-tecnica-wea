
'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        console.log('Enviando:', { userName, password });
        const res = await fetch('https://api.worldeventaccess.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userName, password }),
        });
      
        console.log('Estado de la respuesta:', res.status); 
      
        if (res.ok) {
          const token = await res.text(); 
          console.log('Token recibido:', token); 
          localStorage.setItem('token', token); 
          router.push('/events'); 
        } else {
          const errorData = await res.text(); 
          console.error('Error en la autenticación:', errorData);
          setError('Credenciales inválidas');
        }
      } catch (error) {
        console.error('Error al realizar el fetch:', error);
        setError('Ocurrió un error al intentar autenticar');
      }
    };
      

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-xs">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <img className="mx-auto mb-4" src="/assets/logo.png" />
          <h1 className="text-xl mb-4">Iniciar Sesión</h1>
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Usuario"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

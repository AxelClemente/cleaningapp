'use client'

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonIcon, ReaderIcon } from '@radix-ui/react-icons';
import { useSession } from 'next-auth/react'; // Importamos el hook de sesión


const DashboardPage: FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession(); // Usamos el hook useSession


  const handleCardClick = (path: string) => {
    router.push(path);
  };

  // Si el usuario no está autenticado, puedes redirigir o mostrar un mensaje
  if (status === 'loading') {
    return <div>Cargando...</div>; // Mientras carga la sesión
  }

  if (status === 'unauthenticated') {
    return <div>No estás autenticado</div>; // Si no hay autenticación
  }

  // Extraemos el nombre del usuario de la sesión
  const userName = session?.user?.name || 'Usuario';

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">¡Welcome back, {userName}!</h1>
      <h2 className="text-xl font-semibold mb-6">Estamos aquí para ayudarte</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCardClick('/')}
        >
          <CardHeader>
            <PersonIcon className="w-6 h-6" />
            <CardTitle>Hire a Cleaning Service</CardTitle>
          </CardHeader>
          <CardContent>
            Find the best cleaning service tailored to your needs.
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <ReaderIcon className="w-6 h-6" />
            <CardTitle>Join as a Cleaner</CardTitle>
          </CardHeader>
          <CardContent>
            Become part of our team and offer your cleaning services.
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
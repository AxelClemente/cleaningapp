

import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonIcon, ReaderIcon } from '@radix-ui/react-icons';

const DashboardPage: FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">¡Qué bien tenerte por aquí de nuevo, Axel!</h1>
      <h2 className="text-xl font-semibold mb-6">Estamos aquí para ayudarte</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <PersonIcon className="w-6 h-6" />
            <CardTitle>Únete al club de anfitriones de tu zona</CardTitle>
          </CardHeader>
          <CardContent>
            Charla, colabora e intercambia consejos con otros anfitriones y miembros de la comunidad.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <ReaderIcon className="w-6 h-6" />
            <CardTitle>Visita el Centro de ayuda</CardTitle>
          </CardHeader>
          <CardContent>
            Resuelve las dudas que tengas sobre tu anuncio, los pagos, las evaluaciones y mucho más.
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
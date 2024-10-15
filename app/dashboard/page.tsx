'use client'

import { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonIcon, ReaderIcon } from '@radix-ui/react-icons';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/Header'; // Importamos el componente Header existente
import { WorkerForm } from '@/components/Worker-form';
import { getWorkerProfile } from '../lib/utils'; // Asumimos que existe esta función
import { WorkerProfile } from '../types/interfaces'; // Updated import path

const DashboardPage: FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showWorkerForm, setShowWorkerForm] = useState(false);
  const [workerProfile, setWorkerProfile] = useState<WorkerProfile | null>(null);

  useEffect(() => {
    console.log('useEffect triggered, showWorkerForm:', showWorkerForm);
    if (showWorkerForm) {
      getWorkerProfile().then(profile => {
        console.log('Profile received in component:', profile);
        if (profile) {
          setWorkerProfile(profile);
          console.log('Worker profile set in state');
        } else {
          console.log('No profile received');
        }
      });
    }
  }, [showWorkerForm]);

  const handleCardClick = (path: string) => {
    router.push(path);
  };

  const handleJoinAsCleanerClick = () => {
    setShowWorkerForm(true);
  };

  if (status === 'loading') {
    return <div>Cargando...</div>;
  }

  if (status === 'unauthenticated') {
    return <div>No estás autenticado</div>;
  }

  const fullName = session?.user?.name || 'Usuario';
  const firstName = fullName.split(' ')[0];

  // Añade este console.log para ver el estado actual
  console.log('Current workerProfile state:', workerProfile);

  return (
    <div>
      <Header 
        doctorName={fullName} 
        clinicName={
          <span className="font-montserrat font-medium text-[#002b34]">
            Building a community where cleaners and clients come together as a team!
          </span>
        }
      />
      <div className={`p-6 ${showWorkerForm ? 'text-center' : ''}`}>
        <div className={showWorkerForm ? 'max-w-2xl mx-auto' : ''}>
          <h1 className="text-3xl font-bold mb-4">
            {showWorkerForm 
              ? `Connect with clients in your area, ${firstName}!`
              : `¡Welcome back, ${firstName}!`
            }
          </h1>
          <h2 className="text-xl font-semibold mb-6">
            {showWorkerForm
              ? "You're one step closer!"
              : "How can we help you today?"
            }
          </h2>
        </div>
        {!showWorkerForm ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleCardClick('/HomeDashboard')}
            >
              <CardHeader>
                <PersonIcon className="w-6 h-6" />
                <CardTitle>Hire a Cleaning Service</CardTitle>
              </CardHeader>
              <CardContent>
                Find the best cleaning service in your area.
              </CardContent>
            </Card>
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={handleJoinAsCleanerClick}
            >
              <CardHeader>
                <ReaderIcon className="w-6 h-6" />
                <CardTitle>Join as a Cleaner</CardTitle>
              </CardHeader>
              <CardContent>
                Become part of our team and offer your cleaning services.
              </CardContent>
            </Card>
          </div>
        ) : (
          <WorkerForm existingData={workerProfile ? {...workerProfile, phone: workerProfile.phone || ''} : undefined} />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

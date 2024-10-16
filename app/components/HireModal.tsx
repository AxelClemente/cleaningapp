'use client'

import { FC, useState } from 'react';
import Image from 'next/image';
import { Button } from "./Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface HireServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HireModal: FC<HireServiceModalProps> = ({ isOpen, onClose }) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-3xl font-montserrat-700 text-center text-[#002c3c] mb-8">
            Select your type of service
          </DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-8">
          <Card 
            className={`w-full cursor-pointer transition-all duration-300 border-2 border-[#002b34] ${
              hoveredCard === 'cleaner' ? 'scale-105 shadow-xl' : ''
            }`}
            onMouseEnter={() => setHoveredCard('cleaner')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[#002c3c]">Find a Cleaner</CardTitle>
              <p className="text-sm text-muted-foreground">
                Send your service request to a specific cleaner
              </p>
            </CardHeader>
            <CardContent>
              <Image
                src="/images/limpieza.jpg"
                alt="Persona trabajando sola"
                width={300}
                height={200}
                className="w-full h-48 object-cover mb-4 rounded-md"
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#002a34] hover:bg-[#004963] text-white font-bold transition-colors duration-200">
                Let's go
              </Button>
            </CardFooter>
          </Card>
          <Card 
            className={`w-full cursor-pointer transition-all duration-300 border-2 border-[#002b34] ${
              hoveredCard === 'freeForAll' ? 'scale-105 shadow-xl' : ''
            }`}
            onMouseEnter={() => setHoveredCard('freeForAll')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[#002c3c]">Free for all</CardTitle>
              <p className="text-sm text-muted-foreground">
                Let all cleaners in your area bid for your service request
              </p>
            </CardHeader>
            <CardContent>
              <Image
                src="/images/team.jpg"
                alt="Equipo trabajando junto"
                width={300}
                height={200}
                className="w-full h-48 object-cover mb-4 rounded-md"
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#002a34] hover:bg-[#004963] text-white font-bold transition-colors duration-200">
                Open request
              </Button>
            </CardFooter>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HireModal;

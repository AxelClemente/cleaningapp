'use client'

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar"
import { Button } from "../components/Button"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface User {
  name: string;
  status: string;
  lastSeen: string;
  avatarSrc: string;
}

export function Modal({ isOpen, onClose }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">About TidyTeam</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500 mb-4">
            We believe that a clean space leads to a clear mind, and we know that finding trusted help for your home can be challenging. That’s why we created TidyTeam—a platform that connects freelance cleaners with homeowners and guests who need reliable cleaning services. Our name, TidyTeam, reflects our commitment to building a community where cleaners and clients come together as a team, sharing in the goal of creating sparkling, welcoming homes. Whether you’re a busy professional, a frequent traveler, or just in need of a helping hand, TidyTeam is here to make life easier—one clean home at a time.
        </p>
        
      </DialogContent>
    </Dialog>
  );
}
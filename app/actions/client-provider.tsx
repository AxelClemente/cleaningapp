'use client'; // Indica que este componente es un Client Component

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ClientProvider({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}

"use client"; // Mark this component as a Client Component

import { SessionProvider } from "next-auth/react";

interface SessionWraperProps {
  children: React.ReactNode;
}

export function SessionWraper({ children }: SessionWraperProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
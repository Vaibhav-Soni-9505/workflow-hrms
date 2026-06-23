'use client';

import { PropsWithChildren } from 'react';
import { RoleProvider } from '../context/RoleContext';

export function Providers({ children }: PropsWithChildren) {
  return (
    <RoleProvider>
      {children}
    </RoleProvider>
  );
}

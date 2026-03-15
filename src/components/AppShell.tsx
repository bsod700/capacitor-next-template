'use client';

import { KonstaProvider } from 'konsta/react';

// Detect iOS vs Android/Web at runtime for correct Konsta UI theme
function getTheme(): 'ios' | 'material' {
  if (typeof navigator === 'undefined') return 'ios';
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ? 'ios' : 'material';
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return <KonstaProvider theme={getTheme()}>{children}</KonstaProvider>;
}

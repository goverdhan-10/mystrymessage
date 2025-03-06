'use client';

import { useEffect } from 'react';

export default function ClientComponent() {
  useEffect(() => {
    // Client-side logic
    document.body.classList.remove('vsc-initialized');
  }, []);

  return null; // This component doesn't render anything
}
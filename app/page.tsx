'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/shared/auth/tokenStore';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const t = getAccessToken();
    router.replace(t ? '/dashboard' : '/login');
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-50 p-6 text-sm text-gray-600">
      redirecting…
    </main>
  );
}


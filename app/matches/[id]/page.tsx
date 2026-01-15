'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminApi } from '@/shared/api/adminClient';
import { getAccessToken, setAccessToken } from '@/shared/auth/tokenStore';

export default function MatchDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = String(params?.id || '');

  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace('/login');
      return;
    }
    let alive = true;
    (async () => {
      setErr(null);
      try {
        const res = await adminApi.get(`/admin/matches/${encodeURIComponent(id)}`);
        if (!alive) return;
        setData(res.data || null);
      } catch (e: any) {
        if (!alive) return;
        if (e?.response?.status === 401) {
          setAccessToken(null);
          router.replace('/login');
          return;
        }
        setErr(String(e?.response?.data?.message || e?.message || '로드 실패'));
      }
    })();
    return () => {
      alive = false;
    };
  }, [router, id]);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">매칭 상세</div>
        <div className="flex gap-2">
          <button
            className="rounded-md border bg-white px-3 py-2 text-sm"
            onClick={() => router.push('/matches')}
          >
            목록
          </button>
          <button
            className="rounded-md border bg-white px-3 py-2 text-sm"
            onClick={() => router.push('/dashboard')}
          >
            대시보드
          </button>
        </div>
      </div>

      {err ? (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      ) : null}

      {data ? (
        <section className="mt-4 rounded-lg border bg-white p-4 shadow-sm">
          <pre className="overflow-auto text-xs">
            {JSON.stringify(data, null, 2)}
          </pre>
          <div className="mt-3 text-xs text-gray-500">
            PII(전화)는 마스킹, 주민/외국인번호는 비노출.
          </div>
        </section>
      ) : (
        <div className="mt-6 text-sm text-gray-600">로딩 중…</div>
      )}
    </main>
  );
}


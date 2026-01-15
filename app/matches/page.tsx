'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/shared/api/adminClient';
import { getAccessToken, setAccessToken } from '@/shared/auth/tokenStore';

type MatchRow = {
  id: number;
  status: string;
  requestId: string | null;
  caregiverId: number | null;
  caregiverName: string | null;
  patientId: string | null;
  patientName: string | null;
  createdAt: string;
  acceptedAt: string | null;
  completedAt: string | null;
};

export default function MatchesPage() {
  const router = useRouter();
  const [rows, setRows] = useState<MatchRow[]>([]);
  const [total, setTotal] = useState<number | null>(null);
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
        const res = await adminApi.get('/admin/matches', {
          params: { page: 1, limit: 50 },
        });
        if (!alive) return;
        setRows(Array.isArray(res.data?.items) ? res.data.items : []);
        setTotal(typeof res.data?.total === 'number' ? res.data.total : null);
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
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xl font-semibold">매칭</div>
          <div className="mt-1 text-sm text-gray-600">
            total: {total === null ? '—' : total}
          </div>
        </div>
        <button
          className="rounded-md border bg-white px-3 py-2 text-sm"
          onClick={() => router.push('/dashboard')}
        >
          대시보드
        </button>
      </div>

      {err ? (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      ) : null}

      <div className="mt-4 overflow-auto rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">status</th>
              <th className="px-3 py-2">requestId</th>
              <th className="px-3 py-2">caregiver</th>
              <th className="px-3 py-2">patient</th>
              <th className="px-3 py-2">created</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">{r.id}</td>
                <td className="px-3 py-2">{r.status}</td>
                <td className="px-3 py-2">{r.requestId || '—'}</td>
                <td className="px-3 py-2">
                  {r.caregiverName ? `${r.caregiverName} (#${r.caregiverId})` : '—'}
                </td>
                <td className="px-3 py-2">
                  {r.patientName ? `${r.patientName} (${r.patientId})` : '—'}
                </td>
                <td className="px-3 py-2">{String(r.createdAt).slice(0, 10)}</td>
                <td className="px-3 py-2">
                  <button
                    className="rounded-md border bg-white px-2 py-1 text-xs"
                    onClick={() => router.push(`/matches/${r.id}`)}
                  >
                    상세
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td className="px-3 py-10 text-center text-gray-500" colSpan={7}>
                  데이터 없음
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}


'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/shared/api/adminClient';
import { getAccessToken, setAccessToken } from '@/shared/auth/tokenStore';
import { normalizeListResponse } from '@/shared/api/listResponse';
import { AdminShell } from '@/shared/ui/AdminShell';

type Row = any;

export default function CareRequestsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
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
        const res = await adminApi.get('/admin/care-requests', {
          params: { page: 1, limit: 50 },
        });
        if (!alive) return;
        const { items, total } = normalizeListResponse<Row>(res.data);
        setRows(items);
        setTotal(total);
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
    <AdminShell title="간병요청" subtitle={`total: ${total === null ? '—' : total}`}>
      {err ? (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      ) : null}

      <div className="mt-4 overflow-auto rounded-lg border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">status</th>
              <th className="px-3 py-2">careType</th>
              <th className="px-3 py-2">location</th>
              <th className="px-3 py-2">start</th>
              <th className="px-3 py-2">end</th>
              <th className="px-3 py-2">created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: any) => (
              <tr key={String(r.id)} className="border-t">
                <td className="px-3 py-2">{String(r.id ?? '—')}</td>
                <td className="px-3 py-2">{String(r.status ?? '—')}</td>
                <td className="px-3 py-2">{String(r.careType ?? r.care_type ?? '—')}</td>
                <td className="px-3 py-2">{String(r.location ?? '—')}</td>
                <td className="px-3 py-2">{String(r.startDate ?? r.start_date ?? '—').slice(0, 10)}</td>
                <td className="px-3 py-2">{String(r.endDate ?? r.end_date ?? '—').slice(0, 10)}</td>
                <td className="px-3 py-2">{String(r.createdAt ?? r.created_at ?? '—').slice(0, 10)}</td>
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
    </AdminShell>
  );
}


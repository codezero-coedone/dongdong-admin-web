'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/shared/api/adminClient';
import { getAccessToken, setAccessToken } from '@/shared/auth/tokenStore';
import { normalizeListResponse } from '@/shared/api/listResponse';
import { AdminShell } from '@/shared/ui/AdminShell';

type UserRow = {
  id: number;
  name: string;
  email: string | null;
  provider: string;
  role: string;
  createdAt: string;
  caregiverProfile: boolean;
  patientsCount: number;
};

export default function UsersPage() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<UserRow[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const query = useMemo(() => q.trim(), [q]);

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
        const res = await adminApi.get('/admin/users', {
          params: { q: query || undefined, page: 1, limit: 50 },
        });
        if (!alive) return;
        const { items, total } = normalizeListResponse<UserRow>(res.data);
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
  }, [router, query]);

  return (
    <AdminShell
      title="사용자"
      subtitle={`total: ${total === null ? '—' : total}`}
      right={
        <input
          className="w-72 rounded-md border bg-white px-3 py-2 text-sm"
          placeholder="이름/이메일 검색"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      }
    >

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
              <th className="px-3 py-2">이름</th>
              <th className="px-3 py-2">이메일(마스킹)</th>
              <th className="px-3 py-2">Provider</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">환자수</th>
              <th className="px-3 py-2">간병인</th>
              <th className="px-3 py-2">가입일</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">{r.id}</td>
                <td className="px-3 py-2">{r.name}</td>
                <td className="px-3 py-2">{r.email || '—'}</td>
                <td className="px-3 py-2">{r.provider}</td>
                <td className="px-3 py-2">{r.role}</td>
                <td className="px-3 py-2">{r.patientsCount}</td>
                <td className="px-3 py-2">{r.caregiverProfile ? 'Y' : 'N'}</td>
                <td className="px-3 py-2">{String(r.createdAt).slice(0, 10)}</td>
                <td className="px-3 py-2">
                  <button
                    className="rounded-md border bg-white px-2 py-1 text-xs"
                    onClick={() => router.push(`/users/${r.id}`)}
                  >
                    상세
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td className="px-3 py-10 text-center text-gray-500" colSpan={9}>
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


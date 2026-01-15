'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminApi } from '@/shared/api/adminClient';
import { getAccessToken, setAccessToken } from '@/shared/auth/tokenStore';

export default function UserDetailPage() {
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
        const res = await adminApi.get(`/admin/users/${encodeURIComponent(id)}`);
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
        <div className="text-xl font-semibold">사용자 상세</div>
        <div className="flex gap-2">
          <button
            className="rounded-md border bg-white px-3 py-2 text-sm"
            onClick={() => router.push('/users')}
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
        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <Card title="기본 정보">
            <KV k="id" v={data.id} />
            <KV k="name" v={data.name} />
            <KV k="email" v={data.email || '—'} />
            <KV k="role" v={data.role} />
            <KV k="provider" v={data.provider} />
            <KV k="createdAt" v={String(data.createdAt).slice(0, 19)} />
          </Card>

          <Card title="간병인 프로필(있으면)">
            {data.caregiverProfile ? (
              <>
                <KV k="id" v={data.caregiverProfile.id} />
                <KV k="name" v={data.caregiverProfile.name} />
                <KV k="phone" v={data.caregiverProfile.phone || '—'} />
                <KV k="isVerified" v={String(data.caregiverProfile.isVerified)} />
                <KV k="isAvailable" v={String(data.caregiverProfile.isAvailable)} />
                <KV k="rating" v={String(data.caregiverProfile.rating)} />
                <KV k="reviewCount" v={String(data.caregiverProfile.reviewCount)} />
              </>
            ) : (
              <div className="text-sm text-gray-600">없음</div>
            )}
          </Card>

          <Card title={`환자 목록 (최근 50) — ${Array.isArray(data.patients) ? data.patients.length : 0}`}>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-600">
                  <tr>
                    <th className="py-1">id</th>
                    <th className="py-1">name</th>
                    <th className="py-1">birth</th>
                    <th className="py-1">gender</th>
                    <th className="py-1">created</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.patients || []).map((p: any) => (
                    <tr key={p.id} className="border-t">
                      <td className="py-1">{p.id}</td>
                      <td className="py-1">{p.name || '—'}</td>
                      <td className="py-1">{p.birthDate || '—'}</td>
                      <td className="py-1">{p.gender || '—'}</td>
                      <td className="py-1">{String(p.createdAt).slice(0, 10)}</td>
                    </tr>
                  ))}
                  {(data.patients || []).length === 0 ? (
                    <tr>
                      <td className="py-6 text-center text-gray-500" colSpan={5}>
                        없음
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
        <div className="mt-6 text-sm text-gray-600">로딩 중…</div>
      )}
    </main>
  );
}

function Card(props: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold">{props.title}</div>
      <div className="mt-3 space-y-2">{props.children}</div>
    </section>
  );
}

function KV(props: { k: string; v: any }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-xs text-gray-600">{props.k}</div>
      <div className="text-sm font-medium">{String(props.v ?? '—')}</div>
    </div>
  );
}


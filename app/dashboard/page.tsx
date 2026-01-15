'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/shared/api/adminClient';
import { getAccessToken, setAccessToken } from '@/shared/auth/tokenStore';

export default function DashboardPage() {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace('/login');
      return;
    }
    let alive = true;
    (async () => {
      try {
        // Lightweight “관제” 첫 화면: 유저/간병인/요청/매칭 카운트 (page=1,limit=1 로 total만)
        const [users, caregivers, reqs, matches] = await Promise.all([
          adminApi.get('/admin/users?page=1&limit=1'),
          adminApi.get('/admin/caregivers?page=1&limit=1'),
          adminApi.get('/admin/care-requests?page=1&limit=1'),
          adminApi.get('/admin/matches?page=1&limit=1'),
        ]);
        if (!alive) return;
        setStats({
          users: users.data?.total ?? null,
          caregivers: caregivers.data?.total ?? null,
          careRequests: reqs.data?.total ?? null,
          matches: matches.data?.total ?? null,
        });
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
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-semibold">대시보드</div>
          <div className="mt-1 text-sm text-gray-600">
            디자인보다 “한 눈에 데이터/상태”가 보이게.
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-md border bg-white px-3 py-2 text-sm"
            onClick={() => router.push('/users')}
          >
            사용자
          </button>
          <button
            className="rounded-md border bg-white px-3 py-2 text-sm"
            onClick={() => router.push('/caregivers')}
          >
            간병인
          </button>
          <button
            className="rounded-md border bg-white px-3 py-2 text-sm"
            onClick={() => router.push('/matches')}
          >
            매칭
          </button>
          <button
            className="rounded-md border bg-white px-3 py-2 text-sm"
            onClick={() => router.push('/settings/password')}
          >
            비번 변경
          </button>
          <button
            className="rounded-md border bg-white px-3 py-2 text-sm"
            onClick={() => {
              setAccessToken(null);
              router.replace('/login');
            }}
          >
            로그아웃
          </button>
        </div>
      </div>

      {err ? (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4">
        <StatCard title="사용자" value={stats?.users} />
        <StatCard title="간병인" value={stats?.caregivers} />
        <StatCard title="간병요청" value={stats?.careRequests} />
        <StatCard title="매칭" value={stats?.matches} />
      </div>
    </main>
  );
}

function StatCard(props: { title: string; value: any }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-600">{props.title}</div>
      <div className="mt-2 text-2xl font-semibold">
        {props.value === null || props.value === undefined ? '—' : String(props.value)}
      </div>
    </div>
  );
}


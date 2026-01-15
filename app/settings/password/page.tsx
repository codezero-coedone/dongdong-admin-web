'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/shared/api/adminClient';
import { getAccessToken, setAccessToken } from '@/shared/auth/tokenStore';

export default function AdminPasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) router.replace('/login');
  }, [router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOk(null);
    setErr(null);
    setLoading(true);
    try {
      await adminApi.post('/admin/auth/change-password', {
        currentPassword,
        newPassword,
      });
      setOk('비밀번호가 변경되었습니다.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (e2: any) {
      if (e2?.response?.status === 401) {
        setAccessToken(null);
        router.replace('/login');
        return;
      }
      setErr(String(e2?.response?.data?.message || e2?.message || '변경 실패'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">비밀번호 변경</div>
        <button
          className="rounded-md border bg-white px-3 py-2 text-sm"
          onClick={() => router.push('/dashboard')}
        >
          대시보드
        </button>
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-6 w-full max-w-md rounded-lg border bg-white p-6 shadow-sm"
      >
        <label className="block">
          <div className="text-sm text-gray-700">현재 비밀번호</div>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
            required
          />
        </label>

        <label className="mt-4 block">
          <div className="text-sm text-gray-700">새 비밀번호 (최소 6자)</div>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </label>

        {ok ? (
          <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
            {ok}
          </div>
        ) : null}
        {err ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? '변경 중…' : '변경'}
        </button>
      </form>
    </main>
  );
}


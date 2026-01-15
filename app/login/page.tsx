'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/shared/api/adminClient';
import { setAccessToken } from '@/shared/auth/tokenStore';

type LoginResponse = {
  status?: string;
  message?: string;
  data?: {
    access_token?: string;
    refresh_token?: string;
    user?: { id: number; name: string; email: string | null; provider: string; role?: string };
  };
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const rawId = email.trim();
      const loginEmail = rawId.includes('@') ? rawId : `${rawId}@dongdong.admin`;
      const res = await adminApi.post<LoginResponse>('/auth/login', {
        email: loginEmail,
        password,
      });
      const token = String(res.data?.data?.access_token || '').trim();
      const role = String(res.data?.data?.user?.role || '').trim();
      if (!token) throw new Error('로그인 응답에 access_token이 없습니다.');
      if (role !== 'ADMIN') throw new Error('ADMIN 권한이 없습니다.');
      setAccessToken(token);
      router.replace('/dashboard');
    } catch (e2: any) {
      setErr(
        String(
          e2?.response?.data?.message ||
            e2?.response?.data?.error ||
            e2?.message ||
            '로그인 실패',
        ),
      );
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-lg border bg-white p-6 shadow-sm"
      >
        <div className="text-lg font-semibold">DongDong Admin</div>
        <div className="mt-1 text-sm text-gray-600">
          이메일/비밀번호로 로그인 (ADMIN 전용)
        </div>

        <div className="mt-6 space-y-3">
          <label className="block">
            <div className="text-sm text-gray-700">ID</div>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="block">
            <div className="text-sm text-gray-700">Password</div>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              type="password"
              required
            />
          </label>
        </div>

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
          {loading ? '로그인 중…' : '로그인'}
        </button>
      </form>
    </main>
  );
}


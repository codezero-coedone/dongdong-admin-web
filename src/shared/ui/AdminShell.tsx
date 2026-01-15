'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useMemo } from 'react';
import { getAccessToken, setAccessToken } from '@/shared/auth/tokenStore';

type NavItem = { href: string; label: string };

const NAV: NavItem[] = [
  { href: '/dashboard', label: '대시보드' },
  { href: '/users', label: '사용자' },
  { href: '/caregivers', label: '간병인' },
  { href: '/care-requests', label: '간병요청' },
  { href: '/matches', label: '매칭' },
  { href: '/reviews', label: '리뷰' },
  { href: '/reports', label: '신고' },
  { href: '/settings/password', label: '비번 변경' },
];

export function AdminShell(props: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!getAccessToken()) router.replace('/login');
  }, [router]);

  const activeHref = useMemo(() => {
    // treat /users/1, /matches/1 같은 상세도 메뉴 하이라이트
    if (!pathname) return '';
    const found = NAV.find((x) => pathname === x.href);
    if (found) return found.href;
    const prefix = NAV.find((x) => x.href !== '/dashboard' && pathname.startsWith(x.href + '/'));
    return prefix?.href || '';
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <aside className="w-64 shrink-0 border-r bg-white">
          <div className="px-5 py-4">
            <div className="text-base font-semibold">DongDong Admin</div>
            <div className="mt-1 text-xs text-gray-500">Backoffice</div>
          </div>
          <nav className="px-2 pb-4">
            {NAV.map((it) => {
              const active = activeHref === it.href;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={[
                    'block rounded-md px-3 py-2 text-sm',
                    active ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100',
                  ].join(' ')}
                >
                  {it.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1">
          <header className="sticky top-0 z-10 border-b bg-white">
            <div className="flex items-center justify-between gap-4 px-6 py-4">
              <div>
                <div className="text-lg font-semibold">{props.title}</div>
                {props.subtitle ? (
                  <div className="mt-1 text-sm text-gray-600">{props.subtitle}</div>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                {props.right}
                <button
                  className="rounded-md border bg-white px-3 py-2 text-sm hover:bg-gray-50"
                  onClick={() => {
                    setAccessToken(null);
                    router.replace('/login');
                  }}
                >
                  로그아웃
                </button>
              </div>
            </div>
          </header>

          <div className="px-6 py-6">{props.children}</div>
        </main>
      </div>
    </div>
  );
}


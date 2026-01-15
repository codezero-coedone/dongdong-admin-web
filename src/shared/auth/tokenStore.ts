const KEY = 'dd_admin_access_token';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = localStorage.getItem(KEY);
    return v && v.trim() ? v.trim() : null;
  } catch {
    return null;
  }
}

export function setAccessToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!token) {
      localStorage.removeItem(KEY);
      return;
    }
    localStorage.setItem(KEY, token);
  } catch {
    // ignore
  }
}


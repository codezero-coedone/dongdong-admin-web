import axios from 'axios';
import { getAccessToken } from '../auth/tokenStore';

declare const process: { env?: Record<string, string | undefined> } | undefined;

function getBaseUrl(): string {
  const envBase = process?.env?.NEXT_PUBLIC_API_URL;
  if (typeof window === 'undefined') {
    return envBase || 'http://api.dongdong.io:3000/api/v1';
  }
  // Browser/Admin Web: use same-origin proxy via Next rewrites.
  return '/api/v1';
}

export const adminApi = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

adminApi.interceptors.request.use((config) => {
  const t = getAccessToken();
  if (t) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${t}`;
  }
  return config;
});


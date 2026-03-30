import { useCallback } from 'react';
import { useAuth } from './useAuth';

export function useApi() {
  const { token, doLogout } = useAuth();

  return useCallback(
    async function api(path, opts = {}) {
      const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const r = await fetch(path, { ...opts, headers });
      if (r.status === 401) {
        doLogout();
        throw Object.assign(new Error('Unauthorized'), { status: 401 });
      }
      return r;
    },
    [token, doLogout]
  );
}

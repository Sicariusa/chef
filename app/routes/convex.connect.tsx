import { useEffect } from 'react';
import { useSearchParams } from '@remix-run/react';
import type { MetaFunction } from '@vercel/remix';
import { Spinner } from '@ui/Spinner';

export const meta: MetaFunction = () => {
  return [{ title: 'Loading | Chef' }];
};

const dashboardHost = import.meta.env.VITE_DASHBOARD_HOST || 'https://dashboard.convex.dev';
const provisioningEnabled =
  (import.meta.env.VITE_ENABLE_CONVEX_PROVISIONING ?? '').toLowerCase() === 'true';

export default function ConvexConnect() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!provisioningEnabled) {
      return;
    }
    const params = new URLSearchParams(searchParams);
    const authUrl = `${dashboardHost}/oauth/authorize/project?${params.toString()}`;
    window.location.href = authUrl;
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#f9f7ee' }}>
      {provisioningEnabled ? <Spinner /> : <p>Convex project connection is disabled.</p>}
    </div>
  );
}

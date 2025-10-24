import { useEffect } from 'react';
import { useSearchParams } from '@remix-run/react';
import type { MetaFunction } from '@vercel/remix';
import { Spinner } from '@ui/Spinner';

export const meta: MetaFunction = () => {
  return [{ title: 'Loading | Chef' }];
};

type TokenResponse =
  | {
      token: string;
      deploymentName: string;
      deploymentUrl: string;
    }
  | {
      error: string;
    };

export default function ConvexCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');

    console.log('🔐 [Callback Page] OAuth callback page loaded');
    console.log('🔐 [Callback Page] Code present:', !!code);

    if (!code) {
      console.error('🔐 [Callback Page] ❌ No code in URL, closing window');
      window.close();
      return;
    }

    console.log('🔐 [Callback Page] Calling API to exchange code...');

    // Exchange the code for a token
    fetch('/api/convex/callback?' + searchParams.toString())
      .then((response) => {
        console.log('🔐 [Callback Page] API response status:', response.status);
        return response.json();
      })
      .then((data: unknown) => {
        console.log('🔐 [Callback Page] API response data:', data);
        const tokenData = data as TokenResponse;

        if ('token' in tokenData) {
          console.log('🔐 [Callback Page] ✅ Token received, saving to localStorage...');
          localStorage.setItem('convexProjectToken', tokenData.token);
          localStorage.setItem('convexProjectDeploymentName', tokenData.deploymentName);
          localStorage.setItem('convexProjectDeploymentUrl', tokenData.deploymentUrl);
          console.log('🔐 [Callback Page] ✅ Token saved! Closing window...');
          
          // Verify it was saved
          const savedToken = localStorage.getItem('convexProjectToken');
          console.log('🔐 [Callback Page] Verification - token in localStorage:', !!savedToken);
          
          window.close();
        } else {
          console.error('🔐 [Callback Page] ❌ Failed to exchange code for token:', tokenData.error);
          alert('Failed to connect: ' + tokenData.error);
          window.close();
        }
      })
      .catch((error) => {
        console.error('🔐 [Callback Page] ❌ Error exchanging code:', error);
        alert('Error exchanging code: ' + error.message);
        window.close();
      });
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner />
    </div>
  );
}

import { Button } from '@ui/Button';

export function GetAdminTokenButton() {
  const handleClick = () => {
    console.log('🔐 [Get Admin Token] Starting OAuth flow...');
    
    const CLIENT_ID = import.meta.env.VITE_CONVEX_OAUTH_CLIENT_ID;
    const redirectUri = window.location.origin + '/convex/callback';
    const dashboardHost = import.meta.env.VITE_DASHBOARD_HOST || 'https://dashboard.convex.dev';
    
    console.log('🔐 [Get Admin Token] CLIENT_ID:', CLIENT_ID ? 'present' : 'MISSING ❌');
    console.log('🔐 [Get Admin Token] redirect_uri:', redirectUri);
    
    if (!CLIENT_ID) {
      alert('ERROR: VITE_CONVEX_OAUTH_CLIENT_ID not set in .env.local!\n\nCreate .env.local file and add:\nVITE_CONVEX_OAUTH_CLIENT_ID=your-client-id');
      return;
    }
    
    const authUrl = `${dashboardHost}/oauth/authorize/project?` + new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      redirect_uri: redirectUri,
    }).toString();
    
    console.log('🔐 [Get Admin Token] Opening OAuth popup...');
    console.log('🔐 [Get Admin Token] Full OAuth URL:', authUrl);
    console.log('🔐 [Get Admin Token] After authorizing, check localStorage.getItem("convexProjectToken")');
    
    // Copy URL to clipboard for debugging
    navigator.clipboard.writeText(authUrl).catch(() => {});
    
    // Open OAuth in a popup
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const popup = window.open(
      authUrl,
      'Convex OAuth',
      `width=${width},height=${height},left=${left},top=${top}`
    );
    
    if (!popup) {
      alert('Popup blocked! Please allow popups for this site.');
      return;
    }
    
    // Check for token every second
    const checkInterval = setInterval(() => {
      const token = localStorage.getItem('convexProjectToken');
      if (token) {
        console.log('✅ [Get Admin Token] Token received!');
        console.log('✅ [Get Admin Token] Token length:', token.length);
        console.log('✅ [Get Admin Token] Copy this token and add it to Convex Dashboard → Settings → Environment Variables as CHEF_ADMIN_ACCESS_TOKEN');
        clearInterval(checkInterval);
      }
    }, 1000);
    
    // Stop checking after 2 minutes
    setTimeout(() => clearInterval(checkInterval), 120000);
  };

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-lg bg-background-secondary">
      <div>
        <h3 className="font-semibold mb-1">Get Admin Access Token</h3>
        <p className="text-sm text-content-secondary">
          This is a one-time setup step to get your admin OAuth token for creating projects.
        </p>
      </div>
      
      <Button onClick={handleClick} variant="primary">
        🔐 Authorize & Get Token
      </Button>
      
      <div className="text-xs text-content-tertiary space-y-1">
        <p>After clicking:</p>
        <ol className="list-decimal ml-4 space-y-1">
          <li>A popup will open to Convex authorization</li>
          <li>Sign in and authorize the app</li>
          <li>Check browser console for the token</li>
          <li>Add token to Convex Dashboard as CHEF_ADMIN_ACCESS_TOKEN</li>
        </ol>
      </div>
    </div>
  );
}


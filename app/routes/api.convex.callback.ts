import { json, type LoaderFunctionArgs } from '@vercel/remix';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const CLIENT_ID = globalThis.process.env.CONVEX_OAUTH_CLIENT_ID;
  const CLIENT_SECRET = globalThis.process.env.CONVEX_OAUTH_CLIENT_SECRET;
  const PROVISION_HOST = globalThis.process.env.PROVISION_HOST || 'https://api.convex.dev';

  console.log('🔐 [OAuth Callback] Starting token exchange...');
  console.log('🔐 [OAuth Callback] Code present:', !!code);
  console.log('🔐 [OAuth Callback] CLIENT_ID present:', !!CLIENT_ID);
  console.log('🔐 [OAuth Callback] CLIENT_SECRET present:', !!CLIENT_SECRET);
  console.log('🔐 [OAuth Callback] PROVISION_HOST:', PROVISION_HOST);

  async function fetchDeploymentCredentials(
    provisionHost: string,
    projectDeployKey: string,
    deploymentType: 'prod' | 'dev',
  ) {
    const response = await fetch(`${provisionHost}/api/deployment/provision_and_authorize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Convex-Client': 'bolt-0.0.0',
        Authorization: `Bearer ${projectDeployKey}`,
      },
      body: JSON.stringify({
        // teamSlug and projectSlug are not needed since we’re using a project deploy key as an auth token
        teamSlug: null,
        projectSlug: null,
        deploymentType,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch deployment credentials');
    }

    const json = (await response.json()) as {
      deploymentName: string;
      url: string;
      adminKey: string;
    };

    return json;
  }

  if (!code) {
    console.error('🔐 [OAuth Callback] ERROR: No authorization code provided');
    return json({ error: 'No authorization code provided' }, { status: 400 });
  }

  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('🔐 [OAuth Callback] ERROR: Missing CLIENT_ID or CLIENT_SECRET');
    console.error('🔐 [OAuth Callback] Make sure CONVEX_OAUTH_CLIENT_ID and CONVEX_OAUTH_CLIENT_SECRET are set in Convex Dashboard');
    throw new Error('Missing required environment variables (CONVEX_OAUTH_CLIENT_ID, CONVEX_OAUTH_CLIENT_SECRET)');
  }

  try {
    // Get the current origin for the redirect_uri
    const origin = url.origin;
    console.log('🔐 [OAuth Callback] Origin:', origin);
    console.log('🔐 [OAuth Callback] Redirect URI:', origin + '/convex/callback');

    // Exchange the code for a token
    console.log('🔐 [OAuth Callback] Exchanging code for token...');
    const tokenResponse = await fetch(`${PROVISION_HOST}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: origin + '/convex/callback',
      }),
    });

    console.log('🔐 [OAuth Callback] Token response status:', tokenResponse.status);

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('🔐 [OAuth Callback] ❌ Token exchange failed!');
      console.error('🔐 [OAuth Callback] Status:', tokenResponse.status);
      console.error('🔐 [OAuth Callback] Error:', errorData);
      console.error('🔐 [OAuth Callback] Request URL:', `${PROVISION_HOST}/oauth/token`);
      console.error('🔐 [OAuth Callback] Client ID:', CLIENT_ID);
      console.error('🔐 [OAuth Callback] Redirect URI:', origin + '/convex/callback');

      return json({ error: `Failed to exchange code for token: ${errorData}` }, { status: 500 });
    }

    const tokenResponseJson = await tokenResponse.json();
    const tokenData = tokenResponseJson as { access_token: string; token_type: 'bearer' };
    const token = tokenData.access_token;

    console.log('🔐 [OAuth Callback] ✅ Token received (length:', token?.length, ')');
    console.log('🔐 [OAuth Callback] Fetching deployment credentials...');

    const { deploymentName, url: deploymentUrl } = await fetchDeploymentCredentials(PROVISION_HOST, token, 'dev');

    console.log('🔐 [OAuth Callback] ✅ Deployment credentials fetched');
    console.log('🔐 [OAuth Callback] Deployment name:', deploymentName);
    console.log('🔐 [OAuth Callback] Deployment URL:', deploymentUrl);

    // Return the token as JSON
    return json({ token, deploymentName, deploymentUrl });
  } catch (error) {
    console.error('🔐 [OAuth Callback] ❌ Unexpected error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}

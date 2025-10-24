import { useConvexSessionId } from '~/lib/stores/sessionId';
import { setSelectedTeamSlug, useSelectedTeamSlug } from '~/lib/stores/convexTeams';
import { useConvex, useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useChatId } from '~/lib/stores/chatId';
import { TeamSelector } from './TeamSelector';
import { Link1Icon } from '@radix-ui/react-icons';
import { Button } from '@ui/Button';

export function ConvexConnectButton() {
  const convexClient = useConvex();
  const sessionId = useConvexSessionId();
  const chatId = useChatId();
  const credentials = useQuery(api.convexProjects.loadConnectedConvexProjectCredentials, {
    sessionId,
    chatId,
  });
  const selectedTeamSlug = useSelectedTeamSlug();

  console.log('🔐 [ConvexConnectButton] Rendered');
  console.log('🔐 [ConvexConnectButton] Selected team:', selectedTeamSlug);
  console.log('🔐 [ConvexConnectButton] Button disabled?', !selectedTeamSlug);

  const handleClick = async () => {
    if (selectedTeamSlug === null) {
      console.error('❌ No team selected');
      return;
    }
    
    console.log('🔐 [Connect Button] Checking for existing OAuth token...');
    const convexOAuthToken = localStorage.getItem('convexProjectToken');
    
    if (!convexOAuthToken) {
      console.log('🔐 [Connect Button] No token found, initiating OAuth flow...');
      // Initiate OAuth flow
      const CLIENT_ID = import.meta.env.VITE_CONVEX_OAUTH_CLIENT_ID;
      const redirectUri = window.location.origin + '/convex/callback';
      const dashboardHost = import.meta.env.VITE_DASHBOARD_HOST || 'https://dashboard.convex.dev';
      
      console.log('🔐 [Connect Button] CLIENT_ID:', CLIENT_ID ? 'present' : 'MISSING');
      console.log('🔐 [Connect Button] redirect_uri:', redirectUri);
      console.log('🔐 [Connect Button] Opening OAuth popup...');
      
      const authUrl = `${dashboardHost}/oauth/authorize?` + new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID!,
        redirect_uri: redirectUri,
        scope: 'openid',
      }).toString();
      
      // Open OAuth in a popup
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      window.open(
        authUrl,
        'Convex OAuth',
        `width=${width},height=${height},left=${left},top=${top}`
      );
      
      console.log('🔐 [Connect Button] OAuth popup opened. Waiting for user to complete authorization...');
      console.log('🔐 [Connect Button] After authorizing, click Connect again to proceed.');
      return;
    }
    
    console.log('🔐 [Connect Button] ✅ Token found, provisioning project...');
    await convexClient.mutation(api.convexProjects.startProvisionConvexProject, {
      sessionId,
      chatId,
      projectInitParams: {
        teamSlug: selectedTeamSlug,
        workosAccessToken: convexOAuthToken,
      },
    });
  };
  const isLoading = credentials === undefined || credentials?.kind === 'connecting';

  return (
    <div className="flex flex-col gap-2">
      <p className="mb-2 text-sm text-content-secondary">Select a Convex team to connect your Chef app to.</p>
      <div className="flex items-center gap-2">
        <TeamSelector
          selectedTeamSlug={selectedTeamSlug}
          setSelectedTeamSlug={setSelectedTeamSlug}
          description="Your project will be created in this Convex team"
        />

        <Button
          icon={<Link1Icon />}
          loading={isLoading}
          disabled={isLoading || !selectedTeamSlug}
          onClick={handleClick}
        >
          {isLoading ? 'Connecting…' : 'Connect'}
        </Button>
      </div>
    </div>
  );
}

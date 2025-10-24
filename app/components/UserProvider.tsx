import { useEffect } from 'react';
import { setExtra, setUser } from '@sentry/remix';
import { useConvex, useQuery } from 'convex/react';
import { useConvexSessionIdOrNullOrLoading } from '~/lib/stores/sessionId';
import { useChatId } from '~/lib/stores/chatId';
import { setProfile } from '~/lib/stores/profile';
import { getConvexProfile } from '~/lib/convexProfile';
import { useLDClient, withLDProvider, basicLogger } from 'launchdarkly-react-client-sdk';
import { api } from '@convex/_generated/api';
// Auth actions moved to other components that need them
// import { useAuthActions } from '@convex-dev/auth/react';

// Conditionally wrap with LaunchDarkly provider only if client ID is available
const ldClientSideId = import.meta.env.VITE_LD_CLIENT_SIDE_ID;
export const UserProvider = ldClientSideId
  ? withLDProvider<any>({
      clientSideID: ldClientSideId,
      options: {
        logger: basicLogger({ level: 'error' }),
      },
    })(UserProviderInner)
  : UserProviderInner;

function UserProviderInner({ children }: { children: React.ReactNode }) {
  const launchdarkly = useLDClient();
  const convexMemberId = useQuery(api.sessions.convexMemberId);
  const userProfile = useQuery(api.sessions.getUserProfile);
  const sessionId = useConvexSessionIdOrNullOrLoading();
  const chatId = useChatId();
  const convex = useConvex();

  useEffect(() => {
    if (sessionId) {
      setExtra('sessionId', sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    setExtra('chatId', chatId);
  }, [chatId]);

  const tokenValue = (convex as any)?.sync?.state?.auth?.value;

  useEffect(() => {
    async function updateProfile() {
      if (userProfile) {
        launchdarkly?.identify({
          key: convexMemberId ?? '',
          email: userProfile.email ?? '',
        });
        setUser({
          id: convexMemberId ?? '',
          username: userProfile.name ?? '',
          email: userProfile.email ?? undefined,
        });

        // Get additional profile info from Convex if user has connected their Convex account
        try {
          const convexOAuthToken = localStorage.getItem('convexProjectToken');
          if (convexOAuthToken) {
            void convex.action(api.sessions.updateCachedProfile, { convexAuthToken: convexOAuthToken });
            const convexProfile = await getConvexProfile(convexOAuthToken);
            setProfile({
              username: convexProfile.name ?? userProfile.name ?? '',
              email: convexProfile.email || userProfile.email || '',
              avatar: typeof userProfile.image === 'string' ? userProfile.image : '',
              id: convexProfile.id || String(userProfile.id) || '',
            });
          } else {
            // User hasn't connected Convex account yet, use auth profile
            setProfile({
              username: typeof userProfile.name === 'string' ? userProfile.name : '',
              email: typeof userProfile.email === 'string' ? userProfile.email : '',
              avatar: typeof userProfile.image === 'string' ? userProfile.image : '',
              id: userProfile.id ? String(userProfile.id) : '',
            });
          }
        } catch (error) {
          console.error('Failed to fetch Convex profile:', error);
          // Fallback to user profile
          setProfile({
            username: typeof userProfile.name === 'string' ? userProfile.name : '',
            email: typeof userProfile.email === 'string' ? userProfile.email : '',
            avatar: typeof userProfile.image === 'string' ? userProfile.image : '',
            id: userProfile.id ? String(userProfile.id) : '',
          });
        }
      } else {
        launchdarkly?.identify({
          anonymous: true,
        });
      }
    }
    void updateProfile();
    // Including tokenValue is important here even though it's not a direct dependency
  }, [launchdarkly, userProfile, convex, tokenValue, convexMemberId]);

  return children;
}

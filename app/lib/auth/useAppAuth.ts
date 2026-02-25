import { useConvexAuth } from 'convex/react';
import { useAuth } from '@workos-inc/authkit-react';

export function useAppAuth() {
  const { isAuthenticated, isLoading: isConvexAuthLoading } = useConvexAuth();
  const { getAccessToken, signIn, signOut, isLoading: isWorkOsLoading } = useAuth();

  const isLoading = isConvexAuthLoading || isWorkOsLoading;

  return {
    isAuthenticated,
    isLoading,
    getAccessToken,
    signIn,
    signOut,
  };
}


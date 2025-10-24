import { waitForConvexSessionId } from '~/lib/stores/sessionId';
import { json } from '@vercel/remix';
import type { LoaderFunctionArgs } from '@vercel/remix';
import { useMutation, useConvex, useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Toaster } from '~/components/ui/Toaster';
import { ChefAuthProvider, useChefAuth } from '~/components/chat/ChefAuthWrapper';
import { useParams } from '@remix-run/react';
import { Loading } from '~/components/Loading';
import type { MetaFunction } from '@vercel/remix';
import { Button } from '@ui/Button';
import { ConvexError } from 'convex/values';
import { Sheet } from '@ui/Sheet';
import { useAuthActions } from '@convex-dev/auth/react';
export const meta: MetaFunction = () => {
  return [
    { title: 'Cooked with Chef' },
    {
      name: 'description',
      content: 'Someone shared with you a project cooked with Chef, the full-stack AI coding agent from Convex',
    },
    {
      property: 'og:image',
      content: 'https://chef.convex.dev/social_preview_share.png',
    },
  ];
};

export const loader = async (args: LoaderFunctionArgs) => {
  const url = new URL(args.request.url);
  let code: string | null = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (state) {
    code = null;
  }
  return json({ code });
};

export default function ShareProject() {
  return (
    <>
      <ChefAuthProvider redirectIfUnauthenticated={false}>
        <ShareProjectContent />
      </ChefAuthProvider>
      <Toaster />
    </>
  );
}

function ShareProjectContent() {
  const { signIn } = useAuthActions();
  const { shareCode } = useParams();

  if (!shareCode) {
    throw new Error('shareCode is required');
  }

  const chefAuthState = useChefAuth();
  const cloneChat = useMutation(api.share.clone);
  const getShareDescription = useQuery(api.share.getShareDescription, { code: shareCode });

  const handleCloneChat = useCallback(async () => {
    const sessionId = await waitForConvexSessionId('useInitializeChat');
    
    try {
      const { id: chatId } = await cloneChat({ shareCode, sessionId });
      window.location.href = `/chat/${chatId}`;
    } catch (e) {
      if (e instanceof ConvexError) {
        toast.error(`Error cloning chat: ${e.data.message}`);
      } else {
        toast.error('Unexpected error cloning chat');
      }
    }
  }, [cloneChat, shareCode]);

  if (chefAuthState.kind === 'loading') {
    return <Loading />;
  }

  if (chefAuthState.kind !== 'fullyLoggedIn') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 rounded-xl border bg-white p-8">
          <div className="space-y-2 text-center">
            <h1 className="text-center text-3xl font-bold">Sign in to Chef</h1>
            <p className="text-base text-gray-500">
              Please sign in to Chef to clone this project
              {getShareDescription?.description ? (
                <>
                  : <span className="font-bold">{getShareDescription.description}</span>
                </>
              ) : (
                ''
              )}
            </p>
          </div>

          <Button
            onClick={() => {
              void signIn('google');
            }}
          >
            Sign in with Google
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Sheet className="w-full max-w-md space-y-6 border p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-center font-semibold">Clone Project</h1>
          {getShareDescription?.description && <p className="text-base">{getShareDescription.description}</p>}
          <p className="text-sm text-content-secondary">
            This will create a copy of this project in your Chef account
          </p>
        </div>

        <Button
          className="flex w-full items-center justify-center gap-2 px-6 py-3"
          onClick={handleCloneChat}
        >
          Clone Project
        </Button>
      </Sheet>
    </div>
  );
}

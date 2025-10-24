import { useState } from 'react';
import { useConvexSessionIdOrNullOrLoading } from '~/lib/stores/sessionId';
import { useChatId } from '~/lib/stores/chatId';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { GetAdminTokenButton } from '~/components/convex/GetAdminTokenButton';
import { Button } from '@ui/Button';
import { Modal } from '@ui/Modal';

export function ConvexConnection() {
  const [isOpen, setIsOpen] = useState(false);

  const sessionId = useConvexSessionIdOrNullOrLoading();
  const chatId = useChatId();
  const projectInfo = useQuery(
    api.convexProjects.loadConnectedConvexProjectCredentials,
    sessionId && chatId
      ? {
          sessionId,
          chatId,
        }
      : 'skip',
  );

  return (
    <div className="relative">
      <Button
        variant="neutral"
        onClick={() => setIsOpen(true)}
        size="xs"
        className="text-xs font-normal"
        icon={<img className="size-4" height="16" width="16" src="/icons/Convex.svg" alt="Convex" />}
      >
        <ConnectionStatus projectInfo={projectInfo} />
      </Button>

      {isOpen && (
        <Modal
          title="Get Admin Access Token (One-Time Setup)"
          onClose={() => setIsOpen(false)}
        >
          <GetAdminTokenButton />
        </Modal>
      )}
    </div>
  );
}

// Simplified for getting admin token - old connected/error states removed

type ProjectInfo = (typeof api.convexProjects.loadConnectedConvexProjectCredentials)['_returnType'];

function ConnectionStatus({ projectInfo }: { projectInfo: ProjectInfo | undefined }) {
  // Simplified for admin token setup
  return <span>🔐 Get Admin Token</span>;
}

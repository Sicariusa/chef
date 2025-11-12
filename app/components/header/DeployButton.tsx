import { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { webcontainer } from '~/lib/webcontainer';
import type { WebContainer } from '@webcontainer/api';
import { useStore } from '@nanostores/react';
import { convexProjectStore } from '~/lib/stores/convexProject';
import { getFileUpdateCounter, useFileUpdateCounter } from '~/lib/stores/fileUpdateCounter';
import { toast } from 'sonner';
import { streamOutput } from '~/utils/process';
import { Spinner } from '@ui/Spinner';
import { CheckIcon, ExternalLinkIcon, RocketIcon, UpdateIcon } from '@radix-ui/react-icons';
import { Button } from '@ui/Button';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useChatId } from '~/lib/stores/chatId';
import { useConvexSessionId } from '~/lib/stores/sessionId';
import { getLocalStorage, setLocalStorage } from '~/lib/persistence/localStorage';

interface ErrorResponse {
  error: string;
}

type DeployStatus =
  | { type: 'idle' }
  | { type: 'building' }
  | { type: 'zipping' }
  | { type: 'deploying' }
  | { type: 'error'; message: string }
  | { type: 'success'; updateCounter: number; url?: string };

// Normalize URL to ensure it's a full Vercel URL
function normalizeVercelUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  
  // Remove any Convex prefixes or relative paths
  let normalized = url.trim();
  
  // If it starts with http:// or https://, check if it's a Vercel URL
  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    // Check if it contains Convex domain - if so, it's not a valid Vercel URL
    if (normalized.includes('.convex.app')) {
      // Try to extract any Vercel URL that might be embedded
      const vercelMatch = normalized.match(/https?:\/\/[^/]*\.vercel\.app[^\s]*/);
      if (vercelMatch) {
        return vercelMatch[0];
      }
      // If it's a Convex URL, return undefined
      return undefined;
    }
    
    // Check if it's already a Vercel URL
    if (normalized.includes('.vercel.app') || normalized.includes('vercel.app')) {
      return normalized;
    }
    
    // If it's not a Vercel URL and not a Convex URL, return as-is (might be a custom domain)
    return normalized;
  } else {
    // If it doesn't start with http/https, assume it's a domain and add https://
    normalized = `https://${normalized}`;
    
    // Ensure it contains vercel.app
    if (!normalized.includes('vercel.app')) {
      // If it's just a project name, add .vercel.app
      const domainMatch = normalized.match(/https?:\/\/([^/]+)/);
      if (domainMatch && !domainMatch[1].includes('.')) {
        normalized = `https://${domainMatch[1]}.vercel.app`;
      } else {
        // Otherwise, return as-is (might be a custom domain)
        return normalized;
      }
    }
  }
  
  return normalized;
}

export function DeployButton() {
  const convex = useStore(convexProjectStore);
  const currentCounter = useFileUpdateCounter();
  const chatId = useChatId();
  const sessionId = useConvexSessionId();
  const recordDeploy = useMutation(api.deploy.recordDeploy);

  const [status, setStatus] = useState<DeployStatus>({ type: 'idle' });

  const addFilesToZip = async (container: WebContainer, zip: JSZip, basePath: string, currentPath: string = '') => {
    const fullPath = currentPath ? `${basePath}/${currentPath}` : basePath;
    const entries = await container.fs.readdir(fullPath, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        await addFilesToZip(container, zip, basePath, entryPath);
      } else if (entry.isFile()) {
        const content = await container.fs.readFile(`${basePath}/${entryPath}`);
        zip.file(entryPath, content);
      }
    }
  };

  const handleDeploy = async () => {
    try {
      setStatus({ type: 'building' });
      const container = await webcontainer;

      // Run the build command
      const buildProcess = await container.spawn('vite', ['build', '--mode', 'development']);
      const { output, exitCode } = await streamOutput(buildProcess);
      if (exitCode !== 0) {
        throw new Error(`Build failed: ${output}`);
      }

      setStatus({ type: 'zipping' });
      const zip = new JSZip();
      await addFilesToZip(container, zip, 'dist');
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      setStatus({ type: 'deploying' });
      const formData = new FormData();
      formData.append('file', zipBlob, 'dist.zip');
      formData.append('deploymentName', convex!.deploymentName);
      formData.append('token', convex!.token);

      const response = await fetch('/api/deploy-simple', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse | null;
        throw new Error(errorData?.error ?? 'Deployment failed');
      }

      const resp = await response.json();
      
      // Normalize the URL to ensure it's a full Vercel URL
      const normalizedUrl = normalizeVercelUrl(resp.url);
      
      if (normalizedUrl) {
        toast.success(`Deployed successfully! Visit ${normalizedUrl}`);
      } else if (resp.localDevWarning) {
        toast.error(`${resp.localDevWarning}`);
      }

      const updateCounter = getFileUpdateCounter();
      const successStatus: DeployStatus = {
        type: 'success',
        updateCounter,
        url: normalizedUrl,
      };
      setStatus(successStatus);
      
      // Persist deployment URL to localStorage
      if (chatId && normalizedUrl) {
        setLocalStorage(`deployment_${chatId}`, {
          url: normalizedUrl,
          updateCounter,
        });
      }
      
      await recordDeploy({ id: chatId, sessionId });
    } catch (error) {
      toast.error('Failed to deploy. Please try again.');
      console.error('Deployment error:', error);
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Deployment failed' });
    }
  };

  // Restore deployment status from localStorage on mount and when chatId changes
  useEffect(() => {
    if (chatId) {
      const stored = getLocalStorage(`deployment_${chatId}`);
      if (stored?.url && stored?.updateCounter !== undefined) {
        const normalizedUrl = normalizeVercelUrl(stored.url);
        if (normalizedUrl) {
          setStatus({
            type: 'success',
            updateCounter: stored.updateCounter,
            url: normalizedUrl,
          });
          return;
        }
      }
    }
    // Only reset to idle if we don't have a valid stored deployment
    setStatus((prev) => {
      // Don't reset if we're in the middle of a deployment
      if (prev.type === 'building' || prev.type === 'zipping' || prev.type === 'deploying') {
        return prev;
      }
      return { type: 'idle' };
    });
  }, [chatId]);

  const isLoading = ['building', 'zipping', 'deploying'].includes(status.type);
  const isDisabled = isLoading || !convex;

  let buttonText: string;
  let icon: React.ReactNode;
  switch (status.type) {
    case 'idle':
      buttonText = 'Deploy';
      icon = <RocketIcon />;
      break;
    case 'building':
      buttonText = 'Building...';
      icon = <Spinner />;
      break;
    case 'zipping':
      buttonText = 'Creating package...';
      icon = <Spinner />;
      break;
    case 'deploying':
      buttonText = 'Deploying...';
      icon = <Spinner />;
      break;
    case 'error':
      buttonText = 'Deploy';
      icon = <RocketIcon />;
      break;
    case 'success': {
      if (status.updateCounter === currentCounter) {
        buttonText = 'Deployed';
        icon = <CheckIcon className="text-bolt-elements-icon-success" />;
      } else {
        buttonText = 'Redeploy';
        icon = <UpdateIcon />;
      }
      break;
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        disabled={isDisabled}
        onClick={handleDeploy}
        title={status.type === 'error' ? status.message : undefined}
        variant="neutral"
        size="xs"
        icon={icon}
        tip={(() => {
          switch (status.type) {
            case 'idle':
              return 'Click to deploy your application';
            case 'success':
              return 'Click to deploy again';
            default:
              return undefined;
          }
        })()}
      >
        {buttonText}
      </Button>
      {status.type === 'success' && status.url && (
        <Button
          href={status.url}
          target="_blank"
          size="xs"
          icon={<ExternalLinkIcon />}
        >
          View site
        </Button>
      )}
    </div>
  );
}

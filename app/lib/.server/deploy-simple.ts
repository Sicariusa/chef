import { json } from '@vercel/remix';
import type { ActionFunctionArgs } from '@vercel/remix';
import JSZip from 'jszip';

export async function deploy({ request }: ActionFunctionArgs) {
  console.log('[Deploy] Starting deployment process...');
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectName = formData.get('deploymentName') as string;

    console.log('[Deploy] Received deployment request:', {
      fileName: file?.name,
      fileSize: file?.size,
      projectName,
    });

    if (!file) {
      console.error('[Deploy] Error: No file provided');
      return json({ error: 'No file provided' }, { status: 400 });
    }

    if (!projectName) {
      console.error('[Deploy] Error: Project name is required');
      return json({ error: 'Project name is required' }, { status: 400 });
    }

    // Get Vercel token from environment
    const vercelToken = globalThis.process.env.VERCEL_TOKEN;
    if (!vercelToken) {
      console.error('[Deploy] Error: VERCEL_TOKEN not found in environment');
      return json({
        error: 'VERCEL_TOKEN environment variable is required. Get it from https://vercel.com/account/tokens and add it to your .env.local file',
      }, { status: 400 });
    }

    console.log('[Deploy] Vercel token found, proceeding with deployment');

    // Get Vercel team ID (optional, defaults to personal account)
    const vercelTeamId = globalThis.process.env.VERCEL_TEAM_ID;
    if (vercelTeamId) {
      console.log('[Deploy] Using Vercel team ID:', vercelTeamId);
    }

    // Extract zip file and prepare files for Vercel
    console.log('[Deploy] Extracting zip file...');
    const zipBuffer = await file.arrayBuffer();
    console.log('[Deploy] Zip file size:', zipBuffer.byteLength, 'bytes');
    
    const zip = await JSZip.loadAsync(zipBuffer);
    console.log('[Deploy] Zip file loaded, processing files...');
    
    // Vercel API expects files as an array: [{ file: path, data: content }]
    // Text files should be sent as strings, binary files as base64
    const files: Array<{ file: string; data: string }> = [];
    let fileCount = 0;
    let totalSize = 0;
    
    for (const [path, zipFile] of Object.entries(zip.files)) {
      if (!zipFile.dir) {
        // Vercel expects paths without leading slash
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        console.log(`[Deploy] Processing file ${fileCount + 1}: ${cleanPath}`);
        
        // Get file content as Uint8Array
        const binaryContent = await zipFile.async('uint8array');
        const contentSize = binaryContent.length;
        totalSize += contentSize;
        
        // Determine if this is a text file that should be sent as plain string
        const isTextFile = /\.(html|css|js|json|txt|xml|svg|md|mjs|ts|tsx|jsx)$/i.test(cleanPath);
        
        let fileData: string;
        if (isTextFile) {
          // For text files, decode to UTF-8 string (Vercel will handle it correctly)
          try {
            fileData = new TextDecoder('utf-8').decode(binaryContent);
            console.log(`[Deploy] File ${cleanPath} sent as UTF-8 text (${fileData.length} chars)`);
          } catch (e) {
            // Fallback to base64 if decoding fails
            console.warn(`[Deploy] Failed to decode ${cleanPath} as UTF-8, using base64`);
            fileData = Buffer.from(binaryContent).toString('base64');
          }
        } else {
          // For binary files (images, fonts, etc.), send as base64
          fileData = Buffer.from(binaryContent).toString('base64');
          console.log(`[Deploy] File ${cleanPath} sent as base64 (${contentSize} bytes)`);
        }
        
        files.push({
          file: cleanPath,
          data: fileData,
        });
        
        fileCount++;
        
        // Log every 10 files to avoid too much output
        if (fileCount % 10 === 0) {
          console.log(`[Deploy] Processed ${fileCount} files so far...`);
        }
      }
    }
    
    console.log(`[Deploy] File extraction complete: ${fileCount} files, total size: ${(totalSize / 1024).toFixed(2)} KB`);

    // Get Vercel project ID or create/link project
    const vercelProjectId = globalThis.process.env.VERCEL_PROJECT_ID;
    
    let deployUrl = 'https://api.vercel.com/v13/deployments';
    if (vercelTeamId) {
      deployUrl += `?teamId=${vercelTeamId}`;
    }

    console.log('[Deploy] Preparing deployment payload...');
    console.log('[Deploy] Project ID:', vercelProjectId || 'Not set (will create new project)');
    console.log('[Deploy] Project name:', projectName);
    console.log('[Deploy] Deployment URL:', deployUrl);

    const headers: Record<string, string> = {
      Authorization: `Bearer ${vercelToken.substring(0, 10)}...`, // Log partial token for security
      'Content-Type': 'application/json',
    };
    console.log('[Deploy] Request headers prepared');

    // Prepare deployment payload
    const deploymentPayload: Record<string, unknown> = {
      files,
      target: 'production',
    };

    if (vercelProjectId) {
      console.log('[Deploy] Using existing project:', vercelProjectId);
      deploymentPayload.project = vercelProjectId;
    } else {
      console.log('[Deploy] Creating new project with name:', projectName);
      deploymentPayload.name = projectName;
      // For new projects, Vercel requires projectSettings
      // Since we're deploying pre-built static files, configure as static site
      deploymentPayload.projectSettings = {
        framework: null,
        buildCommand: null,
        devCommand: null,
        installCommand: null,
        outputDirectory: null, // Files are already at root level
        rootDirectory: null,
      };
      console.log('[Deploy] Project settings configured for static site');
    }
    
    // Add skipAutoDetectionConfirmation to avoid framework detection prompts
    if (!vercelProjectId && vercelTeamId) {
      deployUrl += `&skipAutoDetectionConfirmation=1`;
    } else if (!vercelProjectId) {
      deployUrl += `?skipAutoDetectionConfirmation=1`;
    }

    const payloadSize = JSON.stringify(deploymentPayload).length;
    console.log('[Deploy] Payload size:', (payloadSize / 1024).toFixed(2), 'KB');
    console.log('[Deploy] Sending deployment request to Vercel...');

    const response = await fetch(deployUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${vercelToken}`, // Use full token in actual request
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deploymentPayload),
    });

    console.log('[Deploy] Vercel API response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Deploy] Vercel API error response:', errorText);
      
      let error;
      try {
        error = JSON.parse(errorText);
        console.error('[Deploy] Parsed error:', JSON.stringify(error, null, 2));
      } catch {
        error = { message: errorText || 'Deployment failed' };
        console.error('[Deploy] Could not parse error as JSON, using raw text');
      }
      
      return json({
        error: error.message || error.error?.message || 'Vercel deployment failed',
        details: error,
      }, { status: response.status });
    }

    console.log('[Deploy] Deployment successful! Parsing response...');
    const result = await response.json();
    console.log('[Deploy] Deployment result:', {
      id: result.id,
      url: result.url,
      alias: result.alias,
      name: result.name,
    });

    // Extract deployment URL from response
    const deploymentUrl = result.url || result.alias?.[0] || `https://${result.name || projectName}.vercel.app`;
    console.log('[Deploy] Final deployment URL:', deploymentUrl);

    return json({
      success: true,
      url: deploymentUrl,
      deploymentId: result.id,
      message: 'Deployment successful',
    });
  } catch (error) {
    console.error('[Deploy] Unexpected error during deployment:', error);
    console.error('[Deploy] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return json({
      error: 'Deployment failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

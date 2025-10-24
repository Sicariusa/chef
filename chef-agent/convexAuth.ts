import { generateKeyPair, exportPKCS8, exportJWK } from 'jose';
import type { ConvexProject } from './types.js';
import { queryEnvVariableWithRetries, setEnvVariablesWithRetries } from './convexEnvVariables.js';
import { logger } from './utils/logger.js';

export async function initializeConvexAuth(project: ConvexProject) {
  const CONVEX_SITE_URL = await queryEnvVariableWithRetries(project, 'CONVEX_SITE_URL');
  const JWKS = await queryEnvVariableWithRetries(project, 'JWKS');
  const JWT_PRIVATE_KEY = await queryEnvVariableWithRetries(project, 'JWT_PRIVATE_KEY');

  const newEnv: Record<string, string> = {};

  if (!CONVEX_SITE_URL) {
    newEnv.CONVEX_SITE_URL = 'http://127.0.0.1:5173';
  }

  if (!JWKS || !JWT_PRIVATE_KEY) {
    const keys = await generateKeys();
    newEnv.JWKS = JSON.stringify(keys.JWKS);
    newEnv.JWT_PRIVATE_KEY = keys.JWT_PRIVATE_KEY;
  }

  if (Object.keys(newEnv).length > 0) {
    await setEnvVariablesWithRetries(project, newEnv);
  }

  logger.info('✅ Convex Auth setup complete!');
}

async function generateKeys() {
  const { publicKey, privateKey } = await generateKeyPair('RS256', { extractable: true });

  // Export private key to PKCS#8 PEM string (already formatted by jose)
  const pemPrivateKey = await exportPKCS8(privateKey);

  // Export public key as JWK
  const publicJwk = await exportJWK(publicKey);
  const jwks = { keys: [{ use: 'sig', alg: 'RS256', ...publicJwk }] };

  return {
    JWT_PRIVATE_KEY: pemPrivateKey,
    JWKS: jwks,
  };
}

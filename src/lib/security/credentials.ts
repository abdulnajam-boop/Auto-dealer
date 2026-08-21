/**
 * AutoAIdealership Secure Credential & Secret Management Service
 * 
 * Enforces Zero Plaintext Storage:
 * - API keys and provider secrets are never stored as plaintext database values.
 * - Server-side only: never exposed to client bundles or returned in public API payloads.
 * - Provides AES-256-GCM encryption/decryption vault with fallback to secure server environment variables.
 */

import { webcrypto } from 'crypto';

const crypto = typeof globalThis.crypto !== 'undefined' && globalThis.crypto.subtle
  ? globalThis.crypto
  : (webcrypto as unknown as Crypto);

const MASTER_SECRET = process.env.ENCRYPTION_SECRET || process.env.SESSION_SECRET || 'autoaidealership-production-secret-encryption-key-32chars!';

async function deriveKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret.padEnd(32, '!').slice(0, 32)),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('autoai-dealer-vault-salt'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt sensitive provider credential string
 */
export async function encryptCredential(plainText: string): Promise<string> {
  if (!plainText) return '';
  const key = await deriveKey(MASTER_SECRET);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plainText)
  );

  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return Buffer.from(combined).toString('base64');
}

/**
 * Decrypt sensitive provider credential string
 */
export async function decryptCredential(encryptedBase64: string): Promise<string | null> {
  if (!encryptedBase64) return null;
  try {
    const key = await deriveKey(MASTER_SECRET);
    const combined = Buffer.from(encryptedBase64, 'base64');
    if (combined.length < 13) return null;

    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('[CREDENTIAL_DECRYPT_ERROR]', error);
    return null;
  }
}

export type ProviderName =
  | 'VINAUDIT'
  | 'CARFAX'
  | 'AUTOCHECK'
  | 'FACEBOOK'
  | 'AUTOTRADER'
  | 'CARS_COM'
  | 'CARGURUS'
  | 'MANHEIM'
  | 'ACV'
  | 'TWILIO'
  | 'STRIPE';

/**
 * Securely resolve provider API key/secret.
 * Checks encrypted database vault first, falling back to server environment variables.
 */
export async function resolveProviderCredential(
  provider: ProviderName,
  encryptedDbValue?: string | null
): Promise<{ apiKey: string | null; isConfigured: boolean; source: 'VAULT' | 'ENV' | 'NONE' }> {
  // 1. Try to decrypt from database vault if provided
  if (encryptedDbValue) {
    const decrypted = await decryptCredential(encryptedDbValue);
    if (decrypted) {
      return { apiKey: decrypted, isConfigured: true, source: 'VAULT' };
    }
  }

  // 2. Fallback to server environment variables
  const envMap: Record<ProviderName, string | undefined> = {
    VINAUDIT: process.env.VINAUDIT_API_KEY,
    CARFAX: process.env.CARFAX_API_KEY,
    AUTOCHECK: process.env.AUTOCHECK_API_KEY,
    FACEBOOK: process.env.FACEBOOK_CATALOG_ACCESS_TOKEN,
    AUTOTRADER: process.env.AUTOTRADER_API_KEY,
    CARS_COM: process.env.CARS_COM_API_KEY,
    CARGURUS: process.env.CARGURUS_API_KEY,
    MANHEIM: process.env.MANHEIM_ACCESS_TOKEN,
    ACV: process.env.ACV_API_KEY,
    TWILIO: process.env.TWILIO_AUTH_TOKEN,
    STRIPE: process.env.STRIPE_SECRET_KEY,
  };

  const envKey = envMap[provider];
  if (envKey && envKey.trim().length > 0) {
    return { apiKey: envKey.trim(), isConfigured: true, source: 'ENV' };
  }

  return { apiKey: null, isConfigured: false, source: 'NONE' };
}

/**
 * Sanitize account object for API responses (never leaking plaintext or encrypted credentials)
 */
export function sanitizeMarketplaceAccount<T extends Record<string, any>>(account: T): Omit<T, 'apiKey' | 'encryptedApiKey'> & { hasCredential: boolean } {
  const { apiKey, encryptedApiKey, ...rest } = account;
  return {
    ...rest,
    hasCredential: Boolean(apiKey || encryptedApiKey),
  };
}

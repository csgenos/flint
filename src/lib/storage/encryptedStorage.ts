/**
 * AES-256-GCM encrypted wrapper for Zustand persist storage.
 *
 * The key is derived via PBKDF2 from a per-installation random salt so that
 * stored data appears as opaque base64 ciphertext rather than plaintext JSON.
 * This addresses casual inspection via DevTools and generic malware scanning.
 *
 * Upgrade path for higher assurance: replace this adapter with
 * @tauri-apps/plugin-stronghold (OS keychain / hardware enclave) when
 * distributing signed production builds.
 */

import { type StateStorage } from 'zustand/middleware';

const SALT_KEY = '_flint_s';
const APP_ID = 'flint-finance-v1';
const PBKDF2_ITERATIONS = 100_000;

let _key: CryptoKey | null = null;

async function getKey(): Promise<CryptoKey> {
  if (_key) return _key;

  let saltB64 = localStorage.getItem(SALT_KEY);
  if (!saltB64) {
    const saltBytes = crypto.getRandomValues(new Uint8Array(16));
    saltB64 = btoa(String.fromCharCode(...saltBytes));
    localStorage.setItem(SALT_KEY, saltB64);
  }

  const salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(APP_ID),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  _key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  return _key;
}

async function encrypt(plaintext: string): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipherBuf = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plaintext)
  );
  const combined = new Uint8Array(12 + cipherBuf.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(cipherBuf), 12);
  return btoa(String.fromCharCode(...combined));
}

async function decrypt(cipherB64: string): Promise<string> {
  const key = await getKey();
  const combined = Uint8Array.from(atob(cipherB64), c => c.charCodeAt(0));
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: combined.slice(0, 12) },
    key,
    combined.slice(12)
  );
  return new TextDecoder().decode(decrypted);
}

export const encryptedStorage: StateStorage = {
  getItem: async (name) => {
    const raw = localStorage.getItem(name);
    if (!raw) return null;
    try {
      return await decrypt(raw);
    } catch {
      // Graceful fallback: return raw value (handles migration from plaintext).
      return raw;
    }
  },
  setItem: async (name, value) => {
    localStorage.setItem(name, await encrypt(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

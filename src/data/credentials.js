// Credentials System — Stream-specific one-time-use login codes
// Stored in localStorage, each code can only be used once and is tied to a stream.
import { STREAMS } from './streams';

const CREDENTIALS_KEY = 'via_credentials';

function generateCode(prefix) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let part1 = '', part2 = '';
  for (let i = 0; i < 4; i++) {
    part1 += chars[Math.floor(Math.random() * chars.length)];
    part2 += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-${part1}-${part2}`;
}

/**
 * Initialize 100 unique credentials in localStorage across 9 streams:
 * 20 for Software Development (SWE), 10 for each of the other 8 streams.
 */
export function initializeCredentials() {
  const existing = localStorage.getItem(CREDENTIALS_KEY);
  if (existing) return JSON.parse(existing);

  const credentials = [];
  const usedCodes = new Set();
  let currentId = 1;

  // Configuration for initial load: 20 for SWE, 10 for others
  const initialSetup = [
    { streamId: 'SWE', count: 20 },
    { streamId: 'DAI', count: 10 },
    { streamId: 'QAT', count: 10 },
    { streamId: 'CYB', count: 10 },
    { streamId: 'UIX', count: 10 },
    { streamId: 'BAL', count: 10 },
    { streamId: 'SAM', count: 10 },
    { streamId: 'HRD', count: 10 },
    { streamId: 'FIN', count: 10 },
  ];

  initialSetup.forEach(({ streamId, count }) => {
    const stream = STREAMS[streamId];
    let created = 0;
    while (created < count) {
      const code = generateCode(stream.prefix);
      if (!usedCodes.has(code)) {
        usedCodes.add(code);
        credentials.push({
          id: currentId++,
          code,
          streamId,
          status: 'available', // 'available' | 'used'
          usedBy: null,
          usedAt: null,
          scoreObtained: null, // Storing final marks
          scoreTotal: null,
        });
        created++;
      }
    }
  });

  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
  return credentials;
}

/**
 * Get all credentials
 */
export function getCredentials() {
  const data = localStorage.getItem(CREDENTIALS_KEY);
  if (!data) return initializeCredentials();
  return JSON.parse(data);
}

/**
 * Validate a credential code. Returns { valid, message, credential }
 */
export function validateCredential(code) {
  const credentials = getCredentials();
  const cleanCode = code.trim().toUpperCase();
  const credential = credentials.find(c => c.code.toUpperCase() === cleanCode);

  if (!credential) {
    return { valid: false, message: 'Invalid credential code.' };
  }

  if (credential.status === 'used') {
    return { valid: false, message: 'This credential has already been used.' };
  }

  return { valid: true, message: 'Valid credential.', credential };
}

/**
 * Mark a credential as used, store candidate name, timestamp, and default placeholders
 */
export function markCredentialUsed(code, candidateName) {
  const credentials = getCredentials();
  const cleanCode = code.trim().toUpperCase();
  const index = credentials.findIndex(c => c.code.toUpperCase() === cleanCode);

  if (index !== -1) {
    credentials[index].status = 'used';
    credentials[index].usedBy = candidateName;
    credentials[index].usedAt = new Date().toISOString();
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
  }
}

/**
 * Update candidate marks in credentials store (for settings overview)
 */
export function updateCredentialScore(code, score, total) {
  const credentials = getCredentials();
  const cleanCode = code.trim().toUpperCase();
  const index = credentials.findIndex(c => c.code.toUpperCase() === cleanCode);

  if (index !== -1) {
    credentials[index].scoreObtained = score;
    credentials[index].scoreTotal = total;
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
  }
}

/**
 * Generate extra credentials for a specific stream (admin action)
 */
export function generateStreamCredentials(streamId, count) {
  const stream = STREAMS[streamId];
  if (!stream) return [];

  const credentials = getCredentials();
  const usedCodes = new Set(credentials.map(c => c.code));
  let currentId = credentials.length > 0 ? Math.max(...credentials.map(c => c.id)) + 1 : 1;

  let created = 0;
  while (created < count) {
    const code = generateCode(stream.prefix);
    if (!usedCodes.has(code)) {
      usedCodes.add(code);
      credentials.push({
        id: currentId++,
        code,
        streamId,
        status: 'available',
        usedBy: null,
        usedAt: null,
        scoreObtained: null,
        scoreTotal: null,
      });
      created++;
    }
  }

  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
  return credentials;
}

/**
 * Regenerate all credentials (admin reset action)
 */
export function regenerateCredentials() {
  localStorage.removeItem(CREDENTIALS_KEY);
  return initializeCredentials();
}

/**
 * Get credential stats
 */
export function getCredentialStats() {
  const credentials = getCredentials();
  return {
    total: credentials.length,
    available: credentials.filter(c => c.status === 'available').length,
    used: credentials.filter(c => c.status === 'used').length,
  };
}

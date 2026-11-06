import crypto from 'crypto';

const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'AdminNB#2026!';
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'nb_super_secure_secret_key_bangladesh_2026_handmade';

export interface AdminSession {
  username: string;
  role: string;
  exp: number;
}

/**
 * Signs a payload with HMAC-SHA256
 */
export function createToken(payload: { username: string; role: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 hours
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');

  return `${header}.${body}.${signature}`;
}

/**
 * Verifies a token and returns session if valid and not expired
 */
export function verifyToken(token: string): AdminSession | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');

    if (signature !== expectedSig) return null;

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8')) as AdminSession;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Validates login credentials
 */
export function validateCredentials(user: string, pass: string): boolean {
  return user === ADMIN_USER && pass === ADMIN_PASS;
}

/**
 * Extracts and verifies the admin session from request cookies or headers
 */
export function verifyAdminSession(request: Request): AdminSession | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k, decodeURIComponent(v.join('='))];
    })
  );

  const token = cookies['nb_admin_token'] || request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;

  return verifyToken(token);
}

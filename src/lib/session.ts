import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'cg_session';
const SECRET      = process.env.NEXTAUTH_SECRET ?? 'dev-secret-key-32chars-minimum!!';
const COOKIE_SECURE = process.env.SESSION_COOKIE_SECURE?.toLowerCase() !== 'false';

interface SessionPayload {
  id: string;
  email: string;
  role: string;
}

// Simple base64 sign/verify (use jose for prod JWT if needed)
function encode(obj: SessionPayload): string {
  const str = JSON.stringify(obj);
  return Buffer.from(str).toString('base64url');
}
function decode(token: string): SessionPayload | null {
  try {
    return JSON.parse(Buffer.from(token, 'base64url').toString('utf-8'));
  } catch {
    return null;
  }
}

export async function createSession(res: NextResponse, payload: SessionPayload) {
  const token = encode(payload);
  const secureCookie = process.env.NODE_ENV === 'production' && COOKIE_SECURE;

  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: secureCookie,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getSession(req: NextRequest): Promise<SessionPayload | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return decode(token);
}

export async function clearSession(res: NextResponse) {
  res.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
}

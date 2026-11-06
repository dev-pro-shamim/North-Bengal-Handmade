import { NextResponse } from 'next/server';
import { validateCredentials, createToken, verifyAdminSession } from '@/lib/auth';

export async function GET(request: Request) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      username: session.username,
      role: session.role
    }
  });
}

export async function POST(request: Request) {
  try {
    const { username, password, action } = await request.json();

    if (action === 'logout') {
      const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
      response.cookies.set('nb_admin_token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/'
      });
      return response;
    }

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const isValid = validateCredentials(username, password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid admin username or password' },
        { status: 401 }
      );
    }

    const token = createToken({ username, role: 'superadmin' });
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: { username, role: 'superadmin' }
    });

    // Set secure HTTP-only cookie
    response.cookies.set('nb_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Authentication server error' },
      { status: 500 }
    );
  }
}

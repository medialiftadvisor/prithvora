import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    return NextResponse.json({
      session,
      rawUser: session?.user ? {
        id: (session.user as any).id,
        role: (session.user as any).role,
        email: session.user.email,
        name: session.user.name
      } : null
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

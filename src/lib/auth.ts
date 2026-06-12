import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const isEmailAdmin = credentials.email.includes('admin');
        const defaultName = credentials.email.split('@')[0];

        try {
          // Try to find the user
          const user = await db.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            // No auto-creation! Users must register before logging in.
            return null;
          }

          if (user.password !== credentials.password) {
            // Check password match
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.warn('Database connection failed. Falling back to local development memory mock login:', error);
          
          // Fallback user details for dev/local environments
          return {
            id: isEmailAdmin ? 'mock-admin-id' : 'mock-user-id',
            name: defaultName.charAt(0).toUpperCase() + defaultName.slice(1),
            email: credentials.email,
            role: isEmailAdmin ? 'ADMIN' : 'USER',
          };
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'prithvora_secret_key_123',
};

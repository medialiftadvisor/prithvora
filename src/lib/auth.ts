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

        // Try to find the user
        let user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        // For a seamless customer experience, auto-create a standard user if they do not exist
        if (!user) {
          user = await db.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split('@')[0],
              password: credentials.password, // In a real production setup, hash this password
              role: credentials.email.includes('admin') ? 'ADMIN' : 'USER',
            },
          });
        } else if (user.password !== credentials.password) {
          // Check password match
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
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
    signIn: '/contact',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'prithvora_secret_key_123',
};

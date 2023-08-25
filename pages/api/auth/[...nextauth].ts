import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { compare } from 'bcrypt';
import prismadb from '@/lib/prismadb';

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }), //github auth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }), //google auth

    Credentials({ // next auth
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'passord'
        }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        } // verifico si mandaron credenciaes

        const user = await prismadb.user.findUnique({ where: {
          email: credentials.email
        }}); //traingo user con email que concuerde

        if (!user || !user.hashedPassword) {
          throw new Error('Email does not exist');
        } // veo si el user existe

        const isCorrectPassword = await compare(credentials.password, user.hashedPassword); //veo si el passord es correcto!!

        if (!isCorrectPassword) {
          throw new Error('Incorrect password');
        } // sino es correcto, tiro error

        return user; //finalmente, devuelvo el user si todo estuvo melo
      }
    })
  ],
  pages: {
    signIn: '/auth'
  }, // auth page
  debug: process.env.NODE_ENV === 'development', // el debugging sólo ser verá en modo development
  adapter: PrismaAdapter(prismadb),
  session: { strategy: 'jwt' }, // estrategia para manter la sesion
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET
});
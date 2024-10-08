import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LineProvider from "next-auth/providers/line";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail, signInWithCredentials, signInWithOauth } from "./actions/authAction";

export const nextauthOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin", // app/signin
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await signInWithCredentials({
          email: credentials?.email,
          password: credentials?.password,
        });

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      // console.log({account, profile})
      if (account?.type === "oauth" && profile) {
        return await signInWithOauth({ account, profile });
      }
      return true;
    },
    async jwt({ token, trigger, session }) {
      // console.log({token})
      console.log({trigger, session})
      if (token.email) {
        const user = await getUserByEmail({ email: token.email });
        // console.log({user})
        token.name = user.name;
        token._id = user._id;
        token.role = user.role;
        token.provider = user.provider;
      }
      return token;
    },
    async session({ session, token }) {
      // console.log({session, token})
      return {
        ...session,
        user: {
          ...session.user,
          name: token.name,
          _id: token._id,
          role: token.role,
          provider: token.provider,
        },
      };
    },
  },
};

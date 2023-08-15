import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import knex from "@/src/knex/knex";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.JWT_SECRET,
  callbacks: {
    async signIn({ user }) {
      // If user does not exist, create a new user and store into database
      if (user) {
        const foundUser = await knex("users")
          .select("id")
          .where({
            email: user.email,
          })
          .first();
        if (foundUser) {
          return true;
          // Create a new user and store into database
        } else {
          await knex("users").insert({
            email: user.email,
            name: user.name,
            image: user.image,
          });
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      // SELECT id FROM users WHERE email = user.email
      if (user) {
        const res = await knex("users")
          .select("id")
          .where({
            email: user.email,
          })
          .first();
        // Adding user ID to the token
        if (res) {
          token.userId = res.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.userId = token.userId as number | null | undefined;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);

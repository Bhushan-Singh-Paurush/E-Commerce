import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connection } from "./DB_Connection";
import { zSchema } from "./zodSchema";
import User from "@/models/user.model";
import { SignJWT } from "jose";
import { sendMail } from "./mailSender";
import { emailVerificationLink } from "@/templates/emailVerificationLink";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoutes";
import GoogleProvider from "next-auth/providers/google";

export const nextOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const validationSchema = zSchema.pick({
          email: true,
          password: true,
        });

        const vaildData = validationSchema.safeParse(credentials);

        if (!vaildData.success) throw new Error("Missing or invalid input");

        const { email, password } = vaildData.data;

        try {
          await connection();

          const user = await User.findOne({ deletedAt: null, email }).select(
            "+password"
          );

          if (!user) throw new Error("User not found");

          if (!user.isEmailVerified) {
            const secret = new TextEncoder().encode(process.env.SECRET);

            const token = await new SignJWT({ userId: user._id.toString() })
              .setIssuedAt()
              .setExpirationTime("1h")
              .setProtectedHeader({ alg: "HS256" })
              .sign(secret);

            const link = `${process.env.NEXT_PUBLIC_URL}/auth/verify-email/${token}`;

            await sendMail({
              subject: "Emial verification mail",
              reciver: email,
              body: emailVerificationLink({ link }),
            });

            throw new Error(
              "Please verify your email. We send an verification link on your email"
            );
          }

          const validPassword = await user.comparePassword(password);

          if (!validPassword)
            throw new Error("Password mismatched Please re-try");

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.avatar?.url || "",
            role: user.role,
          };
        } catch (error) {
          throw new Error((error as Error).message || "Internal server error");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account ,trigger ,session }) {
      if (user) {
        //if login through google
        if (account?.provider === "google") {
          await connection();

          //check user
          let checkUser = await User.findOne({ email: user.email });

          if (!checkUser) {
            //create user if not present
            checkUser = await User.create({
              name: user.name,
              email: user.email,
              password: "google",
              avatar: { url: user.image || "" },
              isEmailVerified: true,
            });
          }
          //put the id of existing user

          token.id = checkUser._id.toString();
          token.role = checkUser.role;
          token.name = checkUser.name;
          token.email = checkUser.email;
          token.picture = checkUser.avatar?.url || "";

          //login through credentials then we return id this id is put into token
        } else {
          token.id = user.id;
          token.role = user.role;
          token.name = user.name;
          token.email = user.email;
          token.picture = user.image;
        }
      }

      if (trigger === "update" && session) {

        token.id = session.id ?? token.id;
        token.name = session.name ?? token.name;
        token.email = session.email ?? token.email;
        token.role = session.role ?? token.role;
        token.picture = session.image ?? token.picture; // session.image is from frontend update
      }
      return token;
    },

    async session({ token, session }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role as string;
        session.user.image = token.picture;
      }

      return session;
    },
  },

  pages: {
    signIn: WEBSITE_LOGIN,
    error: WEBSITE_LOGIN,
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
};

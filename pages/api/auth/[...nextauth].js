import bcryptjs from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../models/User";
import db from "../../../utils/db";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
    callbacks: {
        async jwt({ token, user }) {
            if (user?.userName) token.userName = user.userName;
            if (user?.firstName) token.firstName = user.firstName;
            if (user?.lastName) token.lastName = user.lastName;
            if (user?.email) token.email = user.email;
            if (user?._id) token._id = user._id;
            if (user?.isAdmin) token.isAdmin = user.isAdmin;

            return token;
        },
        async session({ session, token }) {
            await db.connect();
            const user = await User.findOne({ email: token.email }).lean();
            await db.disconnect();

            session.user.userName = user.userName;
            session.user.firstName = user.firstName;
            session.user.lastName = user.lastName;
            session.user.email = user.email;
            session.user._id = user._id;
            session.user.isAdmin = user.isAdmin;
            session.user.provider = user.provider;

            return session;
        },
        async signIn(user) {
            if (user.account.provider === "google") {
                await db.connect();
                let existingUser = await User.findOne({
                    email: user?.user?.email,
                });

                if (!existingUser) {
                    const nameArray = user?.user?.name.split(" ");
                    const newUser = new User({
                        firstName: nameArray[0],
                        lastName: nameArray[nameArray.length - 1],
                        userName: nameArray.join(""),
                        email: user?.user?.email,
                        password: bcryptjs.hashSync(
                            Math.random().toString(36).slice(2)
                        ),
                        isAdmin: false,
                        provider: "google",
                    });

                    await newUser.save();

                    await db.disconnect();
                    return {
                        email: newUser.email,
                        userName: newUser.userName,
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,
                        _id: newUser._id,
                        isAdmin: newUser.isAdmin,
                    };
                } else {
                    await db.disconnect();
                    return {
                        email: existingUser.email,
                        userName: existingUser.userName,
                        firstName: existingUser.firstName,
                        lastName: existingUser.lastName,
                        _id: existingUser._id,
                        isAdmin: existingUser.isAdmin,
                    };
                }
            }

            return true;
        },
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        CredentialsProvider({
            async authorize(credentials) {
                await db.connect();
                const user = await User.findOne({
                    email: credentials.email,
                });
                await db.disconnect();
                if (
                    user &&
                    bcryptjs.compareSync(credentials.password, user.password)
                ) {
                    return {
                        userName: user.userName,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        _id: user._id,
                        isAdmin: user.isAdmin,
                    };
                }
                throw new Error("Invalid email or password");
            },
        }),
    ],
    secret: process.env.NEXT_PUBLIC_SECRET,
    session: {
        strategy: "jwt",
        jwt: true,
        maxAge: 30 * 24 * 60 * 60,
    },
});

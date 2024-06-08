import type { NextAuthConfig } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userExists = async (email: string) => {
	const user = await prisma.user.findFirst({
		where: { email },
	});
	return user ? true : false;
};

export default {
	providers: [],
	pages: {
		signIn: "/sign-in",
		error: "/error",
		signOut: "/sign-in",
	},
	callbacks: {
		async signIn({ account, user, credentials, email, profile }) {
			console.log("profile: ", profile);
			console.log("account: ", account);
			console.log("user: ", user);
			console.log("email: ", email);
			console.log("credentials: ", credentials);

			if (["google", "nodemailer", "resend"].includes(account.provider)) {
				const emailToCheck = profile?.email || account?.providerAccountId;
				if (emailToCheck) {
					if (!(await userExists(emailToCheck))) {
						return "/error?error=AccessDenied";
					}
				}
			}

			return true;
		},
		authorized({ auth, request: { nextUrl } }) {
			console.log("auth: ", auth);

			const isLoggedIn = !!auth?.user;

			console.log("isLoggedIn: ", isLoggedIn);

			return isLoggedIn;
		},
		async jwt({ token, user }) {
			if (user) {
				token.role = user.role; // Assign role to the token
			}
			return token;
		},
		async session({ session, token }) {
			session.user.role = token.role as string; // Make role available on session
			return session;
		},
	},
	debug: true,
} satisfies NextAuthConfig;

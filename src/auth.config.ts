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
		signIn: "/auth/sign-in",
		error: "/auth/error",
	},
	callbacks: {
		async signIn({ account, user, credentials, email, profile }) {
			if (["google", "nodemailer", "resend"].includes(account.provider)) {
				const emailToCheck = profile?.email || account?.providerAccountId;
				if (emailToCheck) {
					if (!(await userExists(emailToCheck))) {
						return "/auth/error?error=AccessDenied";
					}
				} else {
					return "/auth/error?error=AccessDenied";
				}
			}

			return true;
		},
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;
			const { pathname } = nextUrl;
			if (isLoggedIn) {
				const { user } = auth;
				const isStaffRoute = pathname.startsWith("/staff");
				const isInvigilatorRoute = pathname.startsWith("/invigilator");
				if (["admin", "staff"].includes(user.role) && isStaffRoute)
					return true;
				if (["invigilator"].includes(user.role) && isInvigilatorRoute)
					return true;
			}
			return false;
		},
		async jwt({ token, user }) {
			console.log("user: ", user);

			if (user) {
				token.role = user.role; // Assign role to the token
			}
			return token;
		},
		async session({ session, token }) {
			console.log("token: ", token);

			session.user.role = token.role as string; // Make role available on session
			return session;
		},
	},
	debug: true,
} satisfies NextAuthConfig;

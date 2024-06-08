import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient, User } from "@prisma/client";
import authConfig from "@/auth.config";
import Nodemailer from "next-auth/providers/nodemailer";
import Google from "next-auth/providers/google";
import { sendVerificationRequest } from "./lib/authSendRequest";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcrypt";

async function getUser(email: string): Promise<User | undefined> {
	try {
		return prisma.user.findFirst({
			where: { email },
		});
	} catch (error) {
		console.error("Failed to fetch user:", error);
		throw new Error("Failed to fetch user.");
	}
}

async (email: string) => {
	const user = await prisma.user.findFirst({
		where: { email },
	});
	return user ? true : false;
};

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
	...authConfig,
	adapter: PrismaAdapter(prisma),
	providers: [
		Google,
		Nodemailer({
			server: {
				host: process.env.EMAIL_SERVER_HOST,
				port: process.env.EMAIL_SERVER_PORT,
				auth: {
					user: process.env.EMAIL_SERVER_USER,
					pass: process.env.EMAIL_SERVER_PASSWORD,
				},
			},
			from: process.env.EMAIL_FROM,
			sendVerificationRequest,
		}),
		Credentials({
			async authorize(credentials) {
				const parsedCredentials = z
					.object({
						email: z.string().email(),
						password: z.string().min(6),
					})
					.safeParse(credentials);

				if (parsedCredentials.success) {
					const { email, password } = parsedCredentials.data;
					const user = await getUser(email);
					if (!user) return null;
					const passwordsMatch = await bcrypt.compare(
						password,
						user.password,
					);

					delete user.password;

					if (passwordsMatch) return user;
				}

				console.log("Invalid credentials");
				return null;
			},
		}),
	],
	session: { strategy: "jwt" },
});

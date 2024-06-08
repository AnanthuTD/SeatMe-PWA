// next-auth.d.ts
import NextAuth, { type DefaultSession } from "next-auth";
import { DefaultUser } from "next-auth";

// Extend the User type to match Prisma schema
declare module "next-auth" {
	interface User extends DefaultUser {
		phone?: bigint;
		password?: string;
		designation?: string;
		departmentCode?: string;
		role?: string;
		createdAt?: Date;
		updatedAt?: Date;
	}

	interface Session {
		user: User & DefaultSession["user"];
	}
}

"use server";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

interface FormData {
	provider: "google" | "resend" | "nodemailer" | "credentials";
	email?: string | null;
	password?: string | null;
}
export async function authenticate(
	prevState: string | undefined,
	formData: FormData,
) {
	try {
		const { provider } = formData;

		if (!provider) {
			throw new Error("Provider is required");
		}

		switch (provider) {
			case "credentials":
				await signIn("credentials", {
					redirect: false,
					email: formData.email,
					password: formData.password,
				});
				break;
			case "google":
				await signIn("google");
				break;
			case "resend":
				await signIn("resend", formData);
				break;
			case "nodemailer":
				await signIn("nodemailer", formData);
				break;
			default:
				throw new Error("Unsupported provider");
		}
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return "Invalid credentials.";
				default:
					return "Something went wrong.";
			}
		}
		throw error;
	}
}

export async function LogOut() {
	"use server";
	await signOut();
}

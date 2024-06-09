"use server";
import { signIn } from "@/auth";
import { PasswordNotSetError } from "@/lib/errors/authError";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { handlePasswordCreation } from "./createPassword";
import { isRedirectError } from "next/dist/client/components/redirect";

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
		console.error("Error from actions: " + JSON.stringify(error));
		if (isRedirectError(error)) throw error;
		if (error instanceof PasswordNotSetError) {
			return handlePasswordCreation({ email: formData.email });
		} else if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return "Invalid credentials.";
				case "CallbackRouteError":
					return "CallbackRouterError";
				default:
					return "Something went wrong.";
			}
		}
	}
}

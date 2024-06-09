import { AuthError } from "next-auth";

export class PasswordNotSetError extends AuthError {
	static type = "InvalidEmailPassword";
	code = "password_not_set";
	message = "Password not set";
	static cause = "First time login using credentials";
	name = "PasswordNotSetError";
}

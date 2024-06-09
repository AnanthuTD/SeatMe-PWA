"use server";

import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export const handlePasswordCreation = async ({ email }: { email: string }) => {
	try {
		const token = await createPasswordToken({ email });
		await sendPasswordCreationEmail({ email, token });
	} catch (error) {
		console.error("Failed to send password creation email:", error);
		redirect(
			"/auth/create-password/status?email=" +
				email +
				"&error=" +
				error.message,
		);
	}
	redirect("/auth/create-password/status?email=" + email);
};

const transporter = nodemailer.createTransport({
	service: "Gmail",
	auth: {
		user: process.env.EMAIL_SERVER_USER,
		pass: process.env.EMAIL_SERVER_PASSWORD,
	},
});

const sendPasswordCreationEmail = async ({ email, token }) => {
	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: email,
		subject: "Create Your Password",
		html: `<p>Please click the link below to create your password:</p>
              <p><a href="${process.env.FRONTEND_URL}/auth/create-password?token=${token}">Create Password</a></p>`,
	};

	await transporter.sendMail(mailOptions);
};

const createPasswordToken = async ({ email }) => {
	const payload = { email };
	const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
	const expires = dayjs().add(1, "h").toDate();
	await prisma.verificationToken.create({
		data: { identifier: email, token, expires },
	});
	return token;
};

class ValidateTokenError extends Error {
	name: "ValidateTokenError";
	message: string;
}

export const validateToken = async (token: string) => {
	const payload = jwt.verify(token, process.env.JWT_SECRET);
	const { email } = payload as { email: string };
	const verificationToken = await prisma.verificationToken.findFirst({
		where: { identifier: email, token },
	});
	if (verificationToken) {
		return email;
	} else {
		throw new ValidateTokenError("Token already consumed!");
	}
};

export const validatePassword = (password: string) => {
	const minLength = 8;
	const hasNumber = /\d/;
	const hasLetter = /[a-zA-Z]/;
	const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

	return (
		password.length >= minLength &&
		hasNumber.test(password) &&
		hasLetter.test(password) &&
		hasSpecialChar.test(password)
	);
};

export const setPassword = async (token: string, password: string) => {
	if (!password || !token || !validatePassword(password))
		throw new Error("Invalid password");
	const email = await validateToken(token);
	/* const user = await prisma.user.findFirst({ where: { email } });
	if (user.password) throw new Error("Password already exists!"); */
	await prisma.user.update({
		where: { email },
		data: { password },
	});
	prisma.verificationToken.deleteMany({ where: { identifier: email } });
	return true;
};

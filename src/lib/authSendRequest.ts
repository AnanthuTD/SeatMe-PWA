import { createTransport } from "nodemailer";
import { PrismaClient } from "@prisma/client";
import { NextURL } from "next/dist/server/web/next-url";

const prisma = new PrismaClient();

const userExists = async (email: string) => {
	const user = await prisma.user.findFirst({
		where: { email },
	});
	return user;
};

export async function sendVerificationRequest(params) {
	const { identifier, provider, theme } = params;
	let { url }: { url: NextURL } = params;
	const user = await userExists(identifier);
	url = new NextURL(url);
	if (user) {
		console.log("url: " + url);

		let callbackUrl = new NextURL(url.searchParams.get("callbackUrl"));
		console.log(callbackUrl);

		if (callbackUrl) {
			const innerCallbackUrl = callbackUrl.searchParams.get("callbackUrl");
			console.log("innerCallbackUrl: " + innerCallbackUrl);

			if (innerCallbackUrl) {
				url.searchParams.set("callbackUrl", innerCallbackUrl);
				callbackUrl = new NextURL(innerCallbackUrl);
			}
		}

		const { role } = user;
		if (["invigilator"].includes(role)) {
			if (callbackUrl.pathname.startsWith("/staff")) {
				callbackUrl.pathname = "/invigilator";
			}
		}
	}

	const { host, origin } = url;
	console.log(origin);

	const transport = createTransport(provider.server);
	const result = await transport.sendMail({
		to: identifier,
		from: provider.from,
		subject: `Sign in to ${host}`,
		text: text({ url: url.toString(), host }),
		html: html({ url: url.toString(), host, theme, origin }),
	});
	const failed = result.rejected.concat(result.pending).filter(Boolean);
	if (failed.length) {
		throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
	}
}

function html(params: {
	url: string;
	host: string;
	theme: Theme;
	origin: string;
}) {
	const { url, host, theme, origin } = params;

	const escapedHost = host.replace(/\./g, "&#8203;.");

	const brandColor = theme.brandColor || "#346df1";
	const color = {
		background: "#f9f9f9",
		text: "#444",
		mainBackground: "#fff",
		buttonBackground: brandColor,
		buttonBorder: brandColor,
		buttonText: theme.buttonText || "#fff",
	};

	const logoUrl = `${origin}/seatme.svg`; // Replace with your logo URL

	return `
<body style="background: ${color.background}; margin: 0; padding: 0;">
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <img src="${logoUrl}" alt="SeatMe Logo" style="max-width: 150px;"/>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Sign in to <a><strong style="color: rgb(52,109,241);">SeatMe</strong></a>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}">
              <a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">
                Sign in
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url, host }: { url: string; host: string }) {
	return `Sign in to SeatMe\n${url}\n\nIf you did not request this email you can safely ignore it.`;
}

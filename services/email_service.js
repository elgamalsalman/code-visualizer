import fs from "fs";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	service: "gmail",
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: process.env.EMAIL_CLIENT_ADDRESS,
		pass: process.env.EMAIL_CLIENT_SECRET,
	},
});

const send_email = async (receivers, subject, text, html) => {
	const info = await transporter.sendMail({
		from: {
			name: "Algoview",
			address: process.env.EMAIL_CLIENT_ADDRESS,
		},
		to: receivers,
		subject,
		text,
		html,
	});

	console.log("Email sent: %s", info.messageId);
};

const general_email_verification_html = fs
	.readFileSync("./assets/emails/email_verification.html")
	.toString();
const send_email_verification = async (email, name, link) => {
	const html = general_email_verification_html
		.replaceAll("{{email}}", email)
		.replaceAll("{{name}}", name)
		.replaceAll("{{link}}", link);
	await send_email(
		email,
		"Verify Your Algoview Email",
		"Verify your Algoview account to get visualizing!",
		html
	);
};

export { send_email, send_email_verification };

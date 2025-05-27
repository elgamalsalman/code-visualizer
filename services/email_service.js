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
	console.log("Email sent to: ", receivers);
};

const general_email_verification_html = fs
	.readFileSync("./assets/emails/email_verification.html")
	.toString();
const send_email_verification_email = async (email, name, link) => {
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

const password_reset_email_html_template = fs
	.readFileSync("./assets/emails/password_reset.html")
	.toString();
const send_password_reset_email = async (email, name, link) => {
	const html = password_reset_email_html_template
		.replaceAll("{{email}}", email)
		.replaceAll("{{name}}", name)
		.replaceAll("{{link}}", link);
	await send_email(
		email,
		"Reset Your Algoview Password!",
		"Reset Your Algoview Password!",
		html
	);
};

export { send_email, send_email_verification_email, send_password_reset_email };

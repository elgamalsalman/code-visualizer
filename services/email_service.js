import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
	service: "gmail",
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: process.env.EMAIL_CLIENT_ADDRESS,
		pass: process.env.EMAIL_CLIENT_SECRET,
	},
});

transporter.verify((error, success) => {
	if (error) {
		console.log(error);
	} else {
		console.log("email service ready");
	}
});

const sendEmail = async () => {
	const info = await transporter.sendMail({
		from: {
			name: "Algoview",
			address: process.env.EMAIL_CLIENT_ADDRESS,
		},
		to: ["se2422@nyu.edu"],
		subject: "Verify Your Account",
		text: "Hello world?",
		html: "<b>Hello world?</b>",
	});

	console.log("Email sent: %s", info.messageId);
};

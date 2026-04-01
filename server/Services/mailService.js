const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	service: process.env.EMAIL_SERVICE || 'gmail',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

const sendInvitationEmail = async (email, boardTitle) => {
	const clientUrl = process.env.CLIENT_URL || 'https://task-manager-custom-sand.vercel.app';
	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: email,
		subject: `Invitation to join ${boardTitle || 'a project'} on Task Manager`,
		html: `
			<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
				<h2>You've been invited!</h2>
				<p>Hello,</p>
				<p>You have been invited to collaborate on the board <strong>${boardTitle || 'Task Manager'}</strong>.</p>
				<p>Since you don't have an account yet, please sign up using the link below to get started:</p>
				<p style="text-align: center; margin: 30px 0;">
					<a href="${clientUrl}/register" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Sign Up Now</a>
				</p>
				<p>If you already have an account with a different email, please let the board owner know.</p>
				<p>Thanks,<br>Task Manager Team</p>
			</div>
		`,
	};

	try {
		await transporter.sendMail(mailOptions);
		return { success: true };
	} catch (error) {
		console.error('Error sending invitation email:', error);
		return { success: false, error: error.message };
	}
};

const sendReminderEmail = async (email, cardTitle, dueTimeStr) => {
	const clientUrl = process.env.CLIENT_URL || 'https://task-manager-custom-sand.vercel.app';
	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: email,
		subject: `Reminder: Task "${cardTitle}" is due soon!`,
		html: `
			<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
				<h2>Task Reminder</h2>
				<p>Hello,</p>
				<p>This is a gentle reminder that the task <strong>${cardTitle}</strong> is due at ${dueTimeStr}.</p>
				<p>Please check your Task Manager dashboard to update the status.</p>
				<p style="text-align: center; margin: 30px 0;">
					<a href="${clientUrl}" style="background-color: #fca311; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Task Manager</a>
				</p>
				<p>Thanks,<br>Task Manager Team</p>
			</div>
		`,
	};

	try {
		await transporter.sendMail(mailOptions);
		return { success: true };
	} catch (error) {
		console.error('Error sending reminder email:', error);
		return { success: false, error: error.message };
	}
};

module.exports = {
	sendInvitationEmail,
	sendReminderEmail
};

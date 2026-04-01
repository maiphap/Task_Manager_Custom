const cron = require('node-cron');
const cardModel = require('../Models/cardModel');
const userModel = require('../Models/userModel');
const mailService = require('./mailService');

const initCronJobs = () => {
	// Chạy vào 8h sáng mỗi ngày '0 8 * * *', 
	// nhưng để demo/test, ta có thể cài chạy mỗi phút bằng '* * * * *'
	// Chúng ta sẽ cài cấu hình mặc định là kiểm tra vào lúc 08:00 sáng
	cron.schedule('0 8 * * *', async () => {
		try {
			console.log("CRON-JOB: Checking for upcoming due dates...");
			const now = new Date();
			const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

			// Tìm các thẻ có dueDate trong vòng 24h tới và chưa complete
			const upcomingCards = await cardModel.find({
				'date.completed': false,
				'date.dueDate': { $gte: now, $lte: next24Hours }
			}).populate('members.user', 'email');

			for (const card of upcomingCards) {
				const dueTimeStr = card.date.dueTime ? card.date.dueTime : 'the end of the day';
				
				// Gửi mail cho từng thành viên của thẻ có mặt trong card.members
				if (card.members && card.members.length > 0) {
					for (const member of card.members) {
						if (member.user && member.user.email) {
							await mailService.sendReminderEmail(member.user.email, card.title, dueTimeStr);
							console.log(`CRON-JOB: Sent reminder to ${member.user.email} for card "${card.title}"`);
						}
					}
				}
			}
			console.log("CRON-JOB: Finished checking.");
		} catch (error) {
			console.error("CRON-JOB ERROR: ", error);
		}
	});
};

module.exports = {
	initCronJobs
};

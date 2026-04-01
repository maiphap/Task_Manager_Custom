const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { v2: cloudinary } = require('cloudinary');

// Cấu hình Cloudinary từ biến môi trường
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình Multer Storage với Cloudinary
const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'task-manager-covers',
		allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
		transformation: [{ width: 1200, crop: 'limit' }], // Giới hạn chiều rộng tối đa 1200px
	},
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
});

module.exports = { upload, cloudinary };

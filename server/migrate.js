const mongoose = require('mongoose');
const userModel = require('./Models/userModel');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/TaskManagerDB')
    .then(async () => {
        console.log('Connected to DB...');
        // Cập nhật tất cả user chưa có trường role
        const result = await userModel.updateMany(
            { role: { $exists: false } },
            { $set: { role: 'user' } }
        );
        console.log(`Updated ${result.modifiedCount} users.`);
        process.exit();
    });

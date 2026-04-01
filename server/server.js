const dotenv = require('dotenv');
const express = require('express');
const http = require('http');
const unless = require('express-unless');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const userRoute = require('./Routes/userRoute');
const boardRoute = require('./Routes/boardRoute');
const listRoute = require('./Routes/listRoute');
const cardRoute = require('./Routes/cardRoute');
const auth = require('./Middlewares/auth');
const cronService = require('./Services/cronService');

dotenv.config();
const app = express();
const server = http.createServer(app);

// Kích hoạt Cron-job gửi email
cronService.initCronJobs();

// Cấu hình CORS chi tiết
const allowedOrigins = [
    'http://localhost:3000', // Cho môi trường local
    'https://task-manager-custom.vercel.app',
	'https://task-manager-custom-git-main-maiphaps-projects.vercel.app',
    'https://task-manager-custom-card.vercel.app',
    'https://task-manager-custom-sand.vercel.app', // Thêm domain mới của bạn vào đây
	'https://task-manager-custom.onrender.com',
	'https://task-manager-custom-maiphaps-projects.vercel.app' // Link frontend mới của bạn
];

app.use(cors({
    origin: function (origin, callback) {
        // Cho phép các yêu cầu không có origin (như Postman, mobile apps)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));
app.use(express.json());

// AUTH VERIFICATION AND UNLESS

auth.verifyToken.unless = unless;

app.use(
	auth.verifyToken.unless({
		path: [
			{ url: '/user/login', method: ['POST'] },
			{ url: '/user/register', method: ['POST'] },
			{ url: '/user/google-login', method: ['POST'] },
			{ url: '/', method: ['GET'] },
		],
	})
);

//MONGODB CONNECTION

mongoose.Promise = global.Promise;
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Database connection is succesfull!');
	})
	.catch((err) => {
		console.log(`Database connection failed!`);
		console.log(`Details : ${err}`);
	});

//ROUTES

app.use('/user', userRoute);
app.use('/board', boardRoute);
app.use('/list', listRoute);
app.use('/card', cardRoute);

app.get('/', (req, res) => {
	res.send('Task Manager Backend is running!');
});

// Khởi tạo Socket.IO với cấu hình CORS
const io = new Server(server, {
	cors: {
		origin: allowedOrigins,
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
	},
});

io.on('connection', (socket) => {
	// console.log('A user connected:', socket.id);

	socket.on('join_board', (boardId) => {
		socket.join(boardId);
		// console.log(`User ${socket.id} joined board ${boardId}`);
	});

	socket.on('move_card', (data) => {
		// Phát sự kiện cập nhật cho những người khác trong cùng board
		socket.to(data.boardId).emit('update_board_request', data.updatedLists);
	});

	socket.on('move_list', (data) => {
		// Phát sự kiện cập nhật cho những người khác trong cùng board
		socket.to(data.boardId).emit('update_board_request', data.updatedLists);
	});

	socket.on('board_updated', (boardId) => {
		socket.to(boardId).emit('update_board_data');
	});

	socket.on('disconnect', () => {
		// console.log('A user disconnected:', socket.id);
	});
});

server.listen(process.env.PORT, () => {
	console.log(`Server is online! Port: ${process.env.PORT}`);
});

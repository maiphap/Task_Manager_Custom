import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'], // Đảm bảo hỗ trợ các cơ chế vận chuyển
});

export default socket;

import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: true,
});

socket.on('connect', () => {
  console.log('🔗 Đã kết nối Socket.IO tới máy chủ!');
});

socket.on('disconnect', () => {
  console.log('❌ Mất kết nối Socket.IO!');
});

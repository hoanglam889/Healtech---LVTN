import { io } from 'socket.io-client';

const SOCKET_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'http://14.225.218.191:3000';

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

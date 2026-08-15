import { io } from 'socket.io-client';

const hostname = window.location.hostname;
const SOCKET_URL = `http://${hostname}:3000`;

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

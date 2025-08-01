import { io } from 'socket.io-client';

const socket = io('https://codingforkidsnepal.com', {
  transports: ['websocket'],
  reconnectionAttempts: 5,
  timeout: 10000,
});

export default socket;

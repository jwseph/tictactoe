import { io } from 'socket.io-client'

export const socket = io('https://kamiak-io.fly.dev', {path: '/tictactoe/socket.io'});
window.socket = socket;
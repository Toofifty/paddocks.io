import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { Lobby } from './lobby';
import { customAlphabet } from 'nanoid';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

const lobbies: Record<string, Lobby> = {};

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hi :)');
});

io.on('connection', (socket) => {
  console.log(socket.id, 'connected');

  socket.on('query-lobbies', () => {
    console.log('got query-lobbies');
    io.emit(
      'query-lobbies-response',
      Object.entries(lobbies)
        .filter(([, lobby]) => !lobby.gameStarted())
        .map(([key]) => key)
    );
  });

  socket.on('host', () => {
    const id = nanoid();
    lobbies[id] = new Lobby(id, socket.id);
    io.emit('lobby-data', lobbies[id].getData());
  });
});

server.listen(3000, () => {
  console.log('listening on :3000');
});

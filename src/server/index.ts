import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import path from 'path';
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

app.use(express.static(path.resolve(process.cwd(), 'public')));
app.use(cors());

app.get('/', (_, res) => {
  res.sendFile(path.resolve(process.cwd(), 'public', 'index.html'));
});

io.on('connection', (socket) => {
  console.log(socket.id, 'connected');

  socket.on('query-lobbies', () => {
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
    io.emit('lobby-update', lobbies[id].getData());
    socket.join(id);
    console.log('create lobby', id);
  });

  socket.on('join-lobby', (id) => {
    try {
      const lobby = lobbies[id];
      if (!lobby) {
        throw new Error('Lobby does not exist!');
      }
      lobby.join(socket.id);
      io.emit('lobby-update', lobby.getData());
      socket.join(id);
    } catch (e: unknown) {
      if (e instanceof Error) {
        socket.emit('error', e.message);
        console.error(e.message);
      } else throw e;
    }
  });

  socket.on('customize', ([id, data]) => {
    try {
      const lobby = lobbies[id];
      if (!lobby) {
        throw new Error('Lobby does not exist!');
      }
      lobby.customize(socket.id, data);
      io.emit('lobby-update', lobby.getData());
    } catch (e: unknown) {
      if (e instanceof Error) {
        socket.emit('error', e.message);
        console.error(e.message);
      } else throw e;
    }
  });

  socket.on('set-lobby-option', ([id, key, value]) => {
    try {
      const lobby = lobbies[id];
      if (!lobby) {
        throw new Error('Lobby does not exist!');
      }
      if (!lobby.isHost(socket.id)) {
        throw new Error('Only the lobby host can change settings');
      }
      lobby.setOption(key, value);
      io.to(id).emit('lobby-update', lobby.getData());
    } catch (e: unknown) {
      if (e instanceof Error) {
        socket.emit('error', e.message);
        console.error(e.message);
      } else throw e;
    }
  });

  socket.on('start-game', (id) => {
    try {
      const lobby = lobbies[id];
      if (!lobby) {
        throw new Error('Lobby does not exist!');
      }
      if (!lobby.isHost(socket.id)) {
        throw new Error('Only the lobby host can start the game');
      }
      lobby.start();
      io.to(id).emit('game-starting');
      setTimeout(() => {
        io.to(id).emit('game-update', lobby.game?.getData());
      }, 1000);
    } catch (e: unknown) {
      if (e instanceof Error) {
        socket.emit('error', e.message);
        console.error(e.message);
      } else throw e;
    }
  });

  socket.on('place', ([id, x, y]) => {
    try {
      const lobby = lobbies[id];
      if (!lobby) {
        throw new Error('Lobby does not exist!');
      }
      lobby.game?.place(x, y, socket.id);
      io.to(id).emit('game-update', lobby.game?.getData());
    } catch (e: unknown) {
      if (e instanceof Error) {
        socket.emit('error', e.message);
        console.error(e.message);
      } else throw e;
    }
  });

  socket.on('place-two', ([id, x1, y1, x2, y2]) => {
    try {
      const lobby = lobbies[id];
      if (!lobby) {
        throw new Error('Lobby does not exist!');
      }
      lobby.game?.placeTwo(x1, y1, x2, y2, socket.id);
      io.to(id).emit('game-update', lobby.game?.getData());
    } catch (e: unknown) {
      if (e instanceof Error) {
        socket.emit('error', e.message);
        console.error(e.message);
      } else throw e;
    }
  });

  socket.on('use-ability', ([id, ability]) => {
    try {
      const lobby = lobbies[id];
      if (!lobby) {
        throw new Error('Lobby does not exist!');
      }
      lobby.game?.useAbility(ability, socket.id);
      io.to(id).emit('ability-used', ability);
      io.to(id).emit('game-update', lobby.game?.getData());
    } catch (e: unknown) {
      if (e instanceof Error) {
        socket.emit('error', e.message);
        console.error(e.message);
      } else throw e;
    }
  });

  socket.on('disconnect', () => {
    Object.entries(lobbies).forEach(([lobbyId, lobby]) => {
      if (lobby.hasPlayer(socket.id)) {
        if (lobby.leave(socket.id)) {
          console.log('destroy lobby', lobbyId);
          delete lobbies[lobbyId];
        } else {
          io.to(lobbyId).emit('lobby-update', lobby.getData());
        }
      }
    });
  });
});

server.listen(3004, () => {
  console.log('listening on :3004');
});

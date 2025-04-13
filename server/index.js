require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const roomRoutes = require('./routes/roomRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());
app.use('/api/rooms', roomRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const rooms = {}; // 目前線上房間狀態 (記憶體內)

io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('join-room', ({ roomId, user }) => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = { users: [] };
    rooms[roomId].users.push({ id: socket.id, name: user, score: 0 });
    io.to(roomId).emit('update-users', rooms[roomId].users);
  });

  socket.on('play-audio', ({ roomId, quizId, start }) => {
    io.to(roomId).emit('start-audio', { quizId, start });
  });

  socket.on('buzz-in', ({ roomId, userId }) => {
    io.to(roomId).emit('buzzed', { userId });
  });

  socket.on('submit-answer', ({ roomId, userId, correct }) => {
    let room = rooms[roomId];
    if (!room) return;
    const user = room.users.find(u => u.id === userId);
    if (!user) return;

    user.score += correct ? 1 : -1;
    io.to(roomId).emit('update-users', room.users);
    io.to(roomId).emit('answer-result', { userId, correct });
  });

  socket.on('disconnect', () => {
    for (let roomId in rooms) {
      rooms[roomId].users = rooms[roomId].users.filter(u => u.id !== socket.id);
      io.to(roomId).emit('update-users', rooms[roomId].users);
    }
    console.log('User disconnected:', socket.id);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

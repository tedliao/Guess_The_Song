const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// 建立房間
router.post('/create', async (req, res) => {
  const { roomName, password, hostName } = req.body;
  try {
    const existing = await Room.findOne({ roomName });
    if (existing) return res.status(400).json({ msg: 'Room already exists' });

    const newRoom = new Room({ roomName, password, hostName, quizzes: [] });
    await newRoom.save();
    res.json(newRoom);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// 加入房間
router.post('/join', async (req, res) => {
  const { roomName, password } = req.body;
  try {
    const room = await Room.findOne({ roomName });
    if (!room) return res.status(404).json({ msg: 'Room not found' });

    const isHost = password && password === room.password;
    res.json({ room, isHost });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// 題目 CRUD
router.post('/:roomName/quizzes', async (req, res) => {
  const { roomName } = req.params;
  const { quiz } = req.body;

  try {
    const room = await Room.findOne({ roomName });
    room.quizzes.push(quiz);
    await room.save();
    res.json(room.quizzes);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

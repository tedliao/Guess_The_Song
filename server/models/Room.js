const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  youtubeUrl: String,
  playStart: Number,
  playEnd: Number,
  answerStart: Number,
  answerEnd: Number,
  answer: String,
});

const RoomSchema = new mongoose.Schema({
  roomName: { type: String, unique: true },
  password: String,
  hostName: String,
  quizzes: [QuizSchema],
});

module.exports = mongoose.model('Room', RoomSchema);

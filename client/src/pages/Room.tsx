import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { socket } from '../socket';
import { User, Quiz } from '../types';
import UserList from '../components/UserList';
import QuizEditor from '../components/QuizEditor';
import Player from '../components/Player';

export default function Room() {
  const { roomId } = useParams();
  const { username, isHost } = useLocation().state;
  const [users, setUsers] = useState<User[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    socket.emit('join-room', { roomId, user: username });
    socket.on('update-users', setUsers);
    socket.on('start-audio', ({ quizId }) => {
      const q = quizzes.find((q, i) => i.toString() === quizId);
      if (q) setCurrentQuiz(q);
    });
    return () => {
      socket.off('update-users');
      socket.off('start-audio');
    };
  }, [quizzes]);

  return (
    <div className="flex">
      <div className="w-1/4 bg-gray-100 p-4">
        <h2 className="text-xl font-bold">玩家列表</h2>
        <UserList users={users} />
      </div>
      <div className="flex-1 p-4 space-y-4">
        <h1 className="text-2xl font-bold">房間：{roomId}</h1>
        {isHost && <QuizEditor roomName={roomId!} setQuizzes={setQuizzes} />}
        {quizzes.map((quiz, idx) => (
          <div key={idx} className="flex justify-between items-center border p-2">
            <span>{quiz.answer}</span>
            {isHost && (
              <button
                onClick={() => {
                  socket.emit('play-audio', { roomId, quizId: idx.toString(), start: quiz.playStart });
                }}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                播放
              </button>
            )}
          </div>
        ))}
        {currentQuiz && <Player quiz={currentQuiz} />}
      </div>
    </div>
  );
}

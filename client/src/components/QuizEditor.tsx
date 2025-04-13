import axios from 'axios';
import { useState } from 'react';
import { Quiz } from '../types';

export default function QuizEditor({
  roomName,
  setQuizzes,
}: {
  roomName: string;
  setQuizzes: (q: Quiz[]) => void;
}) {
  const [quiz, setQuiz] = useState<Quiz>({
    youtubeUrl: '',
    playStart: 0,
    playEnd: 0,
    answerStart: 0,
    answerEnd: 0,
    answer: '',
  });

  const addQuiz = async () => {
    const res = await axios.post(`http://localhost:4000/api/rooms/${roomName}/quizzes`, {
      quiz,
    });
    setQuizzes(res.data);
    setQuiz({
      youtubeUrl: '',
      playStart: 0,
      playEnd: 0,
      answerStart: 0,
      answerEnd: 0,
      answer: '',
    });
  };

  return (
    <div className="space-y-2">
      <input
        className="border p-1 w-full"
        placeholder="YouTube URL"
        value={quiz.youtubeUrl}
        onChange={(e) => setQuiz({ ...quiz, youtubeUrl: e.target.value })}
      />
      <input
        type="number"
        className="border p-1 w-full"
        placeholder="播放 start 秒"
        value={quiz.playStart}
        onChange={(e) => setQuiz({ ...quiz, playStart: Number(e.target.value) })}
      />
      <input
        type="number"
        className="border p-1 w-full"
        placeholder="播放 end 秒"
        value={quiz.playEnd}
        onChange={(e) => setQuiz({ ...quiz, playEnd: Number(e.target.value) })}
      />
      <input
        type="number"
        className="border p-1 w-full"
        placeholder="答案 start 秒"
        value={quiz.answerStart}
        onChange={(e) => setQuiz({ ...quiz, answerStart: Number(e.target.value) })}
      />
      <input
        type="number"
        className="border p-1 w-full"
        placeholder="答案 end 秒"
        value={quiz.answerEnd}
        onChange={(e) => setQuiz({ ...quiz, answerEnd: Number(e.target.value) })}
      />
      <input
        className="border p-1 w-full"
        placeholder="正確答案"
        value={quiz.answer}
        onChange={(e) => setQuiz({ ...quiz, answer: e.target.value })}
      />
      <button onClick={addQuiz} className="bg-purple-500 text-white px-4 py-2 rounded">
        新增題目
      </button>
    </div>
  );
}

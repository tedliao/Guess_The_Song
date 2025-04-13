import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const createRoom = async () => {
    if (!username) return;
    const res = await axios.post('http://localhost:4000/api/rooms/create', {
      roomName: room,
      password,
      hostName: username,
    });
    navigate(`/room/${room}`, { state: { username, isHost: true } });
  };

  const joinRoom = async () => {
    if (!username) return;
    const res = await axios.post('http://localhost:4000/api/rooms/join', {
      roomName: room,
      password,
    });
    navigate(`/room/${room}`, {
      state: { username, isHost: res.data.isHost },
    });
  };

  return (
    <div className="p-8 space-y-4 max-w-md mx-auto">
      <input
        className="border p-2 w-full"
        placeholder="你的名稱"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="border p-2 w-full"
        placeholder="房間名稱"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <input
        className="border p-2 w-full"
        placeholder="密碼（可空）"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex gap-2">
        <button onClick={createRoom} className="bg-blue-500 text-white px-4 py-2 rounded">
          創建房間
        </button>
        <button onClick={joinRoom} className="bg-green-500 text-white px-4 py-2 rounded">
          加入房間
        </button>
      </div>
    </div>
  );
}

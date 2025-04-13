import { User } from '../types';

export default function UserList({ users }: { users: User[] }) {
  return (
    <ul className="space-y-1">
      {users.map((u) => (
        <li key={u.id} className="flex justify-between">
          <span>{u.name}</span>
          <span>{u.score}</span>
        </li>
      ))}
    </ul>
  );
}

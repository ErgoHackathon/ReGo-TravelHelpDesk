import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export default function Notifications() {
  const { data, isLoading } = useQuery(['notifications'], async () => {
    const res = await api.get('/notifications');
    return res.data.data;
  });

  if (isLoading) return <div>Loading notifications...</div>;
  return (
    <div style={{ padding: 20 }}>
      <h2>Notifications</h2>
      <ul>
        {data.map((n) => (
          <li key={n.id}>{n.message} {n.userId ? `(for ${n.userId})` : ''}</li>
        ))}
      </ul>
    </div>
  );
}

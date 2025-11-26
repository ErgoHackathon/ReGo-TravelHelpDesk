import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Button } from '@mui/material';

export default function NotificationsCenter() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(['notifications'], async () => {
    const res = await api.get('/notifications');
    return res.data.data;
  });

  const markRead = useMutation((id) => api.post(`/notifications/${id}/read`), {
    onSuccess: () => qc.invalidateQueries(['notifications'])
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Notifications</h2>
      <ul>
        {data.map(n => (
          <li key={n.id}>
            {n.message} {n.userId ? `(for ${n.userId})` : ''} {n.is_read ? '(read)' : <Button size="small" onClick={() => markRead.mutate(n.id)}>Mark read</Button>}
          </li>
        ))}
      </ul>
    </div>
  );
}

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export default function Tickets() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(['tickets'], async () => {
    const res = await api.get('/tickets');
    return res.data.data;
  });

  const createTicket = useMutation(async (ticket) => api.post('/tickets', ticket), {
    onSuccess: () => queryClient.invalidateQueries(['tickets'])
  });

  if (isLoading) return <div>Loading tickets...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>My Tickets</h2>
      <button onClick={() => createTicket.mutate({ title: 'Test ticket', description: 'Sample', category: 'General' })}>Create sample ticket</button>
      <ul>
        {data.map((t) => (
          <li key={t.id}>
            <strong>{t.title}</strong> - {t.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

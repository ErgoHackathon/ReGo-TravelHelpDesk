import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export default function Approvals() {
  const { data, isLoading } = useQuery(['approvals'], async () => {
    const res = await api.get('/approvals');
    return res.data.data;
  });

  if (isLoading) return <div>Loading approvals...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Approvals</h2>
      <ul>
        {data.map(a => (
          <li key={a.approval_id}>{a.request_id} - Level {a.approval_level} - Status: {a.status}</li>
        ))}
      </ul>
    </div>
  );
}

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export default function FAQs() {
  const { data, isLoading } = useQuery(['faqs'], async () => {
    const res = await api.get('/faqs');
    return res.data.data;
  });

  if (isLoading) return <div>Loading FAQs...</div>;
  return (
    <div style={{ padding: 20 }}>
      <h2>FAQs</h2>
      {data.map((f) => (
        <div key={f.id} style={{ marginBottom: 12 }}>
          <strong>{f.q}</strong>
          <p>{f.a}</p>
        </div>
      ))}
    </div>
  );
}

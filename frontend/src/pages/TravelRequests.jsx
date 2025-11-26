import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function TravelRequests() {
  const { data, isLoading } = useQuery(['travelRequests'], async () => {
    const res = await api.get('/travel-requests');
    return res.data.data;
  });

  if (isLoading) return <div>Loading travel requests...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Travel Requests</h2>
      <Link to="/travel-requests/new">Create New Request</Link>
      <ul>
        {data.map((r) => (
          <li key={r.id}>
            <Link to={`/travel-requests/${r.id}`}>{r.request_number} - {r.destination_city} ({r.status})</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

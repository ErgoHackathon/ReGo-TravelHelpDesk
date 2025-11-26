import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import authService from '../services/authService';

export default function Profile() {
  const { data, isLoading } = useQuery(['profile'], async () => {
    const res = await api.get('/auth/profile');
    return res.data.data;
  });

  if (isLoading) return <div>Loading profile...</div>;
  const user = data;
  return (
    <div style={{ padding: 20 }}>
      <h2>Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}

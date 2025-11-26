import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Button, Box } from '@mui/material';

export default function TravelRequestDetail() {
  const { id } = useParams();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(['travelRequest', id], async () => {
    const res = await api.get(`/travel-requests/${id}`);
    return res.data.data;
  });

  const approve = useMutation((action) => api.post(`/travel-requests/${id}/approve`, { action }), {
    onSuccess: () => qc.invalidateQueries(['travelRequests'])
  });

  if (isLoading) return <div>Loading...</div>;

  const req = data;

  return (
    <Box sx={{ p: 3 }}>
      <h2>{req.request_number}</h2>
      <p>{req.purpose}</p>
      <p>Destination: {req.destination_city}, {req.destination_country}</p>
      <p>Status: {req.status}</p>

      <h3>Approvals</h3>
      <ul>
        {req.approvals.map(a => (
          <li key={a.approval_id}>{a.approval_level} - {a.status} - Approver: {a.approver_id} {a.status === 'PENDING' && <Button size="small" onClick={() => approve.mutate('approve')}>Approve</Button>}</li>
        ))}
      </ul>

      <h3>Documents</h3>
      <ul>
        {req.documents.map(d => (
          <li key={d.document_id}>{d.file_name} - {d.verification_status}</li>
        ))}
      </ul>
    </Box>
  );
}

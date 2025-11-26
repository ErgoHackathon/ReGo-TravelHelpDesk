import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Button, Box, TextField, Input, Alert } from '@mui/material';

export default function TravelRequestDetail() {
  const { id } = useParams();
  const qc = useQueryClient();
  const [comment, setComment] = useState('');
  const [uploadStatus, setUploadStatus] = useState(null);

  const { data: users } = useQuery(['usersSimple'], async () => {
    try {
      const res = await api.get('/users/simple');
      return res.data.data;
    } catch (e) {
      return [];
    }
  });

  const { data, isLoading } = useQuery(['travelRequest', id], async () => {
    const res = await api.get(`/travel-requests/${id}`);
    return res.data.data;
  });

  const approve = useMutation((payload) => api.post(`/travel-requests/${id}/approve`, payload), {
    onSuccess: () => qc.invalidateQueries(['travelRequests', ['travelRequest', id], 'approvals'])
  });

  const upload = useMutation((formData) => api.post(`/travel-requests/${id}/documents`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }), {
    onSuccess: () => {
      qc.invalidateQueries(['travelRequest', id]);
      setUploadStatus('success');
    },
    onError: () => setUploadStatus('error')
  });

  if (isLoading) return <div>Loading...</div>;

  const req = data;
  const findUser = (id) => (users || []).find(u => u.id === id)?.name || id;

  const handleApprove = async (action) => {
    await approve.mutateAsync({ action, comment });
    setComment('');
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    // send as multipart FormData
    const fd = new FormData();
    fd.append('file', f);
    fd.append('document_type', 'passport');
    upload.mutate(fd);
  };

  return (
    <Box sx={{ p: 3 }}>
      <h2>{req.request_number}</h2>
      <p>{req.purpose}</p>
      <p>Destination: {req.destination_city}, {req.destination_country}</p>
      <p>Status: {req.status}</p>

      <h3>Approvals</h3>
      <ul>
        {req.approvals.map(a => (
          <li key={a.approval_id}>
            Level {a.approval_level} - {a.status} - Approver: {findUser(a.approver_id)}
            {a.status === 'PENDING' && (
              <Box sx={{ display: 'inline-flex', gap: 1, ml: 2 }}>
                <Button size="small" onClick={() => handleApprove('approve')}>Approve</Button>
                <Button size="small" color="error" onClick={() => handleApprove('reject')}>Reject</Button>
              </Box>
            )}
            {a.comments && <div><em>Comment: {a.comments}</em></div>}
          </li>
        ))}
      </ul>

      <h3>Submit comment (optional)</h3>
      <TextField fullWidth multiline rows={2} value={comment} onChange={(e) => setComment(e.target.value)} sx={{ mb: 2 }} />

      <h3>Documents</h3>
      <ul>
        {req.documents.map(d => (
          <li key={d.document_id}>
            {d.blob_storage_url ? (
              <a href={d.blob_storage_url} target="_blank" rel="noreferrer">{d.file_name}</a>
            ) : (
              d.file_name
            )} - {d.verification_status}
          </li>
        ))}
      </ul>

      <Box sx={{ mt: 2 }}>
        <Input type="file" onChange={handleFile} />
        {uploadStatus === 'success' && <Alert severity="success">Upload simulated and processed.</Alert>}
        {uploadStatus === 'error' && <Alert severity="error">Upload failed.</Alert>}
      </Box>
    </Box>
  );
}

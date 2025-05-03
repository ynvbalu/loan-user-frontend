import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { RootState, AppDispatch } from '../../store';
import { fetchUserById } from '../../store/slices/userSlice';

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedUser: user, loading } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(parseInt(id)));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Typography>User not found</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>User Details</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography><strong>Username:</strong> {user.username}</Typography>
        <Typography><strong>Name:</strong> {user.firstName} {user.lastName}</Typography>
        <Typography><strong>Email:</strong> {user.email}</Typography>
        <Typography><strong>Phone:</strong> {user.phoneNumber}</Typography>
        <Typography><strong>OOO Status:</strong> {user.oooStatus ? 'Yes' : 'No'}</Typography>
      </Paper>
    </Box>
  );
};

export default UserDetail; 
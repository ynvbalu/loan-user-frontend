import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Grid
} from '@mui/material';
import { RootState, AppDispatch } from '../../store';
import { fetchUserById, updateUser } from '../../store/slices/userSlice';
import { UpdateUserDto } from '../../types';

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedUser: user, loading } = useSelector((state: RootState) => state.users);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateUserDto>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    oooStatus: false
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(parseInt(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        oooStatus: user.oooStatus
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'oooStatus' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      await dispatch(updateUser({ id: parseInt(id), user: formData }));
      setIsEditing(false);
    }
  };

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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">User Details</Typography>
        <Button 
          variant="contained" 
          color={isEditing ? "secondary" : "primary"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </Box>
      <Paper sx={{ p: 3 }}>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.oooStatus}
                      onChange={handleInputChange}
                      name="oooStatus"
                    />
                  }
                  label="Out of Office"
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" gap={2}>
                  <Button type="submit" variant="contained" color="primary">
                    Save Changes
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phoneNumber: user.phoneNumber || '',
                        oooStatus: user.oooStatus
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        ) : (
          <>
            <Typography><strong>Username:</strong> {user.username}</Typography>
            <Typography><strong>Name:</strong> {user.firstName} {user.lastName}</Typography>
            <Typography><strong>Email:</strong> {user.email}</Typography>
            <Typography><strong>Phone:</strong> {user.phoneNumber}</Typography>
            <Typography><strong>OOO Status:</strong> {user.oooStatus ? 'Yes' : 'No'}</Typography>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default UserDetail; 
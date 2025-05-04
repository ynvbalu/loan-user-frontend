import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../../store';
import { fetchUsers, createUser, deleteUser } from '../../store/slices/userSlice';
import { User, CreateUserDto } from '../../types';

const UserList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { users, loading } = useSelector((state: RootState) => state.users);
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState<CreateUserDto>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    oooStatus: false,
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleOpen = () => {
    setNewUser({
      username: 'user' + Math.floor(Math.random() * 1000),
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+1-555-0123',
      oooStatus: false
    });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: name === 'oooStatus' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    await dispatch(createUser(newUser));
    handleClose();
    setNewUser({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      oooStatus: false,
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await dispatch(deleteUser(id));
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Users</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add User
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>OOO Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: User) => (
              <TableRow 
                key={user.id}
                sx={{
                  backgroundColor: user.oooStatus ? '#fffde7' : '#e8f5e9',
                  '&:hover': {
                    backgroundColor: user.oooStatus ? '#fff9c4' : '#c8e6c9',
                  },
                }}
              >
                <TableCell>{user.username}</TableCell>
                <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.oooStatus ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/users/${user.id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(user.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              name="username"
              label="Username"
              value={newUser.username}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="firstName"
              label="First Name"
              value={newUser.firstName}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="lastName"
              label="Last Name"
              value={newUser.lastName}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={newUser.email}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="phoneNumber"
              label="Phone Number"
              value={newUser.phoneNumber}
              onChange={handleInputChange}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  name="oooStatus"
                  checked={newUser.oooStatus}
                  onChange={handleInputChange}
                />
              }
              label="Out of Office"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Add User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList; 
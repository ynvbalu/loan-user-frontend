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
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../../store';
import { fetchLoans, createLoan, deleteLoan } from '../../store/slices/loanSlice';
import { fetchUsers } from '../../store/slices/userSlice';
import { Loan, CreateLoanDto, User } from '../../types';

const LoanList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loans, loading: loansLoading } = useSelector((state: RootState) => state.loans as { loans: Loan[], loading: boolean });
  const { users, loading: usersLoading } = useSelector((state: RootState) => state.users as { users: User[], loading: boolean });
  const [open, setOpen] = useState(false);
  const [newLoan, setNewLoan] = useState<CreateLoanDto>({
    loanNumber: '',
    amount: 0,
    interestRate: 0,
    term: 0,
    startDate: '',
    status: 'PENDING',
    userId: 0,
  });

  useEffect(() => {
    dispatch(fetchLoans());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLoan((prev) => ({
      ...prev,
      [name]: name === 'amount' || name === 'interestRate' || name === 'term' || name === 'userId'
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async () => {
    await dispatch(createLoan(newLoan));
    handleClose();
    setNewLoan({
      loanNumber: '',
      amount: 0,
      interestRate: 0,
      term: 0,
      startDate: '',
      status: 'PENDING',
      userId: 0,
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      await dispatch(deleteLoan(id));
    }
  };

  const loading = loansLoading || usersLoading;

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
        <Typography variant="h4">Loans</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add Loan
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Loan Number</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Interest Rate</TableCell>
              <TableCell>Term (months)</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map((loan: Loan) => (
              <TableRow key={loan.id}>
                <TableCell>{loan.loanNumber}</TableCell>
                <TableCell>${loan.amount.toLocaleString()}</TableCell>
                <TableCell>{loan.interestRate}%</TableCell>
                <TableCell>{loan.term}</TableCell>
                <TableCell>{new Date(loan.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{loan.status}</TableCell>
                <TableCell>{loan.user?.username}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/loans/${loan.id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(loan.id)}
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
        <DialogTitle>Add New Loan</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              name="loanNumber"
              label="Loan Number"
              value={newLoan.loanNumber}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="amount"
              label="Amount"
              type="number"
              value={newLoan.amount}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="interestRate"
              label="Interest Rate"
              type="number"
              value={newLoan.interestRate}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="term"
              label="Term (months)"
              type="number"
              value={newLoan.term}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="startDate"
              label="Start Date"
              type="date"
              value={newLoan.startDate}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="status"
              label="Status"
              select
              value={newLoan.status}
              onChange={handleInputChange}
              fullWidth
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="CLOSED">Closed</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
            </TextField>
            <TextField
              name="userId"
              label="User"
              select
              value={newLoan.userId}
              onChange={handleInputChange}
              fullWidth
            >
              {users.map((user: User) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Add Loan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoanList; 
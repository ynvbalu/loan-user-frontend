import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { RootState, AppDispatch } from '../../store';
import { fetchUsers } from '../../store/slices/userSlice';
import { fetchLoans } from '../../store/slices/loanSlice';
import { Loan } from '../../types';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading: usersLoading } = useSelector((state: RootState) => state.users);
  const { loans, loading: loansLoading } = useSelector((state: RootState) => state.loans);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchLoans());
  }, [dispatch]);

  const loading = usersLoading || loansLoading;

  const totalUsers = users.length;
  const totalLoans = loans.length;
  const activeLoans = loans.filter((loan: Loan) => loan.status === 'ACTIVE').length;
  const oooUsers = users.filter(user => user.oooStatus).length;

  const loanStatusData = [
    { name: 'Active', value: loans.filter((loan: Loan) => loan.status === 'ACTIVE').length },
    { name: 'Closed', value: loans.filter((loan: Loan) => loan.status === 'CLOSED').length },
    { name: 'Pending', value: loans.filter((loan: Loan) => loan.status === 'PENDING').length },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              Total Users
            </Typography>
            <Typography variant="h4">{totalUsers}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              Total Loans
            </Typography>
            <Typography variant="h4">{totalLoans}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              Active Loans
            </Typography>
            <Typography variant="h4">{activeLoans}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              OOO Users
            </Typography>
            <Typography variant="h4">{oooUsers}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Loan Status Distribution
            </Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loanStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { RootState, AppDispatch } from '../../store';
import { fetchLoanById } from '../../store/slices/loanSlice';

const LoanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedLoan: loan, loading } = useSelector((state: RootState) => state.loans);

  useEffect(() => {
    if (id) {
      dispatch(fetchLoanById(parseInt(id)));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!loan) {
    return <Typography>Loan not found</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Loan Details</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography><strong>Loan Number:</strong> {loan.loanNumber}</Typography>
        <Typography><strong>Amount:</strong> ${loan.amount.toLocaleString()}</Typography>
        <Typography><strong>Interest Rate:</strong> {loan.interestRate}%</Typography>
        <Typography><strong>Term:</strong> {loan.term} months</Typography>
        <Typography><strong>Start Date:</strong> {new Date(loan.startDate).toLocaleDateString()}</Typography>
        <Typography><strong>Status:</strong> {loan.status}</Typography>
        <Typography><strong>User:</strong> {loan.user.username}</Typography>
      </Paper>
    </Box>
  );
};

export default LoanDetail; 
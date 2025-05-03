import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';
import { RootState, AppDispatch } from '../../store';
import { fetchUsers } from '../../store/slices/userSlice';
import { fetchLoans, transferLoans } from '../../store/slices/loanSlice';
import { User, Loan, LoanTransferDto } from '../../types';

const LoanTransfer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading: usersLoading } = useSelector((state: RootState) => state.users);
  const { loans, loading: loansLoading } = useSelector((state: RootState) => state.loans);
  const [sourceUser, setSourceUser] = useState<string>('');
  const [targetUser, setTargetUser] = useState<string>('');
  const [selectedLoans, setSelectedLoans] = useState<number[]>([]);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchLoans());
  }, [dispatch]);

  const handleSourceUserChange = (event: SelectChangeEvent) => {
    setSourceUser(event.target.value);
    setSelectedLoans([]);
  };

  const handleTargetUserChange = (event: SelectChangeEvent) => {
    setTargetUser(event.target.value);
  };

  const handleLoanSelection = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value;
    setSelectedLoans(typeof value === 'string' ? value.split(',').map(Number) : value);
  };

  const handleTransfer = async () => {
    if (sourceUser && targetUser && selectedLoans.length > 0) {
      const transferData: LoanTransferDto = {
        sourceUsername: sourceUser,
        targetUsername: targetUser,
        loanIds: selectedLoans,
      };
      await dispatch(transferLoans(transferData));
      setSourceUser('');
      setTargetUser('');
      setSelectedLoans([]);
    }
  };

  const sourceUserLoans = loans.filter(
    (loan) => loan.user?.username === sourceUser
  );

  const loading = usersLoading || loansLoading;

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
        Transfer Loans
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box display="flex" flexDirection="column" gap={3}>
          <FormControl fullWidth>
            <InputLabel>Source User</InputLabel>
            <Select
              value={sourceUser}
              label="Source User"
              onChange={handleSourceUserChange}
            >
              {users.map((user: User) => (
                <MenuItem key={user.id} value={user.username}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Target User</InputLabel>
            <Select
              value={targetUser}
              label="Target User"
              onChange={handleTargetUserChange}
            >
              {users
                .filter((user: User) => user.username !== sourceUser)
                .map((user: User) => (
                  <MenuItem key={user.id} value={user.username}>
                    {user.username}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Select Loans to Transfer</InputLabel>
            <Select
              multiple
              value={selectedLoans}
              onChange={handleLoanSelection}
              input={<OutlinedInput label="Select Loans to Transfer" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const loan = sourceUserLoans.find((l) => l.id === value);
                    return (
                      <Chip
                        key={value}
                        label={`${loan?.loanNumber} - $${loan?.amount.toLocaleString()}`}
                      />
                    );
                  })}
                </Box>
              )}
            >
              {sourceUserLoans.map((loan: Loan) => (
                <MenuItem key={loan.id} value={loan.id}>
                  {loan.loanNumber} - ${loan.amount.toLocaleString()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={handleTransfer}
            disabled={!sourceUser || !targetUser || selectedLoans.length === 0}
          >
            Transfer Loans
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoanTransfer; 
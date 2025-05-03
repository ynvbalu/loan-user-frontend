import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Loan, CreateLoanDto, UpdateLoanDto, LoanTransferDto } from '../../types';
import { loanApi, userLoanApi } from '../../services/api';

interface LoanState {
  loans: Loan[];
  selectedLoan: Loan | null;
  loading: boolean;
  error: string | null;
}

const initialState: LoanState = {
  loans: [],
  selectedLoan: null,
  loading: false,
  error: null,
};

export const fetchLoans = createAsyncThunk('loans/fetchAll', async () => {
  const response = await loanApi.getAllLoans();
  return response.data;
});

export const fetchLoanById = createAsyncThunk('loans/fetchLoanById', async (id: number) => {
  const response = await loanApi.getLoanById(id);
  return response.data;
});

export const createLoan = createAsyncThunk('loans/create', async (loan: CreateLoanDto) => {
  const response = await loanApi.createLoan(loan);
  return response.data;
});

export const updateLoan = createAsyncThunk(
  'loans/update',
  async ({ id, loan }: { id: number; loan: UpdateLoanDto }) => {
    const response = await loanApi.updateLoan(id, loan);
    return response.data;
  }
);

export const deleteLoan = createAsyncThunk('loans/delete', async (id: number) => {
  await loanApi.deleteLoan(id);
  return id;
});

export const transferLoans = createAsyncThunk('loans/transfer', async (transfer: LoanTransferDto) => {
  const response = await userLoanApi.transferLoans(transfer);
  return response.data;
});

const loanSlice = createSlice({
  name: 'loans',
  initialState,
  reducers: {
    setSelectedLoan: (state, action) => {
      state.selectedLoan = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoans.fulfilled, (state, action) => {
        state.loading = false;
        state.loans = action.payload;
      })
      .addCase(fetchLoans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch loans';
      })
      .addCase(fetchLoanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoanById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.loans.findIndex(loan => loan.id === action.payload.id);
        if (index !== -1) {
          state.loans[index] = action.payload;
        } else {
          state.loans.push(action.payload);
        }
      })
      .addCase(fetchLoanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch loan';
      })
      .addCase(createLoan.fulfilled, (state, action) => {
        state.loans.push(action.payload);
      })
      .addCase(updateLoan.fulfilled, (state, action) => {
        const index = state.loans.findIndex((loan) => loan.id === action.payload.id);
        if (index !== -1) {
          state.loans[index] = action.payload;
        }
      })
      .addCase(deleteLoan.fulfilled, (state, action) => {
        state.loans = state.loans.filter((loan) => loan.id !== action.payload);
      });
  },
});

export const { setSelectedLoan, clearError } = loanSlice.actions;
export default loanSlice.reducer; 
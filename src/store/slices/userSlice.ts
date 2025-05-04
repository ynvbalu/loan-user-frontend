import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User, CreateUserDto, UpdateUserDto } from '../../types';
import { userApi } from '../../services/api';

interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchAll', async () => {
  const response = await userApi.getAllUsers();
  return response.data;
});

export const fetchUserById = createAsyncThunk('users/fetchUserById', async (id: number) => {
  const response = await userApi.getUserById(id);
  return response.data;
});

export const createUser = createAsyncThunk('users/create', async (user: CreateUserDto) => {
  const response = await userApi.createUser(user);
  return response.data;
});

export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, user }: { id: number; user: UpdateUserDto }) => {
    const response = await userApi.updateUser(id, user);
    return response.data;
  }
);

export const deleteUser = createAsyncThunk('users/delete', async (id: number) => {
  await userApi.deleteUser(id);
  return id;
});

export const silentFetchUsers = createAsyncThunk('users/silentFetch', async () => {
  const response = await userApi.getAllUsers();
  return response.data;
});

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        } else {
          state.users.push(action.payload);
        }
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user';
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(silentFetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      });
  },
});

export const { setSelectedUser, clearError } = userSlice.actions;
export default userSlice.reducer; 
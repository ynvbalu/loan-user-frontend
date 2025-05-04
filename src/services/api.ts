import axios from 'axios';
import { User, Loan, CreateUserDto, UpdateUserDto, CreateLoanDto, UpdateLoanDto } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User APIs
export const userApi = {
  createUser: (user: CreateUserDto) => api.post<User>('/users', user),
  getAllUsers: () => api.get<User[]>('/users'),
  getUserById: (id: number) => api.get<User>(`/users/${id}`),
  getUserByUsername: (username: string) => api.get<User>(`/users/username/${username}`),
  updateUser: (id: number, user: UpdateUserDto) => api.put<User>(`/users/${id}`, user),
  deleteUser: (id: number) => api.delete(`/users/${id}`),
  getUserCount: () => api.get<number>('/users/count'),
  checkUserExists: (id: number) => api.get<boolean>(`/users/exists/${id}`),
  checkUsernameExists: (username: string) => api.get<boolean>(`/users/exists/username/${username}`),
  checkUserOoo: (id: number) => api.get<boolean>(`/users/${id}/ooo`),
  checkUsernameOoo: (username: string) => api.get<boolean>(`/users/username/${username}/ooo`),
};

// Loan APIs
export const loanApi = {
  createLoan: (loan: CreateLoanDto) => api.post<Loan>('/loans', loan),
  getAllLoans: () => api.get<Loan[]>('/loans'),
  getLoanById: (id: number) => api.get<Loan>(`/loans/${id}`),
  updateLoan: (id: number, loan: UpdateLoanDto) => api.put<Loan>(`/loans/${id}`, loan),
  deleteLoan: (id: number) => api.delete(`/loans/${id}`),
  getLoanCount: () => api.get<number>('/loans/count'),
  checkLoanExists: (id: number) => api.get<boolean>(`/loans/exists/${id}`),
};

export default api; 
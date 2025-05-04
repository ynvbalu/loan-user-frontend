export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  creationDate: string;
  oooStatus: boolean;
  loans: Loan[];
}

export interface Loan {
  id: number;
  loanNumber: string;
  amount: number;
  interestRate: number;
  term: number;
  startDate: string;
  status: 'ACTIVE' | 'CLOSED' | 'PENDING';
  userId: number;
  username?: string;
  user?: User;
}

export interface CreateUserDto {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  oooStatus: boolean;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

export interface CreateLoanDto {
  loanNumber: string;
  amount: number;
  interestRate: number;
  term: number;
  startDate: string;
  status: 'ACTIVE' | 'CLOSED' | 'PENDING';
  userId: number;
}

export interface UpdateLoanDto extends Partial<CreateLoanDto> {} 
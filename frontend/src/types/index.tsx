export interface LoanApplication {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  annualIncome: number;
  loanAmount: number;
  creditScore: number;
  age: number;
  employmentType: string;
  monthlyDebtPayments: number;
  loanTenure: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  eligible: boolean;
  reason: string;
  appliedDate: string;
  lastUpdated: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  applications: LoanApplication[];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}
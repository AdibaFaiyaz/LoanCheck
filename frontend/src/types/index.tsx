export interface LoanApplication {
  id: string;
  userId?: string;
  name: string; // Backend sends 'name', not 'applicantName'
  email: string;
  phone: string;
  age: number;
  annualIncome: number;
  requestedAmount: number; // Backend sends 'requestedAmount', not 'loanAmount'
  creditScore: number;
  monthlyDebtPayments: number;
  loanTenure: number;
  employmentType: string;
  loanPurpose?: string;
  eligible: boolean;
  eligibilityReason: string; // Backend sends 'eligibilityReason', not 'reason'
  approvedAmount: number;
  interestRate: number;
  monthlyEmi: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  createdAt: string; // Backend sends 'createdAt', not 'appliedDate'
  updatedAt: string; // Backend sends 'updatedAt', not 'lastUpdated'
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
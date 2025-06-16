import type { 
  LoanApplication, 
  LoginData, 
  User, 
  RegisterData 
} from '../types/index';

const API_BASE_URL = 'http://localhost:8080';

// Additional types for API responses
interface EligibilityRequest {
  monthlyIncome: number;
  creditScore: number;
  employmentStatus: string;
  loanAmount: number;
}

interface EligibilityResponse {
  eligible: boolean;
  maxLoanAmount?: number;
  interestRate?: number;
  message: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    console.log(`🔗 API Request: ${options.method || 'GET'} ${url}`);

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ API Error: ${response.status}`, errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ API Success:`, data);
    return data;
  }

  // Eligibility API (ADD THIS - it was missing!)
  async checkEligibility(eligibilityData: EligibilityRequest): Promise<EligibilityResponse> {
    return this.request<EligibilityResponse>('/api/eligibility/check', {
      method: 'POST',
      body: JSON.stringify(eligibilityData),
    });
  }
  // Loan Application APIs
  async submitLoanApplication(data: any): Promise<any> {
    const response = await this.request<{ success: boolean; message: string; applicationId: string; status: string; timestamp: number }>('/api/save-application', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }
  // Application management
  async getAllApplications(): Promise<LoanApplication[]> {
    const response = await this.request<{ success: boolean; applications: LoanApplication[] }>('/api/admin/applications');
    return response.applications;
  }

  async getApplicationById(id: string): Promise<LoanApplication> {
    const response = await this.request<{ success: boolean; application: LoanApplication }>(`/api/application/${id}`);
    return response.application;
  }

  async updateApplicationStatus(id: string, status: string): Promise<LoanApplication> {
    return this.request<LoanApplication>(`/api/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // User APIs (for future implementation)
  async login(credentials: LoginData): Promise<{ user: User; token: string }> {
    return this.request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterData): Promise<{ user: User; token: string }> {
    return this.request<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Health check for testing
  async healthCheck(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/health');
  }
}

export const apiService = new ApiService();
export type { EligibilityRequest, EligibilityResponse };
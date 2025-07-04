import type { 
  LoanApplication, 
  LoginData, 
  User, 
  RegisterData 
} from '../types/index';

const API_BASE_URL = 'http://localhost:8080';

// Test backend connection
export const testBackendConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/health`);
    console.log('Backend connection test:', response.status);
    return response.ok;
  } catch (error) {
    console.error('Backend connection failed:', error);
    return false;
  }
};

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
    console.log(`📝 Request config:`, config);
    console.log(`📝 Request body:`, options.body);

    try {
      const response = await fetch(url, config);
      
      console.log(`📡 Response status: ${response.status}`);
      console.log(`📡 Response statusText: ${response.statusText}`);
      console.log(`📡 Response headers:`, Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('🚨 Failed to parse error response as JSON:', parseError);
          errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
        }
        console.error(`❌ API Error: ${response.status}`, errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ API Success:`, data);
      
      // Check if data is null or undefined
      if (data === null || data === undefined) {
        console.error('🚨 API returned null/undefined data');
        throw new Error('Server returned empty response');
      }
      
      return data;
    } catch (error) {
      console.error(`🚨 Network/Parse Error:`, error);
      throw error;
    }
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

  // User APIs
  async login(credentials: LoginData): Promise<{ success: boolean; message: string; user: User }> {
    return this.request<{ success: boolean; message: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterData): Promise<{ success: boolean; message: string; user: User }> {
    return this.request<{ success: boolean; message: string; user: User }>('/api/auth/signup', {
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
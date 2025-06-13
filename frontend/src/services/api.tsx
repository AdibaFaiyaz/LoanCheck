import type{ 
  LoanApplication, 
  LoginData, 
  User, 
  RegisterData 
} from '../types/index';
const API_BASE_URL = 'http://localhost:8080';

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

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Loan Application APIs
  async submitLoanApplication(data: any): Promise<LoanApplication> {
    return this.request<LoanApplication>('/api/save-application', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getApplicationById(id: string): Promise<LoanApplication> {
    return this.request<LoanApplication>(`/api/applications/${id}`);
  }

  async getAllApplications(): Promise<LoanApplication[]> {
    return this.request<LoanApplication[]>('/api/applications');
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
}

export const apiService = new ApiService();
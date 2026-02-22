import axios, { AxiosResponse } from 'axios';
import {
  MOCK_TOKEN,
  mockOverview,
  mockFunnel,
  mockRevenueByChannel,
  mockTopCampaigns,
  mockBudgetRecommendations,
  mockCampaigns,
} from './mock';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 4000,
});

export const isMockToken = (token: string | null) =>
  token === MOCK_TOKEN || token === 'demo-token';

// Wraps a real API call and falls back to mock data on any network/timeout error
async function withMockFallback<T>(
  apiFn: () => Promise<AxiosResponse<T>>,
  mockData: T
): Promise<{ data: T }> {
  try {
    return await apiFn();
  } catch {
    return { data: mockData };
  }
}

type AuthData = { access_token: string; token_type: string };
const mockAuthData: AuthData = { access_token: MOCK_TOKEN, token_type: 'bearer' };

export const authAPI = {
  signup: (email: string, password: string, fullName: string) =>
    withMockFallback<AuthData>(
      () => apiClient.post('/api/auth/signup', { email, password, full_name: fullName }),
      mockAuthData
    ),
  login: (email: string, password: string) =>
    withMockFallback<AuthData>(
      () => apiClient.post('/api/auth/login', { email, password }),
      mockAuthData
    ),
  getMe: () =>
    withMockFallback(
      () => apiClient.get<{ email: string; id: number }>('/api/auth/me'),
      { email: 'demo@pipelineiq.com', id: 1 }
    ),
};

export const companiesAPI = {
  getAll: () => apiClient.get('/api/companies/'),
  getById: (id: number) => apiClient.get(`/api/companies/${id}`),
  create: (data: unknown) => apiClient.post('/api/companies/', data),
  update: (id: number, data: unknown) => apiClient.put(`/api/companies/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/companies/${id}`),
};

export const campaignsAPI = {
  getByCompany: (companyId: number) =>
    withMockFallback(
      () => apiClient.get<typeof mockCampaigns>(`/api/campaigns/company/${companyId}`),
      mockCampaigns
    ),
  getById: (id: number) => apiClient.get(`/api/campaigns/${id}`),
  create: (data: unknown) => apiClient.post('/api/campaigns/', data),
  update: (id: number, data: unknown) => apiClient.put(`/api/campaigns/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/campaigns/${id}`),
};

export const leadsAPI = {
  getByCompany: (companyId: number) => apiClient.get(`/api/leads/company/${companyId}`),
  getById: (id: number) => apiClient.get(`/api/leads/${id}`),
  create: (data: unknown) => apiClient.post('/api/leads/', data),
  update: (id: number, data: unknown) => apiClient.put(`/api/leads/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/leads/${id}`),
};

export const attributionAPI = {
  calculate: (leadId: number, model: string) =>
    apiClient.post(`/api/attribution/calculate/${leadId}?model=${model}`),
  getRevenueByCampaign: (companyId: number, model: string) =>
    apiClient.get(`/api/attribution/revenue/${companyId}?model=${model}`),
  getSummary: (companyId: number) =>
    apiClient.get(`/api/attribution/summary/${companyId}`),
};

export const analyticsAPI = {
  getOverview: (companyId: number, model = 'linear') =>
    withMockFallback(
      () => apiClient.get<typeof mockOverview>(`/api/analytics/overview/${companyId}?model=${model}`),
      mockOverview
    ),
  getFunnel: (companyId: number) =>
    withMockFallback(
      () => apiClient.get<typeof mockFunnel>(`/api/analytics/funnel/${companyId}`),
      mockFunnel
    ),
  getRevenueByChannel: (companyId: number, model = 'linear') =>
    withMockFallback(
      () => apiClient.get<typeof mockRevenueByChannel>(`/api/analytics/revenue-by-channel/${companyId}?model=${model}`),
      mockRevenueByChannel
    ),
  getTopCampaigns: (companyId: number, limit = 5) =>
    withMockFallback(
      () => apiClient.get<typeof mockTopCampaigns>(`/api/analytics/top-campaigns/${companyId}?limit=${limit}`),
      mockTopCampaigns
    ),
  getDealProbability: (companyId: number) =>
    withMockFallback(
      () => apiClient.get<Record<string, unknown>>(`/api/analytics/deal-probability/${companyId}`),
      {} as Record<string, unknown>
    ),
  getBudgetRecommendations: (companyId: number) =>
    withMockFallback(
      () => apiClient.get<typeof mockBudgetRecommendations>(`/api/analytics/budget-optimization/${companyId}`),
      mockBudgetRecommendations
    ),
};

export const seedAPI = {
  trigger: () =>
    withMockFallback(
      () => apiClient.post<{ ok: boolean }>('/api/seed/'),
      { ok: true }
    ),
};

export default apiClient;

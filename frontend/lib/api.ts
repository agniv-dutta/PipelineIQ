import axios from 'axios';
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
  // Short timeout so fallback kicks in fast when backend is absent
  timeout: 4000,
});

// Returns true if the token is a demo/mock token (backend unavailable)
export const isMockToken = (token: string | null) =>
  token === MOCK_TOKEN || token === 'demo-token';

// Wraps a real API call and falls back to mock data on any network/timeout error
async function withMockFallback<T>(apiFn: () => Promise<T>, mockData: unknown): Promise<{ data: unknown }> {
  try {
    return await apiFn() as any;
  } catch {
    return { data: mockData };
  }
}

export const authAPI = {
  signup: (email: string, password: string, fullName: string) =>
    apiClient.post('/api/auth/signup', { email, password, full_name: fullName }),
  login: (email: string, password: string) =>
    apiClient.post('/api/auth/login', { email, password }),
  getMe: () => apiClient.get('/api/auth/me'),
};

export const companiesAPI = {
  getAll: () => apiClient.get('/api/companies/'),
  getById: (id: number) => apiClient.get(`/api/companies/${id}`),
  create: (data: any) => apiClient.post('/api/companies/', data),
  update: (id: number, data: any) => apiClient.put(`/api/companies/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/companies/${id}`),
};

export const campaignsAPI = {
  getByCompany: (companyId: number) =>
    withMockFallback(
      () => apiClient.get(`/api/campaigns/company/${companyId}`),
      mockCampaigns
    ),
  getById: (id: number) => apiClient.get(`/api/campaigns/${id}`),
  create: (data: any) => apiClient.post('/api/campaigns/', data),
  update: (id: number, data: any) => apiClient.put(`/api/campaigns/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/campaigns/${id}`),
};

export const leadsAPI = {
  getByCompany: (companyId: number) =>
    apiClient.get(`/api/leads/company/${companyId}`),
  getById: (id: number) => apiClient.get(`/api/leads/${id}`),
  create: (data: any) => apiClient.post('/api/leads/', data),
  update: (id: number, data: any) => apiClient.put(`/api/leads/${id}`, data),
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
  getOverview: (companyId: number, model: string = 'linear') =>
    withMockFallback(
      () => apiClient.get(`/api/analytics/overview/${companyId}?model=${model}`),
      mockOverview
    ),
  getFunnel: (companyId: number) =>
    withMockFallback(
      () => apiClient.get(`/api/analytics/funnel/${companyId}`),
      mockFunnel
    ),
  getRevenueByChannel: (companyId: number, model: string = 'linear') =>
    withMockFallback(
      () => apiClient.get(`/api/analytics/revenue-by-channel/${companyId}?model=${model}`),
      mockRevenueByChannel
    ),
  getTopCampaigns: (companyId: number, limit: number = 5) =>
    withMockFallback(
      () => apiClient.get(`/api/analytics/top-campaigns/${companyId}?limit=${limit}`),
      mockTopCampaigns
    ),
  getDealProbability: (companyId: number) =>
    withMockFallback(
      () => apiClient.get(`/api/analytics/deal-probability/${companyId}`),
      {}
    ),
  getBudgetRecommendations: (companyId: number) =>
    withMockFallback(
      () => apiClient.get(`/api/analytics/budget-optimization/${companyId}`),
      mockBudgetRecommendations
    ),
};

export const seedAPI = {
  trigger: () =>
    withMockFallback(() => apiClient.post('/api/seed/'), { ok: true }),
};

export default apiClient;

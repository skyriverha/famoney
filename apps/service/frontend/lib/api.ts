const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Types matching the backend API
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface UpdateUserRequest {
  name?: string;
  profileImage?: string | null;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  profileImage?: string | null;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserResponse;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

// Ledger types
export type MemberRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface CreateLedgerRequest {
  name: string;
  description?: string;
  currency?: string;
}

export interface UpdateLedgerRequest {
  name?: string;
  description?: string;
}

export interface LedgerResponse {
  id: string;
  name: string;
  description?: string;
  currency: string;
  memberCount: number;
  myRole: MemberRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserSummary {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
}

export interface MemberResponse {
  id: string;
  user: UserSummary;
  role: MemberRole;
  joinedAt: string;
}

export interface InviteMemberRequest {
  email: string;
  role: MemberRole;
}

export interface UpdateMemberRoleRequest {
  role: MemberRole;
}

// Category types
export interface CategoryResponse {
  id: string;
  ledgerId: string | null;
  name: string;
  color: string;
  icon: string | null;
  isDefault: boolean;
  createdAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  color?: string;
  icon?: string;
}

// Expense types
export interface CreatedByUser {
  id: string;
  displayName: string;
  profileImage: string | null;
}

export interface ExpenseResponse {
  id: string;
  ledgerId: string;
  amount: number;
  description: string;
  expenseDate: string;
  paymentMethod: string | null;
  category: CategoryResponse | null;
  createdByUser: CreatedByUser;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseListResponse {
  content: ExpenseResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface CreateExpenseRequest {
  amount: number;
  description: string;
  expenseDate: string;
  categoryId?: string;
  paymentMethod?: string;
}

export interface UpdateExpenseRequest {
  amount?: number;
  description?: string;
  expenseDate?: string;
  categoryId?: string;
  paymentMethod?: string;
}

export interface ExpenseFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * API client for authentication endpoints.
 */
export class AuthApi {
  private baseUrl: string;
  private accessToken?: string;

  constructor(accessToken?: string) {
    this.baseUrl = API_BASE_URL;
    this.accessToken = accessToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Network error',
        status: response.status,
      }));
      throw new ApiError(error.message || 'Request failed', response.status);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  async signup(request: SignupRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/v1/auth/signup', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async login(request: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async refreshToken(request: RefreshTokenRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async logout(): Promise<void> {
    return this.request<void>('/api/v1/auth/logout', {
      method: 'POST',
    });
  }
}

/**
 * Custom API error class.
 */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Create Auth API client.
 */
export function createAuthApi(accessToken?: string | null): AuthApi {
  return new AuthApi(accessToken || undefined);
}

/**
 * API client for user profile endpoints.
 */
export class UserApi {
  private baseUrl: string;
  private accessToken: string;

  constructor(accessToken: string) {
    this.baseUrl = API_BASE_URL;
    this.accessToken = accessToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Network error',
        status: response.status,
      }));
      throw new ApiError(error.message || 'Request failed', response.status);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  async getProfile(): Promise<UserResponse> {
    return this.request<UserResponse>('/api/v1/users/me', {
      method: 'GET',
    });
  }

  async updateProfile(request: UpdateUserRequest): Promise<UserResponse> {
    return this.request<UserResponse>('/api/v1/users/me', {
      method: 'PATCH',
      body: JSON.stringify(request),
    });
  }

  async changePassword(request: ChangePasswordRequest): Promise<void> {
    return this.request<void>('/api/v1/users/me/password', {
      method: 'PATCH',
      body: JSON.stringify(request),
    });
  }

  async deleteAccount(): Promise<void> {
    return this.request<void>('/api/v1/users/me', {
      method: 'DELETE',
    });
  }
}

/**
 * Create User API client.
 */
export function createUserApi(accessToken: string): UserApi {
  return new UserApi(accessToken);
}

/**
 * API client for ledger endpoints.
 */
export class LedgerApi {
  private baseUrl: string;
  private accessToken: string;

  constructor(accessToken: string) {
    this.baseUrl = API_BASE_URL;
    this.accessToken = accessToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Network error',
        status: response.status,
      }));
      throw new ApiError(error.message || 'Request failed', response.status);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  async createLedger(request: CreateLedgerRequest): Promise<LedgerResponse> {
    return this.request<LedgerResponse>('/api/v1/ledgers', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getLedgers(): Promise<LedgerResponse[]> {
    return this.request<LedgerResponse[]>('/api/v1/ledgers', {
      method: 'GET',
    });
  }

  async getLedger(ledgerId: string): Promise<LedgerResponse> {
    return this.request<LedgerResponse>(`/api/v1/ledgers/${ledgerId}`, {
      method: 'GET',
    });
  }

  async updateLedger(ledgerId: string, request: UpdateLedgerRequest): Promise<LedgerResponse> {
    return this.request<LedgerResponse>(`/api/v1/ledgers/${ledgerId}`, {
      method: 'PATCH',
      body: JSON.stringify(request),
    });
  }

  async deleteLedger(ledgerId: string): Promise<void> {
    return this.request<void>(`/api/v1/ledgers/${ledgerId}`, {
      method: 'DELETE',
    });
  }

  // Member endpoints
  async getMembers(ledgerId: string): Promise<MemberResponse[]> {
    return this.request<MemberResponse[]>(`/api/v1/ledgers/${ledgerId}/members`, {
      method: 'GET',
    });
  }

  async inviteMember(ledgerId: string, request: InviteMemberRequest): Promise<MemberResponse> {
    return this.request<MemberResponse>(`/api/v1/ledgers/${ledgerId}/members/invite`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async updateMemberRole(ledgerId: string, memberId: string, request: UpdateMemberRoleRequest): Promise<MemberResponse> {
    return this.request<MemberResponse>(`/api/v1/ledgers/${ledgerId}/members/${memberId}`, {
      method: 'PATCH',
      body: JSON.stringify(request),
    });
  }

  async removeMember(ledgerId: string, memberId: string): Promise<void> {
    return this.request<void>(`/api/v1/ledgers/${ledgerId}/members/${memberId}`, {
      method: 'DELETE',
    });
  }
}

/**
 * Create Ledger API client.
 */
export function createLedgerApi(accessToken: string): LedgerApi {
  return new LedgerApi(accessToken);
}

/**
 * API client for expense and category endpoints.
 */
export class ExpenseApi {
  private baseUrl: string;
  private accessToken: string;

  constructor(accessToken: string) {
    this.baseUrl = API_BASE_URL;
    this.accessToken = accessToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Network error',
        status: response.status,
      }));
      throw new ApiError(error.message || 'Request failed', response.status);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // Category endpoints
  async getCategories(ledgerId: string): Promise<CategoryResponse[]> {
    return this.request<CategoryResponse[]>(`/api/v1/ledgers/${ledgerId}/categories`, {
      method: 'GET',
    });
  }

  async createCategory(ledgerId: string, request: CreateCategoryRequest): Promise<CategoryResponse> {
    return this.request<CategoryResponse>(`/api/v1/ledgers/${ledgerId}/categories`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async deleteCategory(ledgerId: string, categoryId: string): Promise<void> {
    return this.request<void>(`/api/v1/ledgers/${ledgerId}/categories/${categoryId}`, {
      method: 'DELETE',
    });
  }

  // Expense endpoints
  async getExpenses(ledgerId: string, filters?: ExpenseFilters): Promise<ExpenseListResponse> {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.page !== undefined) params.append('page', filters.page.toString());
    if (filters?.size !== undefined) params.append('size', filters.size.toString());
    if (filters?.sort) params.append('sort', filters.sort);

    const queryString = params.toString();
    const url = `/api/v1/ledgers/${ledgerId}/expenses${queryString ? `?${queryString}` : ''}`;

    return this.request<ExpenseListResponse>(url, {
      method: 'GET',
    });
  }

  async getExpense(ledgerId: string, expenseId: string): Promise<ExpenseResponse> {
    return this.request<ExpenseResponse>(`/api/v1/ledgers/${ledgerId}/expenses/${expenseId}`, {
      method: 'GET',
    });
  }

  async createExpense(ledgerId: string, request: CreateExpenseRequest): Promise<ExpenseResponse> {
    return this.request<ExpenseResponse>(`/api/v1/ledgers/${ledgerId}/expenses`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async updateExpense(ledgerId: string, expenseId: string, request: UpdateExpenseRequest): Promise<ExpenseResponse> {
    return this.request<ExpenseResponse>(`/api/v1/ledgers/${ledgerId}/expenses/${expenseId}`, {
      method: 'PATCH',
      body: JSON.stringify(request),
    });
  }

  async deleteExpense(ledgerId: string, expenseId: string): Promise<void> {
    return this.request<void>(`/api/v1/ledgers/${ledgerId}/expenses/${expenseId}`, {
      method: 'DELETE',
    });
  }
}

/**
 * Create Expense API client.
 */
export function createExpenseApi(accessToken: string): ExpenseApi {
  return new ExpenseApi(accessToken);
}

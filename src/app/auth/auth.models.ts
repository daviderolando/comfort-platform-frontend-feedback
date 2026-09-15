export interface BackendUser {
  id: number;
  username: string;
  role: 'admin' | 'tenant';
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: 'bearer';
  user: BackendUser;
}

export interface UserSession {
  accessToken: string;
  user: BackendUser;
}

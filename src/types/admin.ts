export interface AdminUser {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  role: 'super_admin' | 'admin' | 'moderator';
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AdminUser;
  token?: string;
  message?: string;
}
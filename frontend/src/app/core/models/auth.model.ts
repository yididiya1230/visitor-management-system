export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiration: string;
  fullName: string;
  role: string;
  userId: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  roleName: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

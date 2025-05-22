// src/lib/auth.ts
const API_BASE_URL =  'http://localhost:8000';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  nombre: string;
  apellido: string;
  password: string;
}

export interface RecoverPasswordRequest {
  email: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  usuario_id: string;
  rol: string;
}

export interface ApiError {
  detail: Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}

class AuthService {
  private baseUrl = `${API_BASE_URL}/api/v1/auth`;

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(this.formatErrorMessage(error));
    }

    return response.json();
  }

  async register(data: RegisterRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/registro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(this.formatErrorMessage(error));
    }
  }

  async recoverPassword(data: RecoverPasswordRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/olvido-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(this.formatErrorMessage(error));
    }
  }

  async logout(token: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(this.formatErrorMessage(error));
    }
  }

  async verifyToken(token: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/verificar-token`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(this.formatErrorMessage(error));
    }

    return response.json();
  }

  private formatErrorMessage(error: ApiError): string {
    if (error.detail && error.detail.length > 0) {
      return error.detail.map(e => e.msg).join(', ');
    }
    return 'Ha ocurrido un error inesperado';
  }

  // Métodos para manejo de tokens en memoria (sin localStorage)
  private token: string | null = null;
  private user: any = null;

  setToken(token: string, user: any): void {
    this.token = token;
    this.user = user;
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): any {
    return this.user;
  }

  clearAuth(): void {
    this.token = null;
    this.user = null;
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }
}

export const authService = new AuthService();
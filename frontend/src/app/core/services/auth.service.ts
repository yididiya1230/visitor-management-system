import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest, RefreshTokenRequest } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = '/api/auth';
  private readonly tokenKey = 'access_token';
  private readonly refreshTokenKey = 'refresh_token';
  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem(this.tokenKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.currentUserSubject.next(parsed);
      } catch {
        this.clearStorage();
      }
    }
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  register(request: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, request).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);
    if (!refreshToken) throw new Error('No refresh token');

    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh-token`, { refreshToken } as RefreshTokenRequest).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => this.clearStorage())
    );
  }

  getToken(): string | null {
    const user = this.currentUserSubject.value;
    return user?.token ?? null;
  }

  getRole(): string | null {
    return this.currentUserSubject.value?.role ?? null;
  }

  isLoggedIn(): boolean {
    const user = this.currentUserSubject.value;
    if (!user) return false;
    const expiry = new Date(user.expiration);
    return expiry > new Date();
  }

  hasRole(role: string): boolean {
    return this.getRole() === role;
  }

  private handleAuthResponse(response: LoginResponse): void {
    localStorage.setItem(this.tokenKey, JSON.stringify(response));
    localStorage.setItem(this.refreshTokenKey, response.refreshToken);
    this.currentUserSubject.next(response);
  }

  private clearStorage(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.currentUserSubject.next(null);
  }
}

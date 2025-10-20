import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, throwError, of, delay, catchError } from 'rxjs';
import { User, LoginRequest, LoginResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Angular 17 Signals
  private isAuthenticatedSignal = signal<boolean>(false);
  private currentUserSignal = signal<User | null>(null);

  constructor(private http: HttpClient) {
    this.loadStoredAuth();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Demo users with different roles
    const demoUsers = [
      {
        username: 'admin',
        password: 'password',
        response: {
          accessToken: 'demo-token-admin',
          refreshToken: 'demo-refresh-admin',
          type: 'Bearer',
          id: 1,
          username: 'admin',
          email: 'admin@seismic.com',
          roles: ['ADMIN']
        }
      },
      {
        username: 'operator_manizales',
        password: 'password',
        response: {
          accessToken: 'demo-token-operator1',
          refreshToken: 'demo-refresh-operator1',
          type: 'Bearer',
          id: 2,
          username: 'operator_manizales',
          email: 'operator.manizales@seismic.com',
          roles: ['OPERATOR']
        }
      },
      {
        username: 'operator_caldas',
        password: 'password',
        response: {
          accessToken: 'demo-token-operator2',
          refreshToken: 'demo-refresh-operator2',
          type: 'Bearer',
          id: 3,
          username: 'operator_caldas',
          email: 'operator.caldas@seismic.com',
          roles: ['OPERATOR']
        }
      },
      {
        username: 'viewer_universidad',
        password: 'password',
        response: {
          accessToken: 'demo-token-viewer1',
          refreshToken: 'demo-refresh-viewer1',
          type: 'Bearer',
          id: 4,
          username: 'viewer_universidad',
          email: 'viewer.universidad@seismic.com',
          roles: ['VIEWER']
        }
      },
      {
        username: 'viewer_alcaldia',
        password: 'password',
        response: {
          accessToken: 'demo-token-viewer2',
          refreshToken: 'demo-refresh-viewer2',
          type: 'Bearer',
          id: 5,
          username: 'viewer_alcaldia',
          email: 'viewer.alcaldia@seismic.com',
          roles: ['VIEWER']
        }
      },
      {
        username: 'manager_centro',
        password: 'password',
        response: {
          accessToken: 'demo-token-manager',
          refreshToken: 'demo-refresh-manager',
          type: 'Bearer',
          id: 6,
          username: 'manager_centro',
          email: 'manager.centro@seismic.com',
          roles: ['STATION_MANAGER']
        }
      }
    ];

    // Check demo users
    const demoUser = demoUsers.find(user => 
      user.username === credentials.username && user.password === credentials.password
    );

    if (demoUser) {
      this.setAuthData(demoUser.response);
      return of(demoUser.response).pipe(delay(1000)); // Simulate network delay
    }
    
    // Try real backend if available
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/signin`, credentials)
      .pipe(
        tap(response => {
          this.setAuthData(response);
        }),
        catchError(error => {
          console.error('Backend not available and invalid demo credentials');
          return throwError(() => new Error('Credenciales inválidas'));
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSignal.set(false);
    this.currentUserSignal.set(null);
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          this.setAuthData(response);
        })
      );
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSignal();
  }

  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role) || user?.roles?.includes(`ROLE_${role}`) || false;
  }

  isSuperAdmin(): boolean {
    return this.hasRole('SUPER_ADMIN');
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN') || this.isSuperAdmin();
  }

  canManageUsers(): boolean {
    return this.hasRole('ADMIN') || this.isSuperAdmin(); // ADMIN y SUPER_ADMIN pueden gestionar usuarios
  }

  private setAuthData(response: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    
    const user: User = {
      id: response.id,
      username: response.username,
      email: response.email,
      firstName: 'Admin',
      lastName: 'Sistema',
      isActive: true,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      roles: response.roles
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.isAuthenticatedSignal.set(true);
    this.currentUserSignal.set(user);
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userStr = localStorage.getItem(this.USER_KEY);

    if (token && userStr) {
      try {
        const user: User = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSignal.set(true);
        this.currentUserSignal.set(user);
      } catch (error) {
        this.logout();
      }
    }
  }
}

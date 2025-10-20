import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Método para obtener todos los usuarios
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      catchError(() => {
        return of(this.getUsersDemo());
      })
    );
  }

  private getUsersDemo(): User[] {
    return [
      {
        id: 1,
        username: 'superadmin',
        email: 'superadmin@seismic.com',
        firstName: 'Super',
        lastName: 'Administrador',
        phone: '+57 300 123 4567',
        isActive: true,
        emailVerified: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        lastLogin: '2024-09-24T08:30:00Z',
        roles: [UserRole.SUPER_ADMIN],
        department: 'Sistemas',
        position: 'Super Administrador'
      },
      {
        id: 2,
        username: 'admin1',
        email: 'admin1@seismic.com',
        firstName: 'Juan',
        lastName: 'Pérez',
        phone: '+57 300 234 5678',
        isActive: true,
        emailVerified: true,
        createdAt: '2023-02-15T00:00:00Z',
        updatedAt: '2024-02-20T14:20:00Z',
        lastLogin: '2024-09-23T16:45:00Z',
        roles: [UserRole.ADMIN],
        department: 'Sismología',
        position: 'Administrador de Sistema'
      },
      {
        id: 3,
        username: 'operator1',
        email: 'operator1@seismic.com',
        firstName: 'María',
        lastName: 'González',
        phone: '+57 300 345 6789',
        isActive: true,
        emailVerified: true,
        createdAt: '2023-03-10T00:00:00Z',
        updatedAt: '2024-03-15T09:15:00Z',
        lastLogin: '2024-09-24T07:20:00Z',
        roles: [UserRole.OPERATOR],
        department: 'Monitoreo',
        position: 'Operador de Estaciones'
      },
      {
        id: 4,
        username: 'viewer1',
        email: 'viewer1@seismic.com',
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        phone: '+57 300 456 7890',
        isActive: true,
        emailVerified: true,
        createdAt: '2023-04-05T00:00:00Z',
        updatedAt: '2024-04-10T11:30:00Z',
        lastLogin: '2024-09-23T18:00:00Z',
        roles: [UserRole.VIEWER],
        department: 'Investigación',
        position: 'Analista de Datos'
      },
      {
        id: 5,
        username: 'admin2',
        email: 'admin2@seismic.com',
        firstName: 'Ana',
        lastName: 'Martínez',
        phone: '+57 300 567 8901',
        isActive: false,
        emailVerified: true,
        createdAt: '2023-05-20T00:00:00Z',
        updatedAt: '2024-05-25T13:45:00Z',
        lastLogin: '2024-08-15T12:30:00Z',
        roles: [UserRole.ADMIN],
        department: 'Sismología',
        position: 'Administrador Auxiliar'
      }
    ];
  }

  getAllUsers(): Observable<User[]> {
    return this.getUsers();
  }

  getUsersActive(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/active`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/username/${username}`);
  }

  searchUsers(term: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/search?term=${term}`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user).pipe(
      catchError((error) => {
        console.error('Error creando usuario:', error);
        throw error;
      })
    );
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${user.id}`, user).pipe(
      catchError((error) => {
        console.error('Error actualizando usuario:', error);
        throw error;
      })
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`).pipe(
      catchError((error) => {
        console.error('Error eliminando usuario:', error);
        throw error;
      })
    );
  }

  changePassword(userId: number, oldPassword: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/users/${userId}/password`, {
      oldPassword,
      newPassword
    }).pipe(
      catchError((error) => {
        console.error('Error cambiando contraseña:', error);
        throw error;
      })
    );
  }

  resetPassword(userId: number): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/users/${userId}/reset-password`, {}).pipe(
      catchError((error) => {
        console.error('Error reseteando contraseña:', error);
        throw error;
      })
    );
  }

  toggleUserStatus(userId: number): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}/toggle-status`, {}).pipe(
      catchError((error) => {
        console.error('Error cambiando estado del usuario:', error);
        throw error;
      })
    );
  }
}

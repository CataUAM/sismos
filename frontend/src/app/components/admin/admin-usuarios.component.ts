import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';

import { User, UserRole } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatTooltipModule,
    MatChipsModule,
    MatBadgeModule
  ],
  template: `
    <div class="admin-container">
      <mat-card class="admin-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>people</mat-icon>
            Gestión de Usuarios
          </mat-card-title>
          <mat-card-subtitle>Administración completa de usuarios del sistema</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <!-- Toolbar con acciones -->
          <mat-toolbar class="action-toolbar">
            <span>Usuarios Registrados</span>
            <span class="spacer"></span>
            <button mat-raised-button color="primary" (click)="openCreateDialog()">
              <mat-icon>person_add</mat-icon>
              Nuevo Usuario
            </button>
            <button mat-raised-button color="accent" (click)="refreshData()">
              <mat-icon>refresh</mat-icon>
              Actualizar
            </button>
          </mat-toolbar>

          <!-- Tabla de usuarios -->
          <div class="table-container">
            <table mat-table [dataSource]="users" class="users-table">
              
              <!-- Columna ID -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let user">{{user.id}}</td>
              </ng-container>

              <!-- Columna Username -->
              <ng-container matColumnDef="username">
                <th mat-header-cell *matHeaderCellDef>Usuario</th>
                <td mat-cell *matCellDef="let user">
                  <strong>{{user.username}}</strong>
                </td>
              </ng-container>

              <!-- Columna Nombre Completo -->
              <ng-container matColumnDef="fullName">
                <th mat-header-cell *matHeaderCellDef>Nombre Completo</th>
                <td mat-cell *matCellDef="let user">
                  {{user.firstName}} {{user.lastName}}
                </td>
              </ng-container>

              <!-- Columna Email -->
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let user">{{user.email}}</td>
              </ng-container>

              <!-- Columna Roles -->
              <ng-container matColumnDef="roles">
                <th mat-header-cell *matHeaderCellDef>Roles</th>
                <td mat-cell *matCellDef="let user">
                  <mat-chip-set>
                    <mat-chip *ngFor="let role of user.roles" 
                             [class]="getRoleClass(role)">
                      {{getRoleDisplayName(role)}}
                    </mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <!-- Columna Departamento -->
              <ng-container matColumnDef="department">
                <th mat-header-cell *matHeaderCellDef>Departamento</th>
                <td mat-cell *matCellDef="let user">{{user.department || 'N/A'}}</td>
              </ng-container>

              <!-- Columna Estado -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let user">
                  <span class="status-badge" [class.active]="user.isActive" [class.inactive]="!user.isActive">
                    {{user.isActive ? 'Activo' : 'Inactivo'}}
                  </span>
                </td>
              </ng-container>

              <!-- Columna Último Login -->
              <ng-container matColumnDef="lastLogin">
                <th mat-header-cell *matHeaderCellDef>Último Login</th>
                <td mat-cell *matCellDef="let user">
                  {{user.lastLogin ? (user.lastLogin | date:'short') : 'Nunca'}}
                </td>
              </ng-container>

              <!-- Columna Acciones -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let user">
                  <button mat-icon-button color="primary" (click)="openEditDialog(user)" 
                          matTooltip="Editar usuario">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteUser(user)" 
                          matTooltip="Eliminar usuario"
                          [disabled]="user.id === currentUser?.id">
                    <mat-icon>delete</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" (click)="toggleUserStatus(user)" 
                          [matTooltip]="user.isActive ? 'Desactivar' : 'Activar'"
                          [disabled]="user.id === currentUser?.id">
                    <mat-icon>{{user.isActive ? 'toggle_on' : 'toggle_off'}}</mat-icon>
                  </button>
                  <button mat-icon-button color="primary" (click)="resetPassword(user)" 
                          matTooltip="Resetear contraseña">
                    <mat-icon>lock_reset</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <!-- Formulario de creación/edición -->
          <div *ngIf="showForm" class="form-container">
            <mat-card class="form-card">
              <mat-card-header>
                <mat-card-title>
                  {{isEditing ? 'Editar' : 'Nuevo'}} Usuario
                </mat-card-title>
              </mat-card-header>
              
              <mat-card-content>
                <form [formGroup]="userForm" (ngSubmit)="saveUser()">
                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Nombre de Usuario</mat-label>
                      <input matInput formControlName="username" placeholder="Ej: jperez">
                      <mat-error *ngIf="userForm.get('username')?.hasError('required')">
                        El nombre de usuario es requerido
                      </mat-error>
                      <mat-error *ngIf="userForm.get('username')?.hasError('minlength')">
                        Mínimo 3 caracteres
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Email</mat-label>
                      <input matInput type="email" formControlName="email" placeholder="usuario@seismic.com">
                      <mat-error *ngIf="userForm.get('email')?.hasError('required')">
                        El email es requerido
                      </mat-error>
                      <mat-error *ngIf="userForm.get('email')?.hasError('email')">
                        Email inválido
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Nombre</mat-label>
                      <input matInput formControlName="firstName" placeholder="Juan">
                      <mat-error *ngIf="userForm.get('firstName')?.hasError('required')">
                        El nombre es requerido
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Apellido</mat-label>
                      <input matInput formControlName="lastName" placeholder="Pérez">
                      <mat-error *ngIf="userForm.get('lastName')?.hasError('required')">
                        El apellido es requerido
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Teléfono</mat-label>
                      <input matInput formControlName="phone" placeholder="+57 300 123 4567">
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Departamento</mat-label>
                      <input matInput formControlName="department" placeholder="Sismología">
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Cargo</mat-label>
                      <input matInput formControlName="position" placeholder="Analista de Datos">
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Estado</mat-label>
                      <mat-select formControlName="isActive">
                        <mat-option [value]="true">Activo</mat-option>
                        <mat-option [value]="false">Inactivo</mat-option>
                      </mat-select>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Roles</mat-label>
                      <mat-select formControlName="roles" multiple>
                        <mat-option value="SUPER_ADMIN">Super Administrador</mat-option>
                        <mat-option value="ADMIN">Administrador</mat-option>
                        <mat-option value="OPERATOR">Operador</mat-option>
                        <mat-option value="VIEWER">Visualizador</mat-option>
                      </mat-select>
                      <mat-error *ngIf="userForm.get('roles')?.hasError('required')">
                        Debe seleccionar al menos un rol
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row" *ngIf="!isEditing">
                    <mat-form-field appearance="outline">
                      <mat-label>Contraseña</mat-label>
                      <input matInput type="password" formControlName="password" placeholder="Contraseña temporal">
                      <mat-error *ngIf="userForm.get('password')?.hasError('required')">
                        La contraseña es requerida
                      </mat-error>
                      <mat-error *ngIf="userForm.get('password')?.hasError('minlength')">
                        Mínimo 6 caracteres
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Confirmar Contraseña</mat-label>
                      <input matInput type="password" formControlName="confirmPassword" placeholder="Confirmar contraseña">
                      <mat-error *ngIf="userForm.get('confirmPassword')?.hasError('required')">
                        Confirme la contraseña
                      </mat-error>
                      <mat-error *ngIf="userForm.hasError('passwordMismatch')">
                        Las contraseñas no coinciden
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-actions">
                    <button mat-raised-button type="button" (click)="cancelForm()">
                      Cancelar
                    </button>
                    <button mat-raised-button color="primary" type="submit" 
                            [disabled]="userForm.invalid">
                      {{isEditing ? 'Actualizar' : 'Crear'}} Usuario
                    </button>
                  </div>
                </form>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .admin-card {
      margin-bottom: 20px;
    }

    .action-toolbar {
      background: #f5f5f5;
      margin-bottom: 20px;
      border-radius: 4px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .table-container {
      overflow-x: auto;
      margin-bottom: 20px;
    }

    .users-table {
      width: 100%;
      min-width: 1200px;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.active {
      background-color: #4CAF50;
      color: white;
    }

    .status-badge.inactive {
      background-color: #F44336;
      color: white;
    }

    .role-super-admin {
      background-color: #9C27B0 !important;
      color: white !important;
    }

    .role-admin {
      background-color: #FF9800 !important;
      color: white !important;
    }

    .role-operator {
      background-color: #2196F3 !important;
      color: white !important;
    }

    .role-viewer {
      background-color: #4CAF50 !important;
      color: white !important;
    }

    .form-container {
      margin-top: 20px;
    }

    .form-card {
      max-width: 900px;
      margin: 0 auto;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    .form-row mat-form-field.full-width {
      flex: 1 1 100%;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 20px;
    }

    mat-card-header mat-icon {
      margin-right: 8px;
    }

    mat-chip-set {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
  `]
})
export class AdminUsuariosComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['id', 'username', 'fullName', 'email', 'roles', 'department', 'status', 'lastLogin', 'actions'];
  showForm = false;
  isEditing = false;
  currentEditUser: User | null = null;
  currentUser: User | null = null;

  userForm: FormGroup;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: [''],
      department: [''],
      position: [''],
      isActive: [true],
      roles: [[], Validators.required],
      password: [''],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadUsers();
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
      },
      error: (error: any) => {
        console.error('Error cargando usuarios:', error);
        this.snackBar.open('Error cargando usuarios', 'Cerrar', { duration: 3000 });
      }
    });
  }

  openCreateDialog(): void {
    this.showForm = true;
    this.isEditing = false;
    this.currentEditUser = null;
    this.userForm.reset({
      isActive: true,
      roles: []
    });
    
    // Agregar validación de contraseña para nuevo usuario
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('confirmPassword')?.setValidators([Validators.required]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('confirmPassword')?.updateValueAndValidity();
  }

  openEditDialog(user: User): void {
    this.showForm = true;
    this.isEditing = true;
    this.currentEditUser = user;
    this.userForm.patchValue({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || '',
      department: user.department || '',
      position: user.position || '',
      isActive: user.isActive,
      roles: user.roles
    });
    
    // Remover validación de contraseña para edición
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('confirmPassword')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('confirmPassword')?.updateValueAndValidity();
  }

  saveUser(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      
      if (this.isEditing && this.currentEditUser) {
        // Actualizar usuario existente
        const updatedUser: User = {
          ...this.currentEditUser,
          ...formData
        };
        
        // No incluir campos de contraseña en actualización
        delete updatedUser.password;
        
        this.userService.updateUser(updatedUser).subscribe({
          next: () => {
            this.snackBar.open('Usuario actualizado exitosamente', 'Cerrar', { duration: 3000 });
            this.loadUsers();
            this.cancelForm();
          },
          error: (error: any) => {
            console.error('Error actualizando usuario:', error);
            this.snackBar.open('Error actualizando usuario', 'Cerrar', { duration: 3000 });
          }
        });
      } else {
        // Crear nuevo usuario
        const newUser: Partial<User> = {
          ...formData,
          emailVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        this.userService.createUser(newUser).subscribe({
          next: () => {
            this.snackBar.open('Usuario creado exitosamente', 'Cerrar', { duration: 3000 });
            this.loadUsers();
            this.cancelForm();
          },
          error: (error: any) => {
            console.error('Error creando usuario:', error);
            this.snackBar.open('Error creando usuario', 'Cerrar', { duration: 3000 });
          }
        });
      }
    }
  }

  deleteUser(user: User): void {
    if (user.id === this.currentUser?.id) {
      this.snackBar.open('No puedes eliminar tu propio usuario', 'Cerrar', { duration: 3000 });
      return;
    }

    if (confirm(`¿Estás seguro de eliminar el usuario "${user.username}"?`)) {
      this.userService.deleteUser(user.id!).subscribe({
        next: () => {
          this.snackBar.open('Usuario eliminado exitosamente', 'Cerrar', { duration: 3000 });
          this.loadUsers();
        },
        error: (error: any) => {
          console.error('Error eliminando usuario:', error);
          this.snackBar.open('Error eliminando usuario', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  toggleUserStatus(user: User): void {
    if (user.id === this.currentUser?.id) {
      this.snackBar.open('No puedes cambiar tu propio estado', 'Cerrar', { duration: 3000 });
      return;
    }

    const updatedUser = { ...user, isActive: !user.isActive };
    
    this.userService.updateUser(updatedUser).subscribe({
      next: () => {
        this.snackBar.open(
          `Usuario ${updatedUser.isActive ? 'activado' : 'desactivado'} exitosamente`, 
          'Cerrar', 
          { duration: 3000 }
        );
        this.loadUsers();
      },
      error: (error: any) => {
        console.error('Error actualizando estado:', error);
        this.snackBar.open('Error actualizando estado del usuario', 'Cerrar', { duration: 3000 });
      }
    });
  }

  resetPassword(user: User): void {
    if (confirm(`¿Resetear la contraseña del usuario "${user.username}"?`)) {
      this.userService.resetPassword(user.id!).subscribe({
        next: (newPassword: string) => {
          this.snackBar.open(`Contraseña reseteada. Nueva contraseña: ${newPassword}`, 'Cerrar', { duration: 10000 });
        },
        error: (error: any) => {
          console.error('Error reseteando contraseña:', error);
          this.snackBar.open('Error reseteando contraseña', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.isEditing = false;
    this.currentEditUser = null;
    this.userForm.reset();
  }

  refreshData(): void {
    this.loadUsers();
    this.snackBar.open('Datos actualizados', 'Cerrar', { duration: 2000 });
  }

  getRoleClass(role: string): string {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'role-super-admin';
      case UserRole.ADMIN:
        return 'role-admin';
      case UserRole.OPERATOR:
        return 'role-operator';
      case UserRole.VIEWER:
        return 'role-viewer';
      default:
        return '';
    }
  }

  getRoleDisplayName(role: string): string {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'Super Admin';
      case UserRole.ADMIN:
        return 'Admin';
      case UserRole.OPERATOR:
        return 'Operador';
      case UserRole.VIEWER:
        return 'Visualizador';
      default:
        return role;
    }
  }
}

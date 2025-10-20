import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../../services/auth.service';
import { WebSocketService } from '../../../services/websocket.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>Plataforma Sísmica</h1>
          <h2>Manizales</h2>
          <p>Sistema de Monitoreo Sísmico</p>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Usuario</mat-label>
            <input matInput formControlName="username" placeholder="admin">
            <mat-icon matSuffix>person</mat-icon>
            <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
              El usuario es requerido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Contraseña</mat-label>
            <input matInput type="password" formControlName="password" placeholder="password">
            <mat-icon matSuffix>lock</mat-icon>
            <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
              La contraseña es requerida
            </mat-error>
          </mat-form-field>

          <div class="error-message" *ngIf="errorMessage()">
            <mat-icon>error</mat-icon>
            {{ errorMessage() }}
          </div>

          <button mat-raised-button color="primary" type="submit" 
                  [disabled]="loginForm.invalid || loading()" class="login-button">
            <mat-spinner diameter="20" *ngIf="loading()"></mat-spinner>
            <span *ngIf="!loading()">INGRESAR</span>
          </button>
          
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      background: white;
    }

    .login-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .login-header h1 {
      color: #333;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 20px;
    }

    .login-button {
      width: 100%;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      margin-top: 20px;
      border-radius: 8px;
    }

    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 12px;
      border-radius: 8px;
      margin: 16px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }


    mat-form-field {
      width: 100%;
    }

    mat-card-title {
      font-size: 24px;
      font-weight: 600;
      color: #333;
    }

    mat-card-subtitle {
      font-size: 14px;
      color: #666;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private webSocketService: WebSocketService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.errorMessage.set('');

      const credentials = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.loading.set(false);
          console.log('Login exitoso, navegando a dashboard...');
          this.router.navigate(['/dashboard']).then(() => {
            this.webSocketService.connect();
            this.snackBar.open('Bienvenido al sistema', 'Cerrar', { duration: 3000 });
          });
        },
        error: (error) => {
          this.loading.set(false);
          this.snackBar.open('Credenciales inválidas', 'Cerrar', { duration: 5000 });
          console.error('Error de login:', error);
        }
      });
    }
  }
}

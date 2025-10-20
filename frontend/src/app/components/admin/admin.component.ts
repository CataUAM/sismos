import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="admin-container">
      <mat-card class="admin-header">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>admin_panel_settings</mat-icon>
            Panel de Administración
          </mat-card-title>
          <mat-card-subtitle>Gestión completa del sistema sísmico</mat-card-subtitle>
        </mat-card-header>
      </mat-card>

      <nav mat-tab-nav-bar class="admin-nav">
        <a mat-tab-link 
           routerLink="/admin/estaciones" 
           routerLinkActive="active-link"
           #estacionesLink="routerLinkActive"
           [active]="estacionesLink.isActive">
          <mat-icon>location_on</mat-icon>
          Estaciones
        </a>
        
        <a mat-tab-link 
           routerLink="/admin/acelerografos" 
           routerLinkActive="active-link"
           #acelerografosLink="routerLinkActive"
           [active]="acelerografosLink.isActive">
          <mat-icon>speed</mat-icon>
          Acelerógrafos
        </a>
        
        <a mat-tab-link 
           routerLink="/admin/usuarios" 
           routerLinkActive="active-link"
           #usuariosLink="routerLinkActive"
           [active]="usuariosLink.isActive"
           *ngIf="canManageUsers">
          <mat-icon>people</mat-icon>
          Usuarios
        </a>
      </nav>

      <div class="admin-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .admin-header {
      margin-bottom: 20px;
    }

    .admin-header mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .admin-nav {
      margin-bottom: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .admin-nav a {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 120px;
    }

    .admin-content {
      min-height: 500px;
    }

    .active-link {
      background-color: #e3f2fd !important;
      color: #1976d2 !important;
    }
  `]
})
export class AdminComponent {
  canManageUsers: boolean = false;

  constructor(public authService: AuthService) {
    this.canManageUsers = this.authService.canManageUsers();
    console.log('AdminComponent - canManageUsers:', this.canManageUsers);
    console.log('AdminComponent - current user:', this.authService.getCurrentUser());
    console.log('AdminComponent - user roles:', this.authService.getCurrentUser()?.roles);
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { filter } from 'rxjs/operators';

import { AuthService } from './services/auth.service';
import { WebSocketService } from './services/websocket.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule
  ],
  template: `
    <ng-container *ngIf="isLoggedIn; else loginView">
      <div class="app-container">
        <mat-toolbar color="primary" class="toolbar">
          <button mat-icon-button (click)="toggleSidenav()" class="menu-toggle">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="app-title">
            <mat-icon>waves</mat-icon>
            Sistema Sísmico Manizales
          </span>
          <span class="spacer"></span>
          <button mat-icon-button [matMenuTriggerFor]="userMenu" *ngIf="authService.isAuthenticated()">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Cerrar Sesión</span>
            </button>
          </mat-menu>
        </mat-toolbar>

        <mat-sidenav-container class="sidenav-container">
          <mat-sidenav #sidenav [mode]="sidenavMode" [opened]="sidenavOpened" class="sidenav">
            <mat-nav-list>
            <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>Dashboard</span>
            </a>
            <a mat-list-item routerLink="/mapa" routerLinkActive="active">
              <mat-icon matListItemIcon>map</mat-icon>
              <span matListItemTitle>Mapa Interactivo</span>
            </a>
            <a mat-list-item routerLink="/estaciones" routerLinkActive="active">
              <mat-icon matListItemIcon>sensors</mat-icon>
              <span matListItemTitle>Estaciones</span>
            </a>
            
            <mat-divider *ngIf="isAdmin()"></mat-divider>
            <h3 matSubheader *ngIf="isAdmin()">Administración</h3>
            <a mat-list-item routerLink="/admin" routerLinkActive="active" *ngIf="isAdmin()">
              <mat-icon matListItemIcon>admin_panel_settings</mat-icon>
              <span matListItemTitle>Panel de Administración</span>
            </a>
          </mat-nav-list>
          </mat-sidenav>

          <mat-sidenav-content class="main-content">
            <router-outlet></router-outlet>
          </mat-sidenav-content>
        </mat-sidenav-container>
      </div>
    </ng-container>

    <ng-template #loginView>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-toolbar {
      position: fixed;
      top: 0;
      z-index: 1000;
      width: 100%;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .sidenav-container {
      flex: 1;
    }

    .sidenav {
      width: 250px;
      background-color: #f5f5f5;
    }

    .menu-toggle {
      margin-right: 16px;
    }

    .app-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .main-content {
      padding: 20px;
      background-color: #fafafa;
    }

    .active {
      background-color: #e3f2fd !important;
      color: #1976d2 !important;
    }

    mat-nav-list a {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      text-decoration: none;
      color: #333;
    }

    mat-nav-list a mat-icon {
      margin-right: 16px;
    }
  `]
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  title = 'seismic-platform-frontend';
  isLoggedIn = false;
  sidenavMode: 'side' | 'over' = 'side';
  sidenavOpened = true;

  constructor(
    public authService: AuthService,
    public router: Router,
    private webSocketService: WebSocketService
  ) {
    // Siempre iniciar en false, el observable actualizará el estado
    this.isLoggedIn = false;
  }

  ngOnInit() {
    console.log('App component initialized');
    
    // Actualizar isLoggedIn basado en la ruta actual y el estado de autenticación
    this.updateLoginState();
    
    // Escuchar cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      console.log('Navigation ended:', (event as NavigationEnd).url);
      this.updateLoginState();
    });
    
    // Subscribe to authentication changes
    this.authService.currentUser$.subscribe(user => {
      console.log('User changed:', user ? user.username : 'null');
      const wasLoggedIn = this.isLoggedIn;
      
      if (!user && wasLoggedIn) {
        // User just logged out
        console.log('User logged out');
        this.isLoggedIn = false;
        this.webSocketService.disconnect();
        this.router.navigate(['/login']);
      } else if (user) {
        // User logged in, update state based on current route
        console.log('User logged in, updating state');
        this.updateLoginState();
      }
    });
  }
  
  private updateLoginState(): void {
    const hasUser = this.authService.isAuthenticated();
    const isLoginRoute = this.router.url === '/login' || this.router.url === '/';
    
    this.isLoggedIn = hasUser && !isLoginRoute;
    
    console.log('Login state updated:', { 
      hasUser, 
      isLoginRoute, 
      isLoggedIn: this.isLoggedIn, 
      currentUrl: this.router.url 
    });
  }

  toggleSidenav() {
    if (this.sidenavMode === 'side') {
      // En modo side, cambiar a over y cerrar
      this.sidenavMode = 'over';
      this.sidenavOpened = false;
    } else {
      // En modo over, cambiar a side y abrir
      this.sidenavMode = 'side';
      this.sidenavOpened = true;
    }
  }

  closeSidenav() {
    if (this.sidenavMode === 'over') {
      this.sidenavOpened = false;
    }
  }

  logout() {
    this.authService.logout();
    this.webSocketService.disconnect();
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.authService.hasRole('ADMIN');
  }
}

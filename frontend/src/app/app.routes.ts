import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AuthService } from './services/auth.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'mapa',
    loadComponent: () => import('./components/mapa/mapa.component').then(m => m.MapaComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'estaciones',
    loadComponent: () => import('./components/estaciones/estaciones.component').then(m => m.EstacionesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [AdminGuard],
    children: [
      {
        path: 'estaciones',
        loadComponent: () => import('./components/admin/admin-estaciones.component').then(m => m.AdminEstacionesComponent)
      },
      {
        path: 'acelerografos',
        loadComponent: () => import('./components/admin/admin-acelerografos.component').then(m => m.AdminAcelerografosComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./components/admin/admin-usuarios.component').then(m => m.AdminUsuariosComponent),
        canActivate: [() => inject(AuthService).canManageUsers()]
      },
      {
        path: '',
        redirectTo: 'estaciones',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

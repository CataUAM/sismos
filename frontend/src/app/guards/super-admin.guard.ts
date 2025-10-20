import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.canManageUsers()) {
      return true;
    }
    
    // Redirigir a página principal si no tiene permisos
    this.router.navigate(['/dashboard']);
    return false;
  }
}

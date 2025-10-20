import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      return true;
    }

    this.snackBar.open('Acceso denegado. Solo administradores pueden acceder a esta sección.', 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
    
    this.router.navigate(['/dashboard']);
    return false;
  }
}

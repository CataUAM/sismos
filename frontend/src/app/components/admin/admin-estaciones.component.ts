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

import { Estacion } from '../../models/estacion.model';
import { EstacionService } from '../../services/estacion.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { UserAssignmentDialogComponent } from '../user-assignment-dialog/user-assignment-dialog.component';

@Component({
  selector: 'app-admin-estaciones',
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
    MatTooltipModule
  ],
  template: `
    <div class="admin-container">
      <mat-card class="admin-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>admin_panel_settings</mat-icon>
            Administración de Estaciones Sísmicas
          </mat-card-title>
          <mat-card-subtitle>Gestión completa de estaciones de monitoreo</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <!-- Toolbar con acciones -->
          <mat-toolbar class="action-toolbar">
            <span>Estaciones Registradas</span>
            <span class="spacer"></span>
            <button mat-raised-button color="primary" (click)="openCreateDialog()">
              <mat-icon>add</mat-icon>
              Nueva Estación
            </button>
            <button mat-raised-button color="accent" (click)="refreshData()">
              <mat-icon>refresh</mat-icon>
              Actualizar
            </button>
          </mat-toolbar>

          <!-- Tabla de estaciones -->
          <div class="table-container">
            <table mat-table [dataSource]="estaciones" class="estaciones-table">
              
              <!-- Columna ID -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let estacion">{{estacion.id}}</td>
              </ng-container>

              <!-- Columna Nombre -->
              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let estacion">{{estacion.nombre}}</td>
              </ng-container>

              <!-- Columna Ubicación -->
              <ng-container matColumnDef="ubicacion">
                <th mat-header-cell *matHeaderCellDef>Ubicación</th>
                <td mat-cell *matCellDef="let estacion">{{estacion.ubicacion}}</td>
              </ng-container>

              <!-- Columna Coordenadas -->
              <ng-container matColumnDef="coordenadas">
                <th mat-header-cell *matHeaderCellDef>Coordenadas</th>
                <td mat-cell *matCellDef="let estacion">
                  {{estacion.latitud}}, {{estacion.longitud}}
                </td>
              </ng-container>

              <!-- Columna Estado -->
              <ng-container matColumnDef="estado">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let estacion">
                  <span class="estado-badge" [class.activa]="estacion.activa" [class.inactiva]="!estacion.activa">
                    {{estacion.activa ? 'Activa' : 'Inactiva'}}
                  </span>
                </td>
              </ng-container>

              <!-- Columna Usuarios Asignados -->
              <ng-container matColumnDef="usuarios">
                <th mat-header-cell *matHeaderCellDef>Usuarios Asignados</th>
                <td mat-cell *matCellDef="let estacion">
                  <button mat-icon-button color="accent" (click)="openUserAssignmentDialog(estacion)" 
                          matTooltip="Gestionar usuarios asignados">
                    <mat-icon>people</mat-icon>
                  </button>
                  <span class="user-count">{{getUserCount(estacion.id)}}</span>
                </td>
              </ng-container>

              <!-- Columna Acciones -->
              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let estacion">
                  <button mat-icon-button color="primary" (click)="openEditDialog(estacion)" 
                          matTooltip="Editar estación">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteEstacion(estacion)" 
                          matTooltip="Eliminar estación">
                    <mat-icon>delete</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" (click)="toggleEstado(estacion)" 
                          [matTooltip]="estacion.activa ? 'Desactivar' : 'Activar'">
                    <mat-icon>{{estacion.activa ? 'toggle_on' : 'toggle_off'}}</mat-icon>
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
                  {{isEditing ? 'Editar' : 'Nueva'}} Estación
                </mat-card-title>
              </mat-card-header>
              
              <mat-card-content>
                <form [formGroup]="estacionForm" (ngSubmit)="saveEstacion()">
                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Nombre</mat-label>
                      <input matInput formControlName="nombre" placeholder="Ej: Estación Centro">
                      <mat-error *ngIf="estacionForm.get('nombre')?.hasError('required')">
                        El nombre es requerido
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Ubicación</mat-label>
                      <input matInput formControlName="ubicacion" placeholder="Ej: Centro de Manizales">
                      <mat-error *ngIf="estacionForm.get('ubicacion')?.hasError('required')">
                        La ubicación es requerida
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Latitud</mat-label>
                      <input matInput type="number" formControlName="latitud" 
                             placeholder="Ej: 5.0703" step="0.000001">
                      <mat-error *ngIf="estacionForm.get('latitud')?.hasError('required')">
                        La latitud es requerida
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Longitud</mat-label>
                      <input matInput type="number" formControlName="longitud" 
                             placeholder="Ej: -75.5138" step="0.000001">
                      <mat-error *ngIf="estacionForm.get('longitud')?.hasError('required')">
                        La longitud es requerida
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Estado</mat-label>
                      <mat-select formControlName="activa">
                        <mat-option [value]="true">Activa</mat-option>
                        <mat-option [value]="false">Inactiva</mat-option>
                      </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Descripción</mat-label>
                      <textarea matInput formControlName="descripcion" rows="3" placeholder="Descripción opcional de la estación"></textarea>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width" *ngIf="isAdminUser()">
                      <mat-label>Usuarios Asignados</mat-label>
                      <mat-select formControlName="assignedUsers" multiple>
                        <mat-option *ngFor="let user of users" [value]="user.id">
                          {{user.firstName}} {{user.lastName}} ({{user.username}})
                        </mat-option>
                      </mat-select>
                      <mat-hint>Selecciona los usuarios que tendrán acceso a esta estación</mat-hint>
                    </mat-form-field>
                  </div>

                  <div class="form-actions">
                    <button mat-raised-button type="button" (click)="cancelForm()">
                      Cancelar
                    </button>
                    <button mat-raised-button color="primary" type="submit" 
                            [disabled]="estacionForm.invalid">
                      {{isEditing ? 'Actualizar' : 'Crear'}} Estación
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
      max-width: 1200px;
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

    .estaciones-table {
      width: 100%;
      min-width: 800px;
    }

    .estado-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .estado-badge.activa {
      background-color: #4CAF50;
      color: white;
    }

    .estado-badge.inactiva {
      background-color: #F44336;
      color: white;
    }

    .form-container {
      margin-top: 20px;
    }

    .form-card {
      max-width: 800px;
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

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 20px;
    }

    mat-card-header mat-icon {
      margin-right: 8px;
    }
  `]
})
export class AdminEstacionesComponent implements OnInit {
  estaciones: Estacion[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'ubicacion', 'coordenadas', 'estado', 'usuarios', 'acciones'];
  showForm = false;
  isEditing = false;
  currentEstacion: Estacion | null = null;

  estacionForm: FormGroup;

  users: User[] = [];
  stationUsers: Map<number, User[]> = new Map();
  currentUser: User | null = null; // Usuario logueado actual

  constructor(
    private estacionService: EstacionService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.estacionForm = this.fb.group({
      nombre: ['', Validators.required],
      ubicacion: ['', Validators.required],
      latitud: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitud: ['', [Validators.required, Validators.min(-180), Validators.max(180)]],
      activa: [true],
      descripcion: [''],
      assignedUsers: [[]]
    });
  }

  ngOnInit(): void {
    this.setCurrentUser();
    this.loadUsers();
    this.loadEstaciones();
  }

  setCurrentUser(): void {
    // Simulación de usuario logueado - en producción vendría del servicio de autenticación
    // Cambiar entre estos usuarios para probar diferentes roles:
    
    // ADMIN - Ve todas las estaciones
    // this.currentUser = {
    //   id: 1,
    //   username: 'admin',
    //   email: 'admin@seismic.com',
    //   firstName: 'Admin',
    //   lastName: 'User',
    //   roles: ['ADMIN']
    // } as User;

    // OPERATOR - Solo ve estaciones asignadas (MAN001, MAN002, MAN003)
    this.currentUser = {
      id: 2,
      username: 'operator_manizales',
      email: 'operator.manizales@seismic.com',
      firstName: 'Juan Carlos',
      lastName: 'Rodríguez',
      roles: ['OPERATOR']
    } as User;

    // VIEWER - Solo lectura de estación asignada (MAN001)
    // this.currentUser = {
    //   id: 4,
    //   username: 'viewer_universidad',
    //   email: 'viewer.universidad@seismic.com',
    //   firstName: 'Dr. Carlos',
    //   lastName: 'Pérez',
    //   roles: ['VIEWER']
    // } as User;
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error cargando usuarios:', error);
      }
    });
  }

  loadEstaciones(): void {
    console.log('Iniciando carga de estaciones...');
    console.log('Usuario actual:', this.currentUser);
    console.log('Es admin?', this.isAdminUser());
    
    // Si el usuario es ADMIN o SUPER_ADMIN, ve todas las estaciones
    // Si es OPERATOR o VIEWER, solo ve las asignadas
    if (this.isAdminUser()) {
      console.log('Cargando todas las estaciones (usuario admin)');
      this.estacionService.getEstaciones().subscribe({
        next: (estaciones) => {
          console.log('Estaciones cargadas:', estaciones);
          this.estaciones = estaciones;
          this.loadStationUsers();
        },
        error: (error) => {
          console.error('Error cargando estaciones:', error);
          this.snackBar.open('Error cargando estaciones', 'Cerrar', { duration: 3000 });
        }
      });
    } else if (this.currentUser?.id) {
      console.log('Cargando estaciones del usuario:', this.currentUser.id);
      this.estacionService.getEstacionesByUser(this.currentUser.id).subscribe({
        next: (estaciones) => {
          console.log('Estaciones del usuario cargadas:', estaciones);
          this.estaciones = estaciones;
          this.loadStationUsers();
        },
        error: (error) => {
          console.error('Error cargando estaciones del usuario:', error);
          this.snackBar.open('Error cargando estaciones asignadas', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      console.warn('No se puede cargar estaciones: usuario no definido');
    }
  }

  loadStationUsers(): void {
    this.estaciones.forEach(estacion => {
      if (estacion.id) {
        this.estacionService.getStationUsers(estacion.id).subscribe({
          next: (users) => {
            this.stationUsers.set(estacion.id!, users);
          },
          error: (error) => {
            console.error(`Error cargando usuarios de estación ${estacion.id}:`, error);
          }
        });
      }
    });
  }

  isAdminUser(): boolean {
    return this.currentUser?.roles?.includes('ADMIN') || 
           this.currentUser?.roles?.includes('SUPER_ADMIN') || false;
  }

  openCreateDialog(): void {
    this.showForm = true;
    this.isEditing = false;
    this.currentEstacion = null;
    this.estacionForm.reset({
      activa: true
    });
  }

  openEditDialog(estacion: Estacion): void {
    this.showForm = true;
    this.isEditing = true;
    this.currentEstacion = estacion;
    
    // Cargar usuarios asignados a la estación
    const assignedUserIds = this.stationUsers.get(estacion.id!)?.map(u => u.id) || [];
    
    this.estacionForm.patchValue({
      nombre: estacion.nombre,
      ubicacion: estacion.ubicacion,
      latitud: estacion.latitud,
      longitud: estacion.longitud,
      activa: estacion.activa,
      descripcion: estacion.descripcion,
      assignedUsers: assignedUserIds
    });
  }

  saveEstacion(): void {
    if (this.estacionForm.valid) {
      const formData = this.estacionForm.value;
      
      if (this.isEditing && this.currentEstacion) {
        // Actualizar estación existente
        const updatedEstacion: Estacion = {
          ...this.currentEstacion,
          ...formData
        };
        
        this.estacionService.updateEstacion(updatedEstacion).subscribe({
          next: () => {
            this.snackBar.open('Estación actualizada exitosamente', 'Cerrar', { duration: 3000 });
            this.loadEstaciones();
            this.cancelForm();
          },
          error: (error) => {
            console.error('Error actualizando estación:', error);
            this.snackBar.open('Error actualizando estación', 'Cerrar', { duration: 3000 });
          }
        });
      } else {
        // Crear nueva estación
        const newEstacion: Partial<Estacion> = formData;
        
        this.estacionService.createEstacion(newEstacion).subscribe({
          next: (estacion) => {
            // Asignar usuarios seleccionados a la nueva estación
            const assignedUsers = formData.assignedUsers || [];
            if (assignedUsers.length > 0 && estacion.id) {
              this.assignUsersToStation(estacion.id, assignedUsers);
            }
            
            this.snackBar.open('Estación creada exitosamente', 'Cerrar', { duration: 3000 });
            this.loadEstaciones();
            this.cancelForm();
          },
          error: (error) => {
            console.error('Error creando estación:', error);
            this.snackBar.open('Error creando estación', 'Cerrar', { duration: 3000 });
          }
        });
      }
    }
  }

  deleteEstacion(estacion: Estacion): void {
    if (confirm(`¿Estás seguro de eliminar la estación "${estacion.nombre}"?`)) {
      this.estacionService.deleteEstacion(estacion.id!).subscribe({
        next: () => {
          this.snackBar.open('Estación eliminada exitosamente', 'Cerrar', { duration: 3000 });
          this.loadEstaciones();
        },
        error: (error) => {
          console.error('Error eliminando estación:', error);
          this.snackBar.open('Error eliminando estación', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  toggleEstado(estacion: Estacion): void {
    const updatedEstacion = { ...estacion, activa: !estacion.activa };
    
    this.estacionService.updateEstacion(updatedEstacion).subscribe({
      next: () => {
        this.snackBar.open(
          `Estación ${updatedEstacion.activa ? 'activada' : 'desactivada'} exitosamente`, 
          'Cerrar', 
          { duration: 3000 }
        );
        this.loadEstaciones();
      },
      error: (error) => {
        console.error('Error actualizando estado:', error);
        this.snackBar.open('Error actualizando estado de la estación', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cancelForm(): void {
    this.showForm = false;
    this.isEditing = false;
    this.currentEstacion = null;
    this.estacionForm.reset();
  }

  refreshData(): void {
    this.loadEstaciones();
    this.snackBar.open('Datos actualizados', 'Cerrar', { duration: 2000 });
  }

  getUserCount(stationId: number): number {
    return this.stationUsers.get(stationId)?.length || 0;
  }

  openUserAssignmentDialog(estacion: Estacion): void {
    const dialogRef = this.dialog.open(UserAssignmentDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { estacion }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Recargar los usuarios de las estaciones si hubo cambios
        this.loadStationUsers();
        this.snackBar.open('Asignaciones de usuarios actualizadas', 'Cerrar', { duration: 3000 });
      }
    });
  }

  assignUserToStation(stationId: number, userId: number): void {
    this.estacionService.assignUserToStation(stationId, userId).subscribe({
      next: () => {
        this.snackBar.open('Usuario asignado exitosamente', 'Cerrar', { duration: 3000 });
        this.loadStationUsers();
      },
      error: (error) => {
        console.error('Error asignando usuario:', error);
        this.snackBar.open('Error asignando usuario', 'Cerrar', { duration: 3000 });
      }
    });
  }

  removeUserFromStation(stationId: number, userId: number): void {
    this.estacionService.removeUserFromStation(stationId, userId).subscribe({
      next: () => {
        this.snackBar.open('Usuario removido exitosamente', 'Cerrar', { duration: 3000 });
        this.loadStationUsers();
      },
      error: (error) => {
        console.error('Error removiendo usuario:', error);
        this.snackBar.open('Error removiendo usuario', 'Cerrar', { duration: 3000 });
      }
    });
  }

  assignUsersToStation(stationId: number, userIds: number[]): void {
    const assignments = userIds.map(userId => 
      this.estacionService.assignUserToStation(stationId, userId).toPromise()
    );

    Promise.all(assignments).then(() => {
      this.loadStationUsers();
    }).catch(error => {
      console.error('Error asignando usuarios:', error);
      this.snackBar.open('Error asignando algunos usuarios', 'Cerrar', { duration: 3000 });
    });
  }
}

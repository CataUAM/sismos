import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

import { User } from '../../models/user.model';
import { Estacion } from '../../models/estacion.model';
import { EstacionService } from '../../services/estacion.service';
import { UserService } from '../../services/user.service';

export interface UserAssignmentDialogData {
  estacion: Estacion;
}

@Component({
  selector: 'app-user-assignment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="user-assignment-dialog">
      <h2 mat-dialog-title>
        <mat-icon>people</mat-icon>
        Gestionar Usuarios - {{data.estacion.nombre}}
      </h2>
      
      <mat-dialog-content>
        <div class="station-info">
          <p><strong>Código:</strong> {{data.estacion.codigo}}</p>
          <p><strong>Ubicación:</strong> {{data.estacion.ubicacion}}</p>
        </div>

        <div class="users-section" *ngIf="!loading; else loadingTemplate">
          <h3>Seleccionar Usuarios</h3>
          <mat-list class="user-list">
            <mat-list-item *ngFor="let user of allUsers" class="user-item">
              <mat-checkbox 
                [checked]="isUserAssigned(user.id!)"
                (change)="toggleUserAssignment(user, $event.checked)"
                [disabled]="updating">
                <div class="user-info">
                  <div class="user-name">{{user.firstName}} {{user.lastName}}</div>
                  <div class="user-details">{{user.username}} - {{user.email}}</div>
                  <div class="user-role">{{getUserRoles(user)}}</div>
                </div>
              </mat-checkbox>
            </mat-list-item>
          </mat-list>
        </div>

        <ng-template #loadingTemplate>
          <div class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Cargando usuarios...</p>
          </div>
        </ng-template>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" (click)="onSave()" [disabled]="updating">
          <mat-icon *ngIf="updating">hourglass_empty</mat-icon>
          {{updating ? 'Guardando...' : 'Guardar Cambios'}}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .user-assignment-dialog {
      min-width: 500px;
      max-width: 600px;
    }

    .station-info {
      background-color: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .station-info p {
      margin: 4px 0;
    }

    .users-section h3 {
      margin: 20px 0 10px 0;
      color: #333;
    }

    .user-list {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
    }

    .user-item {
      border-bottom: 1px solid #f0f0f0;
    }

    .user-item:last-child {
      border-bottom: none;
    }

    .user-info {
      margin-left: 12px;
    }

    .user-name {
      font-weight: 500;
      font-size: 14px;
    }

    .user-details {
      font-size: 12px;
      color: #666;
      margin-top: 2px;
    }

    .user-role {
      font-size: 11px;
      color: #888;
      margin-top: 2px;
      font-style: italic;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
    }

    .loading-container p {
      margin-top: 16px;
      color: #666;
    }

    mat-dialog-actions {
      padding: 16px 24px;
    }

    mat-checkbox {
      width: 100%;
    }

    ::ng-deep .mat-mdc-checkbox .mdc-checkbox {
      align-self: flex-start;
      margin-top: 4px;
    }
  `]
})
export class UserAssignmentDialogComponent implements OnInit {
  allUsers: User[] = [];
  assignedUserIds: Set<number> = new Set();
  originalAssignedIds: Set<number> = new Set();
  loading = true;
  updating = false;

  constructor(
    public dialogRef: MatDialogRef<UserAssignmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserAssignmentDialogData,
    private estacionService: EstacionService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    
    // Cargar todos los usuarios y usuarios asignados en paralelo
    Promise.all([
      this.userService.getUsers().toPromise(),
      this.estacionService.getStationUsers(this.data.estacion.id!).toPromise()
    ]).then(([allUsers, assignedUsers]) => {
      this.allUsers = allUsers || [];
      const assigned = assignedUsers || [];
      
      this.assignedUserIds = new Set(assigned.map(u => u.id));
      this.originalAssignedIds = new Set(assigned.map(u => u.id));
      
      this.loading = false;
    }).catch(error => {
      console.error('Error cargando datos:', error);
      this.snackBar.open('Error cargando datos de usuarios', 'Cerrar', { duration: 3000 });
      this.loading = false;
    });
  }

  isUserAssigned(userId: number): boolean {
    return this.assignedUserIds.has(userId);
  }

  toggleUserAssignment(user: User, isAssigned: boolean): void {
    if (isAssigned) {
      this.assignedUserIds.add(user.id!);
    } else {
      this.assignedUserIds.delete(user.id!);
    }
  }

  getUserRoles(user: User): string {
    return user.roles?.join(', ') || 'Sin rol';
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSave(): void {
    this.updating = true;
    
    const toAssign = Array.from(this.assignedUserIds).filter(id => !this.originalAssignedIds.has(id));
    const toRemove = Array.from(this.originalAssignedIds).filter(id => !this.assignedUserIds.has(id));
    
    const operations: Promise<any>[] = [];
    
    // Asignar nuevos usuarios
    toAssign.forEach(userId => {
      operations.push(
        this.estacionService.assignUserToStation(this.data.estacion.id!, userId).toPromise()
      );
    });
    
    // Remover usuarios desasignados
    toRemove.forEach(userId => {
      operations.push(
        this.estacionService.removeUserFromStation(this.data.estacion.id!, userId).toPromise()
      );
    });
    
    if (operations.length === 0) {
      this.snackBar.open('No hay cambios para guardar', 'Cerrar', { duration: 2000 });
      this.updating = false;
      return;
    }
    
    Promise.all(operations).then(() => {
      this.snackBar.open('Asignaciones actualizadas exitosamente', 'Cerrar', { duration: 3000 });
      this.dialogRef.close(true);
    }).catch(error => {
      console.error('Error actualizando asignaciones:', error);
      this.snackBar.open('Error actualizando asignaciones', 'Cerrar', { duration: 3000 });
    }).finally(() => {
      this.updating = false;
    });
  }
}

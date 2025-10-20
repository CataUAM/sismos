import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Estacion } from '../../models/estacion.model';
import { EstacionService } from '../../services/estacion.service';

@Component({
  selector: 'app-estaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="estaciones-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Gestión de Estaciones Sísmicas</mat-card-title>
          <mat-card-subtitle>Administración y monitoreo de estaciones</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <!-- Barra de búsqueda -->
          <div class="search-bar">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar estaciones</mat-label>
              <input matInput [(ngModel)]="searchTerm" (input)="onSearch()" placeholder="Código o nombre de estación">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            <button mat-raised-button color="primary" (click)="loadEstaciones()">
              <mat-icon>refresh</mat-icon>
              Actualizar
            </button>
          </div>

          <!-- Tabla de estaciones -->
          <div class="table-container" *ngIf="!loading; else loadingTemplate">
            <table mat-table [dataSource]="estaciones" class="estaciones-table">
              <!-- Columna Código -->
              <ng-container matColumnDef="codigo">
                <th mat-header-cell *matHeaderCellDef>Código</th>
                <td mat-cell *matCellDef="let estacion">
                  <strong>{{ estacion.codigo }}</strong>
                </td>
              </ng-container>

              <!-- Columna Nombre -->
              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let estacion">{{ estacion.nombre }}</td>
              </ng-container>

              <!-- Columna Ubicación -->
              <ng-container matColumnDef="ubicacion">
                <th mat-header-cell *matHeaderCellDef>Ubicación</th>
                <td mat-cell *matCellDef="let estacion">
                  <div class="ubicacion-info" *ngIf="estacion.latitud && estacion.longitud">
                    <span>{{ estacion.latitud | number:'1.4-4' }}, {{ estacion.longitud | number:'1.4-4' }}</span>
                    <small *ngIf="estacion.altura">{{ estacion.altura }}m</small>
                  </div>
                  <span *ngIf="!estacion.latitud || !estacion.longitud" class="no-data">Sin coordenadas</span>
                </td>
              </ng-container>

              <!-- Columna Estado -->
              <ng-container matColumnDef="estado">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let estacion">
                  <mat-chip [class.active-chip]="estacion.estado === 1" [class.inactive-chip]="estacion.estado !== 1">
                    {{ estacion.estado === 1 ? 'Activa' : 'Inactiva' }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Columna Sensores -->
              <ng-container matColumnDef="sensores">
                <th mat-header-cell *matHeaderCellDef>Sensores</th>
                <td mat-cell *matCellDef="let estacion">
                  <mat-chip>{{ estacion.totalSensores || 0 }}</mat-chip>
                </td>
              </ng-container>

              <!-- Columna Geología -->
              <ng-container matColumnDef="geologia">
                <th mat-header-cell *matHeaderCellDef>Geología</th>
                <td mat-cell *matCellDef="let estacion">
                  {{ estacion.geologia || 'No especificada' }}
                </td>
              </ng-container>

              <!-- Columna Red -->
              <ng-container matColumnDef="red">
                <th mat-header-cell *matHeaderCellDef>Red</th>
                <td mat-cell *matCellDef="let estacion">
                  {{ estacion.red || '-' }}
                </td>
              </ng-container>

              <!-- Columna Acciones -->
              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let estacion">
                  <button mat-icon-button color="primary" (click)="verDetalles(estacion)" 
                          matTooltip="Ver detalles">
                    <mat-icon>visibility</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                  [class.inactive-row]="row.estado !== 1"></tr>
            </table>

            <div *ngIf="estaciones.length === 0" class="no-data-message">
              <mat-icon>info</mat-icon>
              <p>No se encontraron estaciones</p>
            </div>
          </div>

          <ng-template #loadingTemplate>
            <div class="loading-container">
              <mat-spinner></mat-spinner>
              <p>Cargando estaciones...</p>
            </div>
          </ng-template>
        </mat-card-content>
      </mat-card>

      <!-- Card de detalles de estación seleccionada -->
      <mat-card *ngIf="estacionSeleccionada" class="detalles-card">
        <mat-card-header>
          <mat-card-title>Detalles de Estación</mat-card-title>
          <mat-card-subtitle>{{ estacionSeleccionada.codigo }} - {{ estacionSeleccionada.nombre }}</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="detalles-grid">
            <div class="detalle-item">
              <strong>Código:</strong>
              <span>{{ estacionSeleccionada.codigo }}</span>
            </div>
            <div class="detalle-item">
              <strong>Nombre:</strong>
              <span>{{ estacionSeleccionada.nombre }}</span>
            </div>
            <div class="detalle-item">
              <strong>Estado:</strong>
              <mat-chip [class.active-chip]="estacionSeleccionada.estado === 1" 
                       [class.inactive-chip]="estacionSeleccionada.estado !== 1">
                {{ estacionSeleccionada.estado === 1 ? 'Activa' : 'Inactiva' }}
              </mat-chip>
            </div>
            <div class="detalle-item">
              <strong>Coordenadas:</strong>
              <span *ngIf="estacionSeleccionada.latitud && estacionSeleccionada.longitud">
                {{ estacionSeleccionada.latitud | number:'1.6-6' }}, {{ estacionSeleccionada.longitud | number:'1.6-6' }}
              </span>
              <span *ngIf="!estacionSeleccionada.latitud || !estacionSeleccionada.longitud">No disponibles</span>
            </div>
            <div class="detalle-item">
              <strong>Altura:</strong>
              <span>{{ estacionSeleccionada.altura ? (estacionSeleccionada.altura + ' m') : 'No especificada' }}</span>
            </div>
            <div class="detalle-item">
              <strong>Geología:</strong>
              <span>{{ estacionSeleccionada.geologia || 'No especificada' }}</span>
            </div>
            <div class="detalle-item">
              <strong>Red:</strong>
              <span>{{ estacionSeleccionada.red || 'No especificada' }}</span>
            </div>
            <div class="detalle-item">
              <strong>Total Sensores:</strong>
              <span>{{ estacionSeleccionada.totalSensores || 0 }}</span>
            </div>
          </div>
        </mat-card-content>
        
        <mat-card-actions>
          <button mat-button (click)="cerrarDetalles()">Cerrar</button>
          <button mat-raised-button color="primary" (click)="verEnMapa(estacionSeleccionada)">
            <mat-icon>map</mat-icon>
            Ver en Mapa
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .estaciones-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .search-bar {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      align-items: center;
    }

    .search-field {
      flex: 1;
      max-width: 400px;
    }

    .table-container {
      overflow-x: auto;
    }

    .estaciones-table {
      width: 100%;
      min-width: 800px;
    }

    .ubicacion-info {
      display: flex;
      flex-direction: column;
    }

    .ubicacion-info small {
      color: #666;
      font-size: 11px;
    }

    .active-chip {
      background-color: #e8f5e8 !important;
      color: #2e7d32 !important;
    }

    .inactive-chip {
      background-color: #ffebee !important;
      color: #c62828 !important;
    }

    .inactive-row {
      opacity: 0.6;
    }

    .no-data, .no-data-message {
      color: #666;
      font-style: italic;
    }

    .no-data-message {
      text-align: center;
      padding: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      gap: 16px;
    }

    .detalles-card {
      margin-top: 24px;
    }

    .detalles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }

    .detalle-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }

    .detalle-item strong {
      color: #333;
      min-width: 120px;
    }

    @media (max-width: 768px) {
      .search-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .detalles-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EstacionesComponent implements OnInit {
  estaciones: Estacion[] = [];
  estacionSeleccionada: Estacion | null = null;
  loading = false;
  searchTerm = '';
  
  displayedColumns: string[] = [
    'codigo', 'nombre', 'ubicacion', 'estado', 'sensores', 'geologia', 'red', 'acciones'
  ];

  constructor(
    private estacionService: EstacionService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEstaciones();
  }

  loadEstaciones(): void {
    this.loading = true;
    this.estacionService.getAllEstaciones().subscribe({
      next: (estaciones) => {
        this.estaciones = estaciones;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando estaciones:', error);
        this.snackBar.open('Error cargando estaciones', 'Cerrar', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.loading = true;
      this.estacionService.buscarEstaciones(this.searchTerm).subscribe({
        next: (estaciones) => {
          this.estaciones = estaciones;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error buscando estaciones:', error);
          this.snackBar.open('Error en la búsqueda', 'Cerrar', { duration: 5000 });
          this.loading = false;
        }
      });
    } else {
      this.loadEstaciones();
    }
  }

  verDetalles(estacion: Estacion): void {
    this.estacionSeleccionada = estacion;
  }

  cerrarDetalles(): void {
    this.estacionSeleccionada = null;
  }


  verEnMapa(estacion: Estacion): void {
    // Navegar al mapa con la estación seleccionada
    if (estacion.latitud && estacion.longitud) {
      this.router.navigate(['/mapa'], {
        queryParams: {
          lat: estacion.latitud,
          lng: estacion.longitud,
          estacionId: estacion.id,
          zoom: 15
        }
      });
    } else {
      this.snackBar.open('Esta estación no tiene coordenadas válidas', 'Cerrar', { duration: 3000 });
    }
  }

}

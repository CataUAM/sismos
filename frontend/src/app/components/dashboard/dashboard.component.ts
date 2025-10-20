import { Component, OnInit, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EstacionService } from '../../services/estacion.service';
import { SensorService, SensorDataDto } from '../../services/sensor.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Estacion } from '../../models/estacion.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Panel de Control Sísmico</h1>
        <p>Monitoreo en tiempo real de la actividad sísmica</p>
      </div>

      <!-- Estadísticas principales -->
      <div class="stats-grid">
        <mat-card class="stat-card active-stations">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>sensors</mat-icon>
              </div>
              <div class="stat-info">
                <h2>{{ totalEstaciones() }}</h2>
                <p>Estaciones Activas</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stat-card readings-today">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>timeline</mat-icon>
              </div>
              <div class="stat-info">
                <h2>{{ totalLecturasHoy() }}</h2>
                <p>Lecturas Hoy</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stat-card websocket-status" [class.online]="isConnected()">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>{{ isConnected() ? 'wifi' : 'wifi_off' }}</mat-icon>
              </div>
              <div class="stat-info">
                <h2>{{ isConnected() ? 'ONLINE' : 'OFFLINE' }}</h2>
                <p>Estado Conexión</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stat-card alerts">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>warning</mat-icon>
              </div>
              <div class="stat-info">
                <h2>{{ alertasActivas() }}</h2>
                <p>Alertas Activas</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Sección principal con gestión de estaciones y gráficos -->
      <div class="main-content">
        <div class="col-md-8">
          <mat-card class="dashboard-card">
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
                <table mat-table [dataSource]="filteredEstaciones" class="estaciones-table">
                  <!-- Columna Estado -->
                  <ng-container matColumnDef="estado">
                    <th mat-header-cell *matHeaderCellDef>Estado</th>
                    <td mat-cell *matCellDef="let estacion">
                      <div class="status-indicator" [class.active]="estacion.estado === 1" [class.inactive]="estacion.estado !== 1">
                        <mat-icon>{{ estacion.estado === 1 ? 'check_circle' : 'cancel' }}</mat-icon>
                        {{ estacion.estado === 1 ? 'Activa' : 'Inactiva' }}
                      </div>
                    </td>
                  </ng-container>

                  <!-- Columna Código -->
                  <ng-container matColumnDef="codigo">
                    <th mat-header-cell *matHeaderCellDef>Código</th>
                    <td mat-cell *matCellDef="let estacion">{{ estacion.codigo }}</td>
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
                      <div class="ubicacion-info">
                        <small>{{ estacion.latitud }}, {{ estacion.longitud }}</small>
                        <br>
                        <small *ngIf="estacion.altura">Alt: {{ estacion.altura }}m</small>
                      </div>
                    </td>
                  </ng-container>

                  <!-- Columna Sensores -->
                  <ng-container matColumnDef="sensores">
                    <th mat-header-cell *matHeaderCellDef>Sensores</th>
                    <td mat-cell *matCellDef="let estacion">
                      <div class="sensors-count">
                        <mat-icon>sensors</mat-icon>
                        {{ estacion.totalSensores || 0 }}
                      </div>
                    </td>
                  </ng-container>

                  <!-- Columna Red -->
                  <ng-container matColumnDef="red">
                    <th mat-header-cell *matHeaderCellDef>Red</th>
                    <td mat-cell *matCellDef="let estacion">{{ estacion.red || 'N/A' }}</td>
                  </ng-container>

                  <!-- Columna Acciones -->
                  <ng-container matColumnDef="acciones">
                    <th mat-header-cell *matHeaderCellDef>Acciones</th>
                    <td mat-cell *matCellDef="let estacion">
                      <button mat-icon-button color="primary" (click)="verEnMapa(estacion)" matTooltip="Ver en mapa">
                        <mat-icon>map</mat-icon>
                      </button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                </table>

                <!-- Mensaje cuando no hay estaciones -->
                <div *ngIf="filteredEstaciones.length === 0" class="no-data">
                  <mat-icon>info</mat-icon>
                  <p>No se encontraron estaciones</p>
                </div>
              </div>

              <!-- Template de carga -->
              <ng-template #loadingTemplate>
                <div class="loading-container">
                  <mat-spinner></mat-spinner>
                  <p>Cargando estaciones...</p>
                </div>
              </ng-template>
            </mat-card-content>
          </mat-card>
        </div>

        <mat-card class="activity-card">
          <mat-card-header>
            <mat-card-title>Actividad Sísmica</mat-card-title>
            <div class="station-filter">
              <mat-form-field appearance="outline" class="station-select">
                <mat-label>Seleccionar Estación</mat-label>
                <mat-select [(value)]="selectedStationId" (selectionChange)="onStationChange()">
                  <mat-option *ngFor="let estacion of availableStations" [value]="estacion.id">
                    {{ estacion.codigo }} - {{ estacion.nombre }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-container" *ngIf="selectedStationId; else noStationSelected">
              <canvas #seismicChart width="400" height="300"></canvas>
            </div>
            <ng-template #noStationSelected>
              <div class="activity-placeholder">
                <mat-icon>show_chart</mat-icon>
                <p>Selecciona una estación para ver la actividad sísmica</p>
              </div>
            </ng-template>
          </mat-card-content>
        </mat-card>

      </div>

      <!-- Lecturas recientes -->
      <mat-card class="recent-readings-card">
        <mat-card-header>
          <mat-card-title>Lecturas Recientes</mat-card-title>
          <mat-card-subtitle>Últimas mediciones registradas</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="readings-list">
            <div class="reading-item" *ngFor="let lectura of lecturasRecientes()" 
                 [class.user-station]="isUserStation(lectura.estacionId)">
              <div class="lectura-info">
                <div class="estacion">
                  Estación: {{ lectura.estacion }}
                  <mat-icon *ngIf="isUserStation(lectura.estacionId)" class="user-indicator" matTooltip="Tu estación asignada">person</mat-icon>
                </div>
                <div class="sensor">Sensor: {{ lectura.sensor }} ({{ lectura.estacion }})</div>
                <div class="componente">Canal: {{ lectura.canal }}</div>
              </div>
              <div class="lectura-valores">
                <mat-chip [class]="getIntensityClass(lectura)" size="small">
                  Aceleración: {{ lectura.aceleracion }} m/s²
                </mat-chip>
              </div>
              <div class="lectura-tiempo">
                {{ lectura.tiempoRelativo }}
              </div>
            </div>
            
            <div *ngIf="lecturasRecientes().length === 0" class="no-readings">
              <mat-icon>info</mat-icon>
              <p>No hay lecturas recientes disponibles</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      background-color: #f5f5f5;
      min-height: 100vh;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .dashboard-header h1 {
      color: #333;
      font-size: 32px;
      font-weight: 600;
      margin: 0 0 8px 0;
    }

    .dashboard-header p {
      color: #666;
      font-size: 16px;
      margin: 8px 0 0 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .active-stations {
      border-left: 4px solid #4CAF50;
    }

    .readings-today {
      border-left: 4px solid #2196F3;
    }

    .websocket-status {
      border-left: 4px solid #FF9800;
    }

    .websocket-status.online {
      border-left-color: #4CAF50;
    }

    .alerts {
      border-left: 4px solid #F44336;
    }

    .stat-content {
      display: flex;
      align-items: center;
      padding: 16px;
    }

    .stat-icon {
      margin-right: 16px;
    }

    .stat-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #666;
    }

    .stat-info h2 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
      color: #333;
    }

    .stat-info p {
      margin: 4px 0 0 0;
      color: #666;
      font-size: 14px;
    }

    .main-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
    }

    .dashboard-card, .chart-card {
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .chart-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
      background: #f9f9f9;
      border-radius: 8px;
      color: #666;
    }

    .chart-placeholder mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    .search-bar {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      align-items: center;
    }

    .search-field {
      flex: 1;
    }

    .table-container {
      overflow-x: auto;
    }

    .estaciones-table {
      width: 100%;
    }

    .ubicacion-info {
      font-size: 12px;
      color: #666;
    }

    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #666;
    }

    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }

    .loading-container mat-spinner {
      margin-bottom: 16px;
    }

    .recent-readings-card {
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .reading-item.user-station {
      background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
      border-left: 4px solid #2196F3;
    }

    .user-indicator {
      color: #2196F3;
      font-size: 16px;
      margin-left: 8px;
      vertical-align: middle;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }

    .status-indicator.active {
      color: #4CAF50;
    }

    .status-indicator.inactive {
      color: #f44336;
    }

    .status-indicator mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .sensors-count {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #666;
    }

    .sensors-count mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .station-filter {
      margin-left: auto;
    }

    .station-select {
      min-width: 250px;
    }

    .chart-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
      padding: 20px;
    }

    .chart-container canvas {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: white;
    }

    .readings-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .reading-item {
      display: flex;
      align-items: center;
      padding: 16px;
      background: #f9f9f9;
      border-radius: 8px;
      gap: 16px;
    }

    .lectura-info {
      display: flex;
      flex-direction: column;
      min-width: 120px;
    }

    .estacion {
      font-weight: 500;
      color: #333;
    }

    .sensor, .componente {
      font-size: 12px;
      color: #666;
    }

    .lectura-valores {
      flex: 1;
    }

    .lectura-tiempo {
      font-size: 12px;
      color: #666;
      min-width: 80px;
      text-align: right;
    }

    .no-readings {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px;
      color: #666;
      text-align: center;
    }

    .no-readings mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    .low-value {
      background-color: #e8f5e8 !important;
      color: #2e7d32 !important;
    }

    .medium-value {
      background-color: #fff3e0 !important;
      color: #f57c00 !important;
    }

    .high-value {
      background-color: #ffebee !important;
      color: #c62828 !important;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .main-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('seismicChart', { static: false }) seismicChartRef!: ElementRef<HTMLCanvasElement>;
  totalEstaciones = signal(0);
  totalLecturasHoy = signal(1247);
  alertasActivas = signal(1);
  isConnected = signal(true);
  lecturasRecientes = signal<any[]>([]);
  currentUser: User | null = null;

  // Esta variable ya no se usa - las lecturas se generan dinámicamente

  constructor(
    private estacionService: EstacionService,
    private sensorService: SensorService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  // Variables para gestión de estaciones
  estaciones: Estacion[] = [];
  filteredEstaciones: Estacion[] = [];
  searchTerm: string = '';
  loading = false;
  displayedColumns: string[] = ['estado', 'codigo', 'nombre', 'ubicacion', 'sensores', 'red', 'acciones'];

  // Variables para el gráfico de actividad sísmica
  availableStations: Estacion[] = [];
  selectedStationId: number | null = null;
  seismicChart: any = null;

  ngOnInit(): void {
    this.setCurrentUser();
    this.loadUserStations();
    this.loadEstaciones();
    this.simulateRealTimeData();
  }

  ngAfterViewInit(): void {
    // Inicializar el gráfico después de que la vista esté lista
    setTimeout(() => {
      this.checkAndInitializeChart();
    }, 1000);
  }

  checkAndInitializeChart(): void {
    if (this.selectedStationId && this.seismicChartRef && this.availableStations.length > 0) {
      console.log('All conditions met, initializing chart');
      this.initializeSeismicChart();
    } else {
      console.log('Conditions not met:', {
        selectedStationId: this.selectedStationId,
        chartRef: !!this.seismicChartRef,
        stationsLength: this.availableStations.length
      });
      // Retry after a short delay
      setTimeout(() => this.checkAndInitializeChart(), 500);
    }
  }

  setCurrentUser(): void {
    // Obtener usuario actual del servicio de autenticación
    this.currentUser = this.authService.getCurrentUser();
  }

  loadUserStations(): void {
    if (!this.currentUser) {
      console.log('No hay usuario autenticado, no se pueden cargar estaciones');
      return;
    }

    if (this.isAdminUser()) {
      // Admin ve todas las estaciones
      this.estacionService.getEstacionesActivas().subscribe({
        next: (estaciones) => {
          console.log('Estaciones cargadas para admin:', estaciones);
          this.totalEstaciones.set(estaciones.length);
          this.loadSensorDataForStations(estaciones);
          this.availableStations = estaciones;
          if (estaciones.length > 0 && !this.selectedStationId) {
            this.selectedStationId = estaciones[0].id || null;
            // Inicializar gráfico después de seleccionar estación
            setTimeout(() => {
              if (this.seismicChartRef) {
                this.initializeSeismicChart();
              }
            }, 1000);
          }
        },
        error: (error) => {
          console.error('Error cargando estaciones:', error);
        }
      });
    } else {
      // Otros usuarios solo ven sus estaciones asignadas
      this.estacionService.getEstacionesByUser(this.currentUser.id!).subscribe({
        next: (estaciones) => {
          console.log('Estaciones cargadas para usuario:', estaciones);
          this.totalEstaciones.set(estaciones.length);
          this.loadSensorDataForStations(estaciones);
          this.availableStations = estaciones;
          if (estaciones.length > 0 && !this.selectedStationId) {
            this.selectedStationId = estaciones[0].id || null;
            // Inicializar gráfico después de seleccionar estación
            setTimeout(() => {
              if (this.seismicChartRef) {
                this.initializeSeismicChart();
              }
            }, 1000);
          }
        },
        error: (error) => {
          console.error('Error cargando estaciones del usuario:', error);
        }
      });
    }
  }

  // Load sensor data from backend for each station
  loadSensorDataForStations(estaciones: Estacion[]): void {
    estaciones.forEach(estacion => {
      if (estacion.id) {
        // Load real sensor data from backend
        this.sensorService.getSensorsByEstacion(estacion.id).subscribe({
          next: (sensores) => {
            console.log(`Sensores cargados para estación ${estacion.nombre}:`, sensores);
            // Process sensor data and update readings
            this.processSensorData(sensores, estacion);
          },
          error: (error) => {
            console.error(`Error cargando sensores para estación ${estacion.nombre}:`, error);
          }
        });
      }
    });
  }

  private processSensorData(sensores: any[], estacion: Estacion): void {
    const readings: any[] = [];
    
    sensores.forEach(sensor => {
      // Soporte para ambas estructuras: readings (backend) y lecturas (mock)
      const sensorReadings = sensor.readings || sensor.lecturas || [];
      if (sensorReadings && sensorReadings.length > 0) {
        sensorReadings.forEach((reading: any) => {
          readings.push({
            estacionId: estacion.id,
            estacion: estacion.nombre,
            sensor: sensor.sensorName || sensor.nombre || sensor.tipoSensor,
            canal: reading.componente || reading.canal || 'Z',
            tiempo: reading.tiempo,
            tiempoRelativo: this.formatTime(reading.tiempo),
            aceleracion: reading.aceleracion || 0,
            velocidad: reading.velocidad || 0,
            desplazamiento: reading.desplazamiento || 0
          });
        });
      }
    });

    // Update recent readings
    if (readings.length > 0) {
      this.lecturasRecientes.set([...(this.lecturasRecientes() || []), ...readings]);
      console.log('Lecturas procesadas:', readings);
    } else {
      // Si no hay lecturas, generar algunas de ejemplo
      this.generateInitialReadings(estacion);
    }
  }

  private generateInitialReadings(estacion: Estacion): void {
    const now = new Date();
    const initialReadings: any[] = [];
    const hasAlert = (estacion as any).alerta === true;
    
    // Generar 5 lecturas recientes para cada componente
    const componentes = ['Z', 'N', 'E'];
    componentes.forEach(comp => {
      for (let i = 0; i < 5; i++) {
        const tiempo = new Date(now.getTime() - (i * 2 * 60 * 1000)); // Cada 2 minutos
        
        // Si la estación tiene alerta, generar valores más altos
        const baseAccel = hasAlert ? 0.018 + Math.random() * 0.025 : 0.008 + Math.random() * 0.012;
        const baseVel = hasAlert ? 0.004 + Math.random() * 0.006 : 0.002 + Math.random() * 0.003;
        const baseDisp = hasAlert ? 0.001 + Math.random() * 0.002 : 0.0005 + Math.random() * 0.001;
        
        initialReadings.push({
          estacionId: estacion.id,
          estacion: estacion.nombre,
          sensor: 'Acelerómetro Triaxial',
          canal: comp,
          tiempo: tiempo.toISOString(),
          tiempoRelativo: this.formatTime(tiempo.toISOString()),
          aceleracion: parseFloat(baseAccel.toFixed(6)),
          velocidad: parseFloat(baseVel.toFixed(6)),
          desplazamiento: parseFloat(baseDisp.toFixed(6))
        });
      }
    });
    
    this.lecturasRecientes.update(current => [...(current || []), ...initialReadings]);
    console.log('Lecturas iniciales generadas para:', estacion.nombre, initialReadings);
  }

  private formatTime(timestamp: string): string {
    const now = new Date();
    const readingTime = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - readingTime.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'hace menos de 1 min';
    if (diffMinutes < 60) return `hace ${diffMinutes} min`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    const diffDays = Math.floor(diffHours / 24);
    return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  }

  // Convertir tiempo relativo a minutos para ordenamiento
  private parseTimeToMinutes(timeStr: string): number {
    const match = timeStr.match(/hace (\d+) min/);
    return match ? parseInt(match[1]) : 999;
  }

  // Métodos para el gráfico de actividad sísmica
  onStationChange(): void {
    console.log('Station changed to:', this.selectedStationId);
    if (this.selectedStationId && this.seismicChartRef) {
      this.updateSeismicChart();
    }
  }

  initializeSeismicChart(): void {
    console.log('Initializing seismic chart...');
    if (!this.seismicChartRef) {
      console.log('Chart ref not available');
      return;
    }

    const ctx = this.seismicChartRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.log('Canvas context not available');
      return;
    }

    console.log('Drawing line chart...');
    // Crear gráfico de líneas usando Canvas API nativo
    this.drawLineChart(ctx);
  }

  updateSeismicChart(): void {
    if (!this.seismicChartRef) return;
    
    const ctx = this.seismicChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Limpiar canvas y redibujar
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.drawLineChart(ctx);
  }

  drawLineChart(ctx: CanvasRenderingContext2D): void {
    const canvas = ctx.canvas;
    const padding = 50;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Datos simulados para los sensores de la estación seleccionada
    const selectedStation = this.availableStations.find(s => s.id === this.selectedStationId);
    if (!selectedStation) {
      // Mostrar mensaje si no hay estación seleccionada
      ctx.fillStyle = '#666';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Selecciona una estación', canvas.width / 2, canvas.height / 2);
      return;
    }

    // Obtener datos reales de sensores
    this.sensorService.getSensorsByEstacion(selectedStation.id!).subscribe({
      next: (sensores) => {
        console.log('Sensores cargados:', sensores);
        this.drawSensorLines(ctx, sensores, canvas);
      },
      error: (error) => {
        console.error('Error cargando sensores:', error);
        // Usar datos simulados con nombres reales como fallback
        this.drawFallbackChartWithRealNames(ctx, selectedStation, canvas);
      }
    });
  }

  drawSensorLines(ctx: CanvasRenderingContext2D, sensores: SensorDataDto[], canvas: HTMLCanvasElement): void {
    const padding = 50;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    const timePoints = 20;
    const maxValue = 0.03;

    // Generar datos simulados basados en sensores reales
    const sensorLines = sensores.map((sensor, sensorIndex) => ({
      label: sensor.nombre,
      color: this.getSensorColor(sensorIndex),
      data: Array.from({ length: timePoints }, (_, timeIndex) => ({
        x: timeIndex,
        y: Math.random() * maxValue * (0.5 + Math.sin(timeIndex * 0.3 + sensorIndex) * 0.3)
      }))
    }));

    this.drawChartElements(ctx, sensorLines, canvas, padding, chartWidth, chartHeight, maxValue, timePoints);
  }

  drawFallbackChart(ctx: CanvasRenderingContext2D, selectedStation: Estacion, canvas: HTMLCanvasElement): void {
    const padding = 50;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    const timePoints = 20;
    const maxValue = 0.03;
    const numSensores = selectedStation.totalSensores || 3;

    // Datos de respaldo si no se pueden cargar los sensores reales
    const sensorLines = Array.from({ length: numSensores }, (_, sensorIndex) => ({
      label: `Sensor ${sensorIndex + 1}`,
      color: this.getSensorColor(sensorIndex),
      data: Array.from({ length: timePoints }, (_, timeIndex) => ({
        x: timeIndex,
        y: Math.random() * maxValue * (0.5 + Math.sin(timeIndex * 0.3 + sensorIndex) * 0.3)
      }))
    }));

    this.drawChartElements(ctx, sensorLines, canvas, padding, chartWidth, chartHeight, maxValue, timePoints);
  }

  drawFallbackChartWithRealNames(ctx: CanvasRenderingContext2D, selectedStation: Estacion, canvas: HTMLCanvasElement): void {
    const padding = 50;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    const timePoints = 20;
    const maxValue = 0.03;

    // Nombres simulados basados en la estación
    const sensorNames = this.generateSensorNamesForStation(selectedStation);
    
    const sensorLines = sensorNames.map((name, sensorIndex) => ({
      label: name,
      color: this.getSensorColor(sensorIndex),
      data: Array.from({ length: timePoints }, (_, timeIndex) => ({
        x: timeIndex,
        y: Math.random() * maxValue * (0.5 + Math.sin(timeIndex * 0.3 + sensorIndex) * 0.3)
      }))
    }));

    this.drawChartElements(ctx, sensorLines, canvas, padding, chartWidth, chartHeight, maxValue, timePoints);
  }

  generateSensorNamesForStation(estacion: Estacion): string[] {
    const baseNames = [
      'Acelerómetro Kinemetrics ES-T',
      'Acelerómetro Güralp CMG-5TDE', 
      'Acelerómetro Nanometrics Titan',
      'Velocímetro Episensor',
      'Desplazómetro Digital'
    ];
    
    const numSensores = estacion.totalSensores || 3;
    return baseNames.slice(0, numSensores).map((name, index) => 
      `${name} #${index + 1}`
    );
  }

  drawChartElements(ctx: CanvasRenderingContext2D, sensorLines: any[], canvas: HTMLCanvasElement, 
                   padding: number, chartWidth: number, chartHeight: number, maxValue: number, timePoints: number): void {

    // Dibujar ejes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    // Eje Y (izquierda)
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.stroke();
    
    // Eje X (abajo)
    ctx.beginPath();
    ctx.moveTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();

    // Dibujar líneas de cuadrícula
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Líneas horizontales
    for (let i = 1; i <= 5; i++) {
      const y = padding + (chartHeight * i) / 6;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
    }
    
    // Líneas verticales
    for (let i = 1; i <= 4; i++) {
      const x = padding + (chartWidth * i) / 5;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + chartHeight);
      ctx.stroke();
    }

    // Dibujar líneas de datos para cada sensor
    sensorLines.forEach(sensorLine => {
      ctx.strokeStyle = sensorLine.color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      sensorLine.data.forEach((point: {x: number, y: number}, index: number) => {
        const x = padding + (point.x / (timePoints - 1)) * chartWidth;
        const y = padding + chartHeight - (point.y / maxValue) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();

      // Dibujar puntos
      ctx.fillStyle = sensorLine.color;
      sensorLine.data.forEach((point: {x: number, y: number}) => {
        const x = padding + (point.x / (timePoints - 1)) * chartWidth;
        const y = padding + chartHeight - (point.y / maxValue) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
      });
    });

    // Etiquetas del eje Y
    ctx.fillStyle = '#333';
    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = (maxValue * (5 - i)) / 5;
      const y = padding + (chartHeight * i) / 5;
      ctx.fillText(`${value.toFixed(3)}g`, padding - 10, y + 3);
    }

    // Etiquetas del eje X
    ctx.textAlign = 'center';
    for (let i = 0; i <= 4; i++) {
      const time = `${i * 5}s`;
      const x = padding + (chartWidth * i) / 4;
      ctx.fillText(time, x, padding + chartHeight + 20);
    }

    // Título del gráfico
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    const selectedStation = this.availableStations.find(s => s.id === this.selectedStationId);
    if (selectedStation) {
      ctx.fillText(`${selectedStation.nombre} - Actividad Sísmica`, canvas.width / 2, 25);
    }

    // Leyenda
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    sensorLines.forEach((sensorLine, index) => {
      const legendY = 50 + index * 20;
      ctx.fillStyle = sensorLine.color;
      ctx.fillRect(canvas.width - 120, legendY - 5, 15, 10);
      ctx.fillStyle = '#333';
      ctx.fillText(sensorLine.label, canvas.width - 100, legendY + 3);
    });
  }

  getSensorColor(index: number): string {
    const colors = ['#2196F3', '#4CAF50', '#FF9800', '#F44336', '#9C27B0', '#00BCD4'];
    return colors[index % colors.length];
  }

  isAdminUser(): boolean {
    return this.currentUser?.roles?.includes('ADMIN') || false;
  }

  // Métodos para gestión de estaciones
  loadEstaciones(): void {
    this.loading = true;
    
    if (this.isAdminUser()) {
      // Admin ve todas las estaciones
      this.estacionService.getEstacionesActivas().subscribe({
        next: (estaciones) => {
          this.estaciones = estaciones;
          this.filteredEstaciones = [...estaciones];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error cargando estaciones:', error);
          this.snackBar.open('Error al cargar estaciones', 'Cerrar', { duration: 3000 });
          this.loading = false;
        }
      });
    } else {
      // Otros usuarios solo ven sus estaciones asignadas
      if (this.currentUser?.id) {
        this.estacionService.getEstacionesByUser(this.currentUser.id).subscribe({
          next: (estaciones) => {
            this.estaciones = estaciones;
            this.filteredEstaciones = [...estaciones];
            this.loading = false;
          },
          error: (error) => {
            console.error('Error cargando estaciones del usuario:', error);
            this.snackBar.open('Error al cargar estaciones', 'Cerrar', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    }
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredEstaciones = [...this.estaciones];
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredEstaciones = this.estaciones.filter(estacion =>
      estacion.codigo?.toLowerCase().includes(term) ||
      estacion.nombre?.toLowerCase().includes(term) ||
      estacion.red?.toLowerCase().includes(term)
    );
  }

  verEnMapa(estacion: Estacion): void {
    this.router.navigate(['/mapa'], {
      queryParams: {
        estacionId: estacion.id,
        lat: estacion.latitud,
        lng: estacion.longitud
      }
    });
  }

  // Verificar si una estación pertenece al usuario actual
  isUserStation(estacionId: number): boolean {
    if (this.isAdminUser()) {
      return false; // Admin no tiene estaciones "propias"
    }
    
    // Verificar si la estación está en la lista de estaciones del usuario
    return this.estaciones.some(estacion => estacion.id === estacionId);
  }

  private simulateRealTimeData(): void {
    setInterval(() => {
      this.totalLecturasHoy.update(val => val + Math.floor(Math.random() * 3));
      this.isConnected.set(Math.random() > 0.1); // 90% uptime
      
      // Actualizar lecturas recientes con nuevos valores
      this.lecturasRecientes.update(lecturas => 
        lecturas.map(lectura => ({
          ...lectura,
          aceleracion: parseFloat((Math.random() * 0.03).toFixed(3))
        }))
      );
    }, 5000);
  }

  getIntensityClass(lectura: any): string {
    const aceleracion = lectura.aceleracion || 0;
    if (aceleracion < 0.01) return 'low-value';
    if (aceleracion < 0.02) return 'medium-value';
    return 'high-value';
  }

  getIntensityLabel(lectura: any): string {
    const aceleracion = lectura.aceleracion || 0;
    return `Aceleración: ${aceleracion.toFixed(3)} m/s²`;
  }
}

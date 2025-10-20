import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule
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

      <!-- Sección principal con mapa y gráficos -->
      <div class="main-content">
        <div class="col-md-8">
          <mat-card class="dashboard-card">
            <mat-card-header>
              <mat-card-title>Mapa de Estaciones</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="map-placeholder">
                <mat-icon>map</mat-icon>
                <p>Mapa interactivo próximamente</p>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Actividad Sísmica</mat-card-title>
            <mat-card-subtitle>Últimas 24 horas</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-placeholder">
              <mat-icon>show_chart</mat-icon>
              <p>Gráfico de actividad sísmica en tiempo real</p>
              <p><small>Integración con Chart.js próximamente</small></p>
            </div>
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
            <div class="reading-item">
              <div class="lectura-info">
                <div class="estacion">Estación Demo 1</div>
                <div class="sensor">Sensor: SIS-001</div>
                <div class="componente">Canal: Z</div>
              </div>
              <div class="lectura-valores">
                <mat-chip class="medium-value" size="small">
                  Magnitud: 2.1
                </mat-chip>
              </div>
              <div class="lectura-tiempo">
                hace 2 min
              </div>
            </div>
            
            <div class="reading-item">
              <div class="lectura-info">
                <div class="estacion">Estación Demo 2</div>
                <div class="sensor">Sensor: SIS-002</div>
                <div class="componente">Canal: N</div>
              </div>
              <div class="lectura-valores">
                <mat-chip class="low-value" size="small">
                  Magnitud: 1.8
                </mat-chip>
              </div>
              <div class="lectura-tiempo">
                hace 5 min
              </div>
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

    .map-placeholder, .chart-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
      background: #f9f9f9;
      border-radius: 8px;
      color: #666;
    }

    .map-placeholder mat-icon, .chart-placeholder mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    .recent-readings-card {
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
export class DashboardComponent implements OnInit {
  totalEstaciones = signal(3);
  totalLecturasHoy = signal(1247);
  alertasActivas = signal(0);
  isConnected = signal(true);

  ngOnInit(): void {
    // Simular datos en tiempo real
    this.simulateRealTimeData();
  }

  private simulateRealTimeData(): void {
    setInterval(() => {
      this.totalLecturasHoy.update(val => val + Math.floor(Math.random() * 3));
      this.isConnected.set(Math.random() > 0.1); // 90% uptime
    }, 5000);
  }

  getIntensityClass(lectura: any): string {
    const magnitude = lectura.magnitud || 0;
    if (magnitude < 2) return 'low-value';
    if (magnitude < 4) return 'medium-value';
    return 'high-value';
  }

  getIntensityLabel(lectura: any): string {
    const magnitude = lectura.magnitud || 0;
    return `Magnitud: ${magnitude.toFixed(1)}`;
  }
}

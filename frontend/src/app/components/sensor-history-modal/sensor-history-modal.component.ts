import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { SensorHistoryService, SensorHistoryResponse, SensorReading } from '../../services/sensor-history.service';
import { interval, Subscription } from 'rxjs';
import { HistogramChartComponent } from '../histogram-chart/histogram-chart.component';

export interface SensorHistoryDialogData {
  estacionId: number;
  estacionNombre: string;
  estacionCodigo: string;
}

@Component({
  selector: 'app-sensor-history-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatChipsModule,
    HistogramChartComponent
  ],
  template: `
    <div class="sensor-history-dialog">
      <div mat-dialog-title class="dialog-header">
        <div class="header-content">
          <mat-icon>sensors</mat-icon>
          <div class="header-text">
            <h2>Historial Sísmico</h2>
            <p>{{data.estacionNombre}} ({{data.estacionCodigo}})</p>
          </div>
        </div>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div mat-dialog-content class="dialog-content">
        <div class="controls-section">
          <mat-form-field appearance="outline">
            <mat-label>Período</mat-label>
            <mat-select [(value)]="selectedPeriod" (selectionChange)="onPeriodChange()">
              <mat-option value="1">Última hora</mat-option>
              <mat-option value="6">Últimas 6 horas</mat-option>
              <mat-option value="24">Últimas 24 horas</mat-option>
              <mat-option value="72">Últimos 3 días</mat-option>
              <mat-option value="168">Última semana</mat-option>
            </mat-select>
          </mat-form-field>

          <div class="realtime-indicator" [class.active]="realtimeEnabled">
            <mat-icon>{{realtimeEnabled ? 'radio_button_checked' : 'radio_button_unchecked'}}</mat-icon>
            <span>Tiempo Real</span>
          </div>
        </div>

        <div *ngIf="loading" class="loading-container">
          <mat-spinner diameter="50"></mat-spinner>
          <p>Cargando datos sísmicos...</p>
        </div>

        <div *ngIf="!loading && sensorHistory" class="history-content">
          <mat-tab-group>
            <!-- Tab de Resumen -->
            <mat-tab label="Resumen">
              <div class="summary-section">
                <div class="stats-grid">
                  <mat-card class="stat-card">
                    <mat-card-header>
                      <mat-icon mat-card-avatar>timeline</mat-icon>
                      <mat-card-title>Actividad Reciente</mat-card-title>
                    </mat-card-header>
                    <mat-card-content>
                      <div class="stat-value">{{getTotalReadings()}}</div>
                      <div class="stat-label">Lecturas registradas</div>
                    </mat-card-content>
                  </mat-card>

                  <mat-card class="stat-card">
                    <mat-card-header>
                      <mat-icon mat-card-avatar>speed</mat-icon>
                      <mat-card-title>Aceleración Máxima</mat-card-title>
                    </mat-card-header>
                    <mat-card-content>
                      <div class="stat-value">{{getMaxAcceleration()}} m/s²</div>
                      <div class="stat-label">Componente {{getMaxComponent()}}</div>
                    </mat-card-content>
                  </mat-card>

                  <mat-card class="stat-card">
                    <mat-card-header>
                      <mat-icon mat-card-avatar>health_and_safety</mat-icon>
                      <mat-card-title>Estado del Sensor</mat-card-title>
                    </mat-card-header>
                    <mat-card-content>
                      <div class="stat-value">{{getSensorStatus()}}</div>
                      <div class="stat-label">Calidad de señal</div>
                    </mat-card-content>
                  </mat-card>
                </div>

                <div class="realtime-section" *ngIf="realtimeData.length > 0">
                  <h3>Lecturas en Tiempo Real</h3>
                  <div class="realtime-grid">
                    <div *ngFor="let reading of realtimeData" class="realtime-card">
                      <div class="component-badge">{{reading.componente}}</div>
                      <div class="reading-value">{{reading.aceleracion | number:'1.6-6'}} m/s²</div>
                      <div class="reading-time">{{formatTime(reading.tiempo)}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </mat-tab>

            <!-- Tab por cada sensor -->
            <mat-tab *ngFor="let sensor of sensorHistory.sensores" [label]="sensor.sensorNombre">
              <div class="sensor-detail">
                <div class="channels-section">
                  <mat-tab-group>
                    <mat-tab *ngFor="let canal of sensor.canales" [label]="'Canal ' + canal.componente">
                      <div class="channel-content">
                        <div class="channel-stats">
                          <div class="stat-item">
                            <span class="label">Promedio:</span>
                            <span class="value">{{canal.estadisticas.promedio | number:'1.6-6'}} m/s²</span>
                          </div>
                          <div class="stat-item">
                            <span class="label">Máximo:</span>
                            <span class="value">{{canal.estadisticas.maximo | number:'1.6-6'}} m/s²</span>
                          </div>
                          <div class="stat-item">
                            <span class="label">Mínimo:</span>
                            <span class="value">{{canal.estadisticas.minimo | number:'1.6-6'}} m/s²</span>
                          </div>
                          <div class="stat-item">
                            <span class="label">Desviación:</span>
                            <span class="value">{{canal.estadisticas.desviacion | number:'1.6-6'}} m/s²</span>
                          </div>
                        </div>

                        <!-- Pestañas internas: Histograma y Tabla -->
                        <mat-tab-group class="inner-tabs">
                          <mat-tab label="📊 Histograma">
                            <div class="histogram-section">
                              <app-histogram-chart 
                                [readings]="canal.lecturas" 
                                [componentType]="canal.componente">
                              </app-histogram-chart>
                            </div>
                          </mat-tab>
                          
                          <mat-tab label="📋 Datos Tabulares">
                            <div class="readings-table">
                              <table mat-table [dataSource]="canal.lecturas" class="readings-mat-table">
                                <ng-container matColumnDef="tiempo">
                                  <th mat-header-cell *matHeaderCellDef>Tiempo</th>
                                  <td mat-cell *matCellDef="let reading">{{formatDateTime(reading.tiempo)}}</td>
                                </ng-container>

                                <ng-container matColumnDef="aceleracion">
                                  <th mat-header-cell *matHeaderCellDef>Aceleración (m/s²)</th>
                                  <td mat-cell *matCellDef="let reading">
                                    <span [class]="getAccelerationClass(reading.aceleracion)">
                                      {{reading.aceleracion | number:'1.6-6'}}
                                    </span>
                                  </td>
                                </ng-container>

                                <ng-container matColumnDef="velocidad">
                                  <th mat-header-cell *matHeaderCellDef>Velocidad (m/s)</th>
                                  <td mat-cell *matCellDef="let reading">{{reading.velocidad | number:'1.6-6'}}</td>
                                </ng-container>

                                <ng-container matColumnDef="desplazamiento">
                                  <th mat-header-cell *matHeaderCellDef>Desplazamiento (m)</th>
                                  <td mat-cell *matCellDef="let reading">{{reading.desplazamiento | number:'1.6-6'}}</td>
                                </ng-container>

                                <ng-container matColumnDef="calidad">
                                  <th mat-header-cell *matHeaderCellDef>Calidad</th>
                                  <td mat-cell *matCellDef="let reading">
                                    <mat-chip [class]="getQualityClass(reading.calidad)">
                                      {{getQualityText(reading.calidad)}}
                                    </mat-chip>
                                  </td>
                                </ng-container>

                                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                              </table>
                            </div>
                          </mat-tab>
                        </mat-tab-group>
                      </div>
                    </mat-tab>
                  </mat-tab-group>
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>
        </div>
      </div>

      <div mat-dialog-actions class="dialog-actions">
        <button mat-button (click)="toggleRealtime()">
          <mat-icon>{{realtimeEnabled ? 'pause' : 'play_arrow'}}</mat-icon>
          {{realtimeEnabled ? 'Pausar' : 'Activar'}} Tiempo Real
        </button>
        <button mat-button (click)="exportData()">
          <mat-icon>download</mat-icon>
          Exportar Datos
        </button>
        <button mat-raised-button color="primary" mat-dialog-close>Cerrar</button>
      </div>
    </div>
  `,
  styles: [`
    .sensor-history-dialog {
      width: 90vw;
      max-width: 1200px;
      height: 80vh;
      display: flex;
      flex-direction: column;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid #e0e0e0;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-content mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #1976d2;
    }

    .header-text h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
    }

    .header-text p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .dialog-content {
      flex: 1;
      padding: 16px 24px;
      overflow-y: auto;
    }

    .controls-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .realtime-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 20px;
      background: #e0e0e0;
      transition: all 0.3s ease;
    }

    .realtime-indicator.active {
      background: #4caf50;
      color: white;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }

    .loading-container p {
      margin-top: 16px;
      color: #666;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      text-align: center;
    }

    .stat-card mat-card-header {
      justify-content: center;
    }

    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #1976d2;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
    }

    .realtime-section {
      margin-top: 24px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .realtime-section h3 {
      margin: 0 0 16px 0;
      color: #333;
    }

    .realtime-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .realtime-card {
      background: white;
      padding: 16px;
      border-radius: 8px;
      text-align: center;
      border: 2px solid #e0e0e0;
    }

    .component-badge {
      background: #1976d2;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      display: inline-block;
      margin-bottom: 8px;
    }

    .reading-value {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin-bottom: 4px;
    }

    .reading-time {
      font-size: 11px;
      color: #666;
    }

    .channel-content {
      padding: 16px 0;
    }

    .channel-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stat-item .label {
      font-weight: 500;
      color: #666;
    }

    .stat-item .value {
      font-weight: bold;
      color: #1976d2;
    }

    .histogram-section {
      padding: 16px 0;
      height: 450px;
    }

    .inner-tabs {
      margin-top: 16px;
    }

    .inner-tabs ::ng-deep .mat-mdc-tab-body-wrapper {
      min-height: 400px;
    }

    .readings-table {
      max-height: 400px;
      overflow-y: auto;
      padding: 16px 0;
    }

    .readings-mat-table {
      width: 100%;
    }

    .acceleration-low { color: #4caf50; }
    .acceleration-medium { color: #ff9800; }
    .acceleration-high { color: #f44336; font-weight: bold; }

    .quality-good { background-color: #4caf50; color: white; }
    .quality-regular { background-color: #ff9800; color: white; }
    .quality-bad { background-color: #f44336; color: white; }

    .dialog-actions {
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    ::ng-deep .mat-mdc-tab-group {
      height: 100%;
    }

    ::ng-deep .mat-mdc-tab-body-wrapper {
      flex: 1;
    }
  `]
})
export class SensorHistoryModalComponent implements OnInit, OnDestroy {
  sensorHistory: SensorHistoryResponse | null = null;
  realtimeData: SensorReading[] = [];
  loading = true;
  selectedPeriod = 24;
  realtimeEnabled = false;
  displayedColumns = ['tiempo', 'aceleracion', 'velocidad', 'desplazamiento', 'calidad'];
  
  private realtimeSubscription?: Subscription;

  constructor(
    public dialogRef: MatDialogRef<SensorHistoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SensorHistoryDialogData,
    private sensorHistoryService: SensorHistoryService
  ) {}

  ngOnInit(): void {
    this.loadSensorHistory();
    this.startRealtime();
  }

  ngOnDestroy(): void {
    this.stopRealtime();
  }

  loadSensorHistory(): void {
    this.loading = true;
    this.sensorHistoryService.getSensorHistory(this.data.estacionId, this.selectedPeriod)
      .subscribe({
        next: (history) => {
          this.sensorHistory = history;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error cargando historial:', error);
          this.loading = false;
        }
      });
  }

  onPeriodChange(): void {
    this.loadSensorHistory();
  }

  toggleRealtime(): void {
    this.realtimeEnabled = !this.realtimeEnabled;
    if (this.realtimeEnabled) {
      this.startRealtime();
    } else {
      this.stopRealtime();
    }
  }

  private startRealtime(): void {
    this.realtimeEnabled = true;
    this.realtimeSubscription = interval(5000) // Cada 5 segundos
      .subscribe(() => {
        this.sensorHistoryService.getRealtimeReading(this.data.estacionId)
          .subscribe(readings => {
            this.realtimeData = readings;
          });
      });
    
    // Cargar datos iniciales
    this.sensorHistoryService.getRealtimeReading(this.data.estacionId)
      .subscribe(readings => {
        this.realtimeData = readings;
      });
  }

  private stopRealtime(): void {
    this.realtimeEnabled = false;
    if (this.realtimeSubscription) {
      this.realtimeSubscription.unsubscribe();
    }
  }

  getTotalReadings(): number {
    if (!this.sensorHistory) return 0;
    return this.sensorHistory.sensores.reduce((total, sensor) => {
      return total + sensor.canales.reduce((channelTotal, canal) => {
        return channelTotal + canal.lecturas.length;
      }, 0);
    }, 0);
  }

  getMaxAcceleration(): string {
    if (!this.sensorHistory) return '0.000000';
    let max = 0;
    this.sensorHistory.sensores.forEach(sensor => {
      sensor.canales.forEach(canal => {
        const channelMax = Math.max(...canal.lecturas.map(r => r.aceleracion));
        max = Math.max(max, channelMax);
      });
    });
    return max.toFixed(6);
  }

  getMaxComponent(): string {
    if (!this.sensorHistory) return 'N/A';
    let max = 0;
    let component = 'N/A';
    this.sensorHistory.sensores.forEach(sensor => {
      sensor.canales.forEach(canal => {
        const channelMax = Math.max(...canal.lecturas.map(r => r.aceleracion));
        if (channelMax > max) {
          max = channelMax;
          component = canal.componente;
        }
      });
    });
    return component;
  }

  getSensorStatus(): string {
    if (!this.sensorHistory) return 'Desconocido';
    const totalReadings = this.getTotalReadings();
    const goodQualityReadings = this.sensorHistory.sensores.reduce((total, sensor) => {
      return total + sensor.canales.reduce((channelTotal, canal) => {
        return channelTotal + canal.lecturas.filter(r => r.calidad === 1).length;
      }, 0);
    }, 0);
    
    const qualityPercentage = (goodQualityReadings / totalReadings) * 100;
    
    if (qualityPercentage >= 95) return 'Excelente';
    if (qualityPercentage >= 85) return 'Bueno';
    if (qualityPercentage >= 70) return 'Regular';
    return 'Deficiente';
  }

  formatTime(time: string): string {
    return new Date(time).toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  formatDateTime(time: string): string {
    return new Date(time).toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getAccelerationClass(acceleration: number): string {
    if (acceleration < 0.01) return 'acceleration-low';
    if (acceleration < 0.02) return 'acceleration-medium';
    return 'acceleration-high';
  }

  getQualityClass(quality: number): string {
    switch (quality) {
      case 1: return 'quality-good';
      case 2: return 'quality-regular';
      default: return 'quality-bad';
    }
  }

  getQualityText(quality: number): string {
    switch (quality) {
      case 1: return 'Buena';
      case 2: return 'Regular';
      default: return 'Mala';
    }
  }

  exportData(): void {
    if (!this.sensorHistory) return;
    
    // Crear CSV con todos los datos
    let csvContent = 'Estacion,Sensor,Canal,Componente,Tiempo,Aceleracion,Velocidad,Desplazamiento,Calidad\n';
    
    this.sensorHistory.sensores.forEach(sensor => {
      sensor.canales.forEach(canal => {
        canal.lecturas.forEach(lectura => {
          csvContent += `${this.data.estacionNombre},${sensor.sensorNombre},${canal.canalNombre},${canal.componente},${lectura.tiempo},${lectura.aceleracion},${lectura.velocidad},${lectura.desplazamiento},${lectura.calidad}\n`;
        });
      });
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historial_sismico_${this.data.estacionCodigo}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

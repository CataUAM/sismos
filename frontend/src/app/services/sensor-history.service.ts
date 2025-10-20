import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { MOCK_MODE } from '../config/mock.config';

export interface SensorReading {
  id: number;
  tiempo: string;
  aceleracion: number;
  velocidad: number;
  desplazamiento: number;
  calidad: number;
  canal: string;
  componente: string;
}

export interface SensorHistoryResponse {
  estacionId: number;
  estacionNombre: string;
  sensores: SensorData[];
  periodo: {
    inicio: string;
    fin: string;
  };
}

export interface SensorData {
  sensorId: number;
  sensorNombre: string;
  canales: ChannelData[];
}

export interface ChannelData {
  canalId: number;
  canalNombre: string;
  componente: string;
  lecturas: SensorReading[];
  estadisticas: {
    promedio: number;
    maximo: number;
    minimo: number;
    desviacion: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SensorHistoryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSensorHistory(estacionId: number, horas: number = 24): Observable<SensorHistoryResponse> {
    if (MOCK_MODE) {
      return of(this.getDemoSensorHistory(estacionId, horas));
    }
    return this.http.get<SensorHistoryResponse>(
      `${this.apiUrl}/estaciones/${estacionId}/sensor-history?horas=${horas}`
    ).pipe(
      catchError(() => of(this.getDemoSensorHistory(estacionId, horas)))
    );
  }

  getRealtimeReading(estacionId: number): Observable<SensorReading[]> {
    if (MOCK_MODE) {
      return of(this.getDemoRealtimeData(estacionId));
    }
    return this.http.get<SensorReading[]>(
      `${this.apiUrl}/estaciones/${estacionId}/realtime`
    ).pipe(
      catchError(() => of(this.getDemoRealtimeData(estacionId)))
    );
  }

  private getDemoSensorHistory(estacionId: number, horas: number): SensorHistoryResponse {
    const now = new Date();
    const inicio = new Date(now.getTime() - (horas * 60 * 60 * 1000));
    
    const estaciones = [
      { id: 1, nombre: 'Universidad Nacional' },
      { id: 2, nombre: 'Centro Histórico' },
      { id: 3, nombre: 'Zona Norte' },
      { id: 4, nombre: 'Zona Sur' },
      { id: 5, nombre: 'Villamaría Centro' }
    ];

    const estacion = estaciones.find(e => e.id === estacionId) || estaciones[0];
    
    return {
      estacionId: estacion.id,
      estacionNombre: estacion.nombre,
      periodo: {
        inicio: inicio.toISOString(),
        fin: now.toISOString()
      },
      sensores: [
        {
          sensorId: estacionId,
          sensorNombre: `Acelerómetro Principal ${estacion.nombre}`,
          canales: [
            {
              canalId: (estacionId - 1) * 3 + 1,
              canalNombre: `Canal Z - ${estacion.nombre}`,
              componente: 'Z',
              lecturas: this.generateDemoReadings(horas, 'Z'),
              estadisticas: {
                promedio: 0.012,
                maximo: 0.025,
                minimo: 0.005,
                desviacion: 0.003
              }
            },
            {
              canalId: (estacionId - 1) * 3 + 2,
              canalNombre: `Canal N - ${estacion.nombre}`,
              componente: 'N',
              lecturas: this.generateDemoReadings(horas, 'N'),
              estadisticas: {
                promedio: 0.011,
                maximo: 0.023,
                minimo: 0.004,
                desviacion: 0.0028
              }
            },
            {
              canalId: (estacionId - 1) * 3 + 3,
              canalNombre: `Canal E - ${estacion.nombre}`,
              componente: 'E',
              lecturas: this.generateDemoReadings(horas, 'E'),
              estadisticas: {
                promedio: 0.010,
                maximo: 0.021,
                minimo: 0.003,
                desviacion: 0.0025
              }
            }
          ]
        }
      ]
    };
  }

  private generateDemoReadings(horas: number, componente: string): SensorReading[] {
    const readings: SensorReading[] = [];
    const now = new Date();
    const intervalos = Math.min(horas * 12, 288); // Máximo 288 puntos (cada 5 minutos)
    
    for (let i = intervalos; i >= 0; i--) {
      const tiempo = new Date(now.getTime() - (i * 5 * 60 * 1000)); // Cada 5 minutos
      
      // Generar valores realistas con variación
      const baseAccel = 0.008 + Math.random() * 0.015;
      const noise = (Math.random() - 0.5) * 0.005;
      const aceleracion = Math.max(0.001, baseAccel + noise);
      
      readings.push({
        id: i,
        tiempo: tiempo.toISOString(),
        aceleracion: Math.round(aceleracion * 1000000) / 1000000,
        velocidad: Math.round(aceleracion * 0.25 * 1000000) / 1000000,
        desplazamiento: Math.round(aceleracion * 0.08 * 1000000) / 1000000,
        calidad: Math.random() > 0.1 ? 1 : 2, // 90% buena calidad
        canal: `Canal ${componente}`,
        componente: componente
      });
    }
    
    return readings;
  }

  private getDemoRealtimeData(estacionId: number): SensorReading[] {
    const now = new Date();
    
    return [
      {
        id: 1,
        tiempo: now.toISOString(),
        aceleracion: 0.012 + (Math.random() - 0.5) * 0.004,
        velocidad: 0.003 + (Math.random() - 0.5) * 0.001,
        desplazamiento: 0.001 + (Math.random() - 0.5) * 0.0003,
        calidad: 1,
        canal: 'Canal Z',
        componente: 'Z'
      },
      {
        id: 2,
        tiempo: now.toISOString(),
        aceleracion: 0.011 + (Math.random() - 0.5) * 0.004,
        velocidad: 0.0028 + (Math.random() - 0.5) * 0.001,
        desplazamiento: 0.0009 + (Math.random() - 0.5) * 0.0003,
        calidad: 1,
        canal: 'Canal N',
        componente: 'N'
      },
      {
        id: 3,
        tiempo: now.toISOString(),
        aceleracion: 0.010 + (Math.random() - 0.5) * 0.004,
        velocidad: 0.0025 + (Math.random() - 0.5) * 0.001,
        desplazamiento: 0.0008 + (Math.random() - 0.5) * 0.0003,
        calidad: 1,
        canal: 'Canal E',
        componente: 'E'
      }
    ];
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { MOCK_MODE } from '../config/mock.config';

export interface LecturaDto {
  tiempo: string;
  aceleracion: number;
  velocidad: number;
  desplazamiento: number;
  canal: string;
  componente: string;
}

export interface SensorDataDto {
  idSensor: number;
  nombre: string;
  marca: string;
  modelo: string;
  tipoSensor: string;
  descripcion: string;
  lecturas: LecturaDto[];
}

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private apiUrl = `${environment.apiUrl}/sensores`;

  constructor(private http: HttpClient) { }

  getSensorsByEstacion(estacionId: number): Observable<SensorDataDto[]> {
    if (MOCK_MODE) {
      return of(this.getMockSensors(estacionId, 6));
    }
    return this.http.get<SensorDataDto[]>(`${this.apiUrl}/estacion/${estacionId}`);
  }

  getSensorsWithRecentReadings(estacionId: number, horas: number = 24): Observable<SensorDataDto[]> {
    if (MOCK_MODE) {
      return of(this.getMockSensors(estacionId, horas));
    }
    return this.http.get<SensorDataDto[]>(`${this.apiUrl}/estacion/${estacionId}/lecturas-recientes?horas=${horas}`);
  }

  private getMockSensors(estacionId: number, horas: number): SensorDataDto[] {
    const now = new Date();
    const makeLecturas = (canal: string, componente: string) => {
      const puntos = Math.min(horas * 12, 120);
      const lecturas = [] as LecturaDto[];
      for (let i = puntos; i >= 0; i--) {
        const t = new Date(now.getTime() - i * 5 * 60 * 1000).toISOString();
        const base = 0.010 + Math.random() * 0.008;
        lecturas.push({
          tiempo: t,
          aceleracion: parseFloat((base).toFixed(6)),
          velocidad: parseFloat((base * 0.25).toFixed(6)),
          desplazamiento: parseFloat((base * 0.08).toFixed(6)),
          canal,
          componente
        });
      }
      return lecturas;
    };

    return [
      {
        idSensor: estacionId * 10 + 1,
        nombre: 'Acelerómetro Triaxial',
        marca: 'Kinemetrics',
        modelo: 'Episensor ES-T',
        tipoSensor: 'Acelerógrafo',
        descripcion: 'Sensor principal de la estación',
        lecturas: [
          ...makeLecturas('Canal Z', 'Z'),
          ...makeLecturas('Canal N', 'N'),
          ...makeLecturas('Canal E', 'E')
        ]
      }
    ];
  }
}

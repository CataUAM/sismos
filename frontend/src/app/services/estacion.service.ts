import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { Estacion } from '../models/estacion.model';
import { environment } from '../../environments/environment';
import { MOCK_MODE } from '../config/mock.config';

@Injectable({
  providedIn: 'root'
})
export class EstacionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getEstacionesParaMapa(): Observable<Estacion[]> {
    if (MOCK_MODE) {
      return of(this.getEstacionesDemo());
    }
    return this.http.get<Estacion[]>(`${this.apiUrl}/estaciones`).pipe(
      catchError(() => of(this.getEstacionesDemo()))
    );
  }

  private getEstacionesDemo(): Estacion[] {
    return [
      {
        id: 1,
        idEstacion: 1,
        nombre: 'Estación Universidad Nacional',
        codigo: 'MNZ-001',
        ubicacion: 'Universidad Nacional de Colombia - Sede Manizales',
        latitud: 5.0696,
        longitud: -75.5180,
        altura: 2150,
        estado: 1,
        activa: true,
        descripcion: 'Estación ubicada en el campus de la Universidad Nacional',
        totalSensores: 3,
        geologia: 'Roca volcánica',
        red: 'RSNC',
        alerta: true,
        nivelAlerta: 'AMARILLA',
        tipoAlerta: 'Actividad sísmica elevada'
      } as any,
      {
        id: 2,
        idEstacion: 2,
        nombre: 'Estación Hospital Caldas',
        codigo: 'MNZ-002',
        ubicacion: 'Hospital de Caldas',
        latitud: 5.0667,
        longitud: -75.5147,
        altura: 2200,
        estado: 1,
        activa: true,
        descripcion: 'Estación ubicada en el Hospital de Caldas',
        totalSensores: 2,
        geologia: 'Suelo sedimentario',
        red: 'RSNC',
        alerta: false
      } as any,
      {
        id: 3,
        idEstacion: 3,
        nombre: 'Estación Alcaldía',
        codigo: 'MNZ-003',
        ubicacion: 'Alcaldía de Manizales - Centro Administrativo',
        latitud: 5.0701,
        longitud: -75.5135,
        altura: 2100,
        estado: 0,
        activa: false,
        descripcion: 'Estación en mantenimiento - Centro Administrativo',
        totalSensores: 4,
        geologia: 'Suelo aluvial',
        red: 'RSNC',
        alerta: false
      } as any
    ];
  }

  // Método para obtener todas las estaciones (alias para compatibilidad)
  getEstaciones(): Observable<Estacion[]> {
    return this.getAllEstaciones();
  }

  getAllEstaciones(): Observable<Estacion[]> {
    if (MOCK_MODE) {
      return of(this.getEstacionesDemo());
    }
    return this.http.get<Estacion[]>(`${this.apiUrl}/estaciones`).pipe(
      catchError(() => of(this.getEstacionesDemo()))
    );
  }

  getEstacionesByUser(userId: number): Observable<Estacion[]> {
    if (MOCK_MODE) {
      return of(this.getEstacionesDemoByUser(userId));
    }
    return this.http.get<Estacion[]>(`${this.apiUrl}/estaciones/usuario/${userId}`).pipe(
      catchError(() => of(this.getEstacionesDemoByUser(userId)))
    );
  }

  private getEstacionesDemoByUser(userId: number): Estacion[] {
    const allStations = this.getEstacionesDemo();
    // Simulación: usuario 1 ve todas, usuario 2 ve solo las primeras 2, etc.
    switch(userId) {
      case 1: return allStations; // Admin ve todas
      case 2: return allStations.slice(0, 2); // Operador ve 2
      case 3: return allStations.slice(0, 1); // Viewer ve 1
      default: return allStations.slice(0, 1);
    }
  }

  getEstacionesActivas(): Observable<Estacion[]> {
    if (MOCK_MODE) {
      return of(this.getEstacionesDemo().filter(e => e.activa));
    }
    return this.http.get<Estacion[]>(`${this.apiUrl}/estaciones/activas`);
  }

  getEstacionById(id: number): Observable<Estacion> {
    if (MOCK_MODE) {
      const est = this.getEstacionesDemo().find(e => e.id === id || e.idEstacion === id)!;
      return of(est);
    }
    return this.http.get<Estacion>(`${this.apiUrl}/estaciones/${id}`);
  }

  getEstacionByCodigo(codigo: string): Observable<Estacion> {
    if (MOCK_MODE) {
      const est = this.getEstacionesDemo().find(e => e.codigo === codigo)!;
      return of(est);
    }
    return this.http.get<Estacion>(`${this.apiUrl}/estaciones/codigo/${codigo}`);
  }

  buscarEstaciones(termino: string): Observable<Estacion[]> {
    if (MOCK_MODE) {
      const t = (termino || '').toLowerCase();
      const results = this.getEstacionesDemo().filter(e =>
        e.nombre.toLowerCase().includes(t) || e.codigo.toLowerCase().includes(t) || (e.ubicacion || '').toLowerCase().includes(t)
      );
      return of(results);
    }
    return this.http.get<Estacion[]>(`${this.apiUrl}/estaciones/buscar?termino=${termino}`);
  }

  createEstacion(estacion: Partial<Estacion>): Observable<Estacion> {
    return this.http.post<Estacion>(`${this.apiUrl}/estaciones`, estacion).pipe(
      catchError((error) => {
        console.error('Error creando estación:', error);
        throw error;
      })
    );
  }

  assignUserToStation(stationId: number, userId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/estaciones/${stationId}/usuarios/${userId}`, {}).pipe(
      catchError((error) => {
        console.error('Error asignando usuario a estación:', error);
        throw error;
      })
    );
  }

  removeUserFromStation(stationId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/estaciones/${stationId}/usuarios/${userId}`).pipe(
      catchError((error) => {
        console.error('Error removiendo usuario de estación:', error);
        throw error;
      })
    );
  }

  getStationUsers(stationId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/estaciones/${stationId}/usuarios`).pipe(
      catchError((error) => {
        console.error('Error obteniendo usuarios de estación:', error);
        throw error;
      })
    );
  }

  updateEstacion(estacion: Estacion): Observable<Estacion> {
    return this.http.put<Estacion>(`${this.apiUrl}/estaciones/${estacion.id}`, estacion).pipe(
      catchError((error) => {
        console.error('Error actualizando estación:', error);
        throw error;
      })
    );
  }

  deleteEstacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/estaciones/${id}`).pipe(
      catchError((error) => {
        console.error('Error eliminando estación:', error);
        throw error;
      })
    );
  }
}

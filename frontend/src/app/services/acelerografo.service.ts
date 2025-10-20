import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { Acelerografo } from '../models/acelerografo.model';
import { environment } from '../../environments/environment';
import { MOCK_MODE } from '../config/mock.config';

@Injectable({
  providedIn: 'root'
})
export class AcelerografoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Método para obtener todos los acelerógrafos
  getAcelerografos(): Observable<Acelerografo[]> {
    if (MOCK_MODE) {
      return of(this.getAcelerografosDemo());
    }
    return this.http.get<Acelerografo[]>(`${this.apiUrl}/acelerografos`).pipe(
      catchError(() => of(this.getAcelerografosDemo()))
    );
  }

  private getAcelerografosDemo(): Acelerografo[] {
    return [
      {
        id: 1,
        idAcelerografo: 1,
        codigo: 'ACL-001',
        nombre: 'Acelerógrafo Centro',
        marca: 'Kinemetrics',
        modelo: 'Episensor ES-T',
        numeroSerie: 'KIN-2023-001',
        ubicacion: 'Centro de Manizales',
        latitud: 5.0703,
        longitud: -75.5138,
        altura: 2150,
        fechaInstalacion: '2023-01-15',
        fechaUltimaCalibración: '2024-01-15',
        estado: 1,
        activo: true,
        descripcion: 'Acelerógrafo principal ubicado en el centro de la ciudad',
        frecuenciaMuestreo: 200,
        rangoMedicion: 2.0,
        resolucion: 24,
        tipoSensor: 'Triaxial',
        idEstacion: 1,
        estacionCodigo: 'MNZ-001',
        estacionNombre: 'Centro Manizales',
        responsable: 'Dr. Juan Pérez'
      },
      {
        id: 2,
        idAcelerografo: 2,
        codigo: 'ACL-002',
        nombre: 'Acelerógrafo Norte',
        marca: 'Güralp',
        modelo: 'CMG-5TDE',
        numeroSerie: 'GUR-2023-002',
        ubicacion: 'Norte de Manizales',
        latitud: 5.0803,
        longitud: -75.5038,
        altura: 2200,
        fechaInstalacion: '2023-02-20',
        fechaUltimaCalibración: '2024-02-20',
        estado: 1,
        activo: true,
        descripcion: 'Acelerógrafo de alta precisión en zona norte',
        frecuenciaMuestreo: 100,
        rangoMedicion: 1.0,
        resolucion: 24,
        tipoSensor: 'Triaxial',
        idEstacion: 2,
        estacionCodigo: 'MNZ-002',
        estacionNombre: 'Norte Manizales',
        responsable: 'Dra. María González'
      },
      {
        id: 3,
        idAcelerografo: 3,
        codigo: 'ACL-003',
        nombre: 'Acelerógrafo Sur',
        marca: 'Nanometrics',
        modelo: 'Titan SMA',
        numeroSerie: 'NAN-2023-003',
        ubicacion: 'Sur de Manizales',
        latitud: 5.0603,
        longitud: -75.5238,
        altura: 2100,
        fechaInstalacion: '2023-03-10',
        fechaUltimaCalibración: '2023-12-10',
        estado: 0,
        activo: false,
        descripcion: 'Acelerógrafo en mantenimiento preventivo',
        frecuenciaMuestreo: 250,
        rangoMedicion: 4.0,
        resolucion: 24,
        tipoSensor: 'Triaxial',
        idEstacion: 3,
        estacionCodigo: 'MNZ-003',
        estacionNombre: 'Sur Manizales',
        responsable: 'Ing. Carlos Rodríguez'
      }
    ];
  }

  getAllAcelerografos(): Observable<Acelerografo[]> {
    return this.getAcelerografos();
  }

  getAcelerografosActivos(): Observable<Acelerografo[]> {
    if (MOCK_MODE) {
      return of(this.getAcelerografosDemo().filter(a => a.activo));
    }
    return this.http.get<Acelerografo[]>(`${this.apiUrl}/acelerografos/activos`);
  }

  getAcelerografoById(id: number): Observable<Acelerografo> {
    if (MOCK_MODE) {
      const item = this.getAcelerografosDemo().find(a => a.id === id || a.idAcelerografo === id)!;
      return of(item);
    }
    return this.http.get<Acelerografo>(`${this.apiUrl}/acelerografos/${id}`);
  }

  getAcelerografoByCodigo(codigo: string): Observable<Acelerografo> {
    if (MOCK_MODE) {
      const item = this.getAcelerografosDemo().find(a => a.codigo === codigo)!;
      return of(item);
    }
    return this.http.get<Acelerografo>(`${this.apiUrl}/acelerografos/codigo/${codigo}`);
  }

  buscarAcelerografos(termino: string): Observable<Acelerografo[]> {
    if (MOCK_MODE) {
      const t = (termino || '').toLowerCase();
      return of(this.getAcelerografosDemo().filter(a =>
        a.nombre.toLowerCase().includes(t) || a.codigo.toLowerCase().includes(t) || (a.ubicacion || '').toLowerCase().includes(t)
      ));
    }
    return this.http.get<Acelerografo[]>(`${this.apiUrl}/acelerografos/buscar?termino=${termino}`);
  }

  createAcelerografo(acelerografo: Partial<Acelerografo>): Observable<Acelerografo> {
    return this.http.post<Acelerografo>(`${this.apiUrl}/acelerografos`, acelerografo).pipe(
      catchError((error) => {
        console.error('Error creando acelerógrafo:', error);
        throw error;
      })
    );
  }

  updateAcelerografo(acelerografo: Acelerografo): Observable<Acelerografo> {
    return this.http.put<Acelerografo>(`${this.apiUrl}/acelerografos/${acelerografo.id}`, acelerografo).pipe(
      catchError((error) => {
        console.error('Error actualizando acelerógrafo:', error);
        throw error;
      })
    );
  }

  deleteAcelerografo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/acelerografos/${id}`).pipe(
      catchError((error) => {
        console.error('Error eliminando acelerógrafo:', error);
        throw error;
      })
    );
  }
}

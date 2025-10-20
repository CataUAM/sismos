export interface Acelerografo {
  id?: number;
  idAcelerografo?: number;
  codigo: string;
  nombre: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  // Relación con estación - un acelerógrafo pertenece a una estación
  idEstacion?: number;
  estacionCodigo?: string;
  estacionNombre?: string;
  // Ubicación (mantener compatibilidad)
  ubicacion?: string;
  latitud?: number;
  longitud?: number;
  altura?: number;
  // Ubicación relativa dentro de la estación
  ubicacionEnEstacion?: string;
  orientacion?: string; // Norte, Sur, Este, Oeste, Vertical
  fechaInstalacion: string;
  fechaUltimaCalibración?: string;
  estado: number;
  activo?: boolean;
  descripcion?: string;
  frecuenciaMuestreo: number;
  rangoMedicion: number;
  resolucion: number;
  tipoSensor: string;
  responsable?: string;
  ultimaLectura?: string;
  configuracion?: ConfiguracionAcelerografo;
}

export interface ConfiguracionAcelerografo {
  id?: number;
  idAcelerografo: number;
  ganancia: number;
  filtroFrecuencia: number;
  modoOperacion: string;
  intervaloGrabacion: number;
  umbralActivacion: number;
  canalesActivos: number;
  formatoSalida: string;
  sincronizacionGPS: boolean;
}

export interface LecturaAcelerografo {
  id?: number;
  idAcelerografo: number;
  timestamp: string;
  aceleracionX: number;
  aceleracionY: number;
  aceleracionZ: number;
  magnitud: number;
  frecuencia: number;
  duracion: number;
  calidad: string;
  procesado: boolean;
}

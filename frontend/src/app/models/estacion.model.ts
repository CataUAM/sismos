export interface Estacion {
  id?: number;
  idEstacion?: number;
  codigo: string;
  nombre: string;
  ubicacion?: string;
  latitud: number;
  longitud: number;
  altura: number;
  geologia: string;
  red: string;
  estado: number;
  activa?: boolean;
  descripcion?: string;
  // Relación con acelerógrafos - una estación puede tener múltiples acelerógrafos
  acelerografos?: Acelerografo[];
  totalAcelerografos?: number;
  // Mantener sensores para compatibilidad con estructura existente
  sensores?: Sensor[];
  totalSensores: number;
  ultimaLectura?: string;
}

// Importar el modelo de Acelerógrafo
import { Acelerografo } from './acelerografo.model';

export interface Sensor {
  idSensor: number;
  idEstacion: number;
  estacionNombre: string;
  estacionCodigo: string;
  tipoSensor: string;
  marca: string;
  modelo: string;
  descripcion: string;
  frecuenciaMuestreo: number;
  canales?: CanalSensor[];
  ultimaLectura?: string;
}

export interface CanalSensor {
  idCanal: number;
  idSensor: number;
  tipoCanal: string;
  componente: string;
  descripcion: string;
  ultimaLectura?: string;
}

export interface Lectura {
  idLectura: number;
  idCanal: number;
  estacionCodigo: string;
  sensorTipo: string;
  canalTipo: string;
  componente: string;
  tiempo: string;
  aceleracion?: number;
  velocidad?: number;
  desplazamiento?: number;
}

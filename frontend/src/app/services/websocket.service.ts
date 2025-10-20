import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

declare var SockJS: any;
declare var Stomp: any;

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: any = null;
  private connected = new BehaviorSubject<boolean>(false);
  private readings = new BehaviorSubject<any[]>([]);

  public connected$ = this.connected.asObservable();
  public readings$ = this.readings.asObservable();

  connect(): void {
    if (this.stompClient && this.stompClient.connected) {
      return;
    }

    const socket = new SockJS(`${environment.apiUrl}/ws`);
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      this.connected.next(true);
      console.log('WebSocket conectado');

      // Suscribirse a datos sísmicos individuales
      this.stompClient!.subscribe('/topic/seismic-data', (message: any) => {
        const reading: any = JSON.parse(message.body);
        this.addReading(reading);
      });

      // Suscribirse a lotes de datos sísmicos
      this.stompClient!.subscribe('/topic/seismic-data/batch', (message: any) => {
        const readingsBatch: any[] = JSON.parse(message.body);
        this.addReadingsBatch(readingsBatch);
      });

    }, (error: any) => {
      console.error('Error conectando WebSocket:', error);
      this.connected.next(false);
      // Reintentar conexión después de 5 segundos
      setTimeout(() => this.connect(), 5000);
    });
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect();
      this.connected.next(false);
      console.log('WebSocket desconectado');
    }
  }

  private addReading(reading: any): void {
    const currentReadings = this.readings.value;
    const updatedReadings = [reading, ...currentReadings].slice(0, 1000); // Mantener solo las últimas 1000
    this.readings.next(updatedReadings);
  }

  private addReadingsBatch(readings: any[]): void {
    const currentReadings = this.readings.value;
    const updatedReadings = [...readings, ...currentReadings].slice(0, 1000);
    this.readings.next(updatedReadings);
  }

  clearReadings(): void {
    this.readings.next([]);
  }
}

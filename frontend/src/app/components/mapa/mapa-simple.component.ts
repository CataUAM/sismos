import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="mapa-container">
      <mat-card class="mapa-card">
        <mat-card-header>
          <mat-card-title>Mapa Interactivo de Estaciones Sísmicas</mat-card-title>
          <mat-card-subtitle>Ubicación y estado de las estaciones de monitoreo</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="mapa-placeholder">
            <mat-icon class="large-icon">map</mat-icon>
            <h3>Mapa Interactivo</h3>
            <p>El mapa con Mapbox se está configurando...</p>
            <p>Estaciones disponibles en Manizales:</p>
            <ul>
              <li>Estación Centro (MNZ-001) - Activa</li>
              <li>Estación Norte (MNZ-002) - Activa</li>
              <li>Estación Sur (MNZ-003) - Inactiva</li>
            </ul>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .mapa-container {
      height: calc(100vh - 120px);
      padding: 20px;
    }

    .mapa-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .mapa-placeholder {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      background-color: #f5f5f5;
      border-radius: 8px;
      padding: 40px;
      min-height: 400px;
    }

    .large-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #1976d2;
      margin-bottom: 16px;
    }

    h3 {
      margin: 16px 0;
      color: #333;
    }

    p {
      margin: 8px 0;
      color: #666;
    }

    ul {
      text-align: left;
      margin-top: 20px;
    }

    li {
      margin: 8px 0;
      color: #555;
    }
  `]
})
export class MapaComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    console.log('Mapa simple cargado');
  }
}

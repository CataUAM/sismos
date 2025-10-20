import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { Estacion } from '../../models/estacion.model';
import { EstacionService } from '../../services/estacion.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { SensorHistoryModalComponent } from '../sensor-history-modal/sensor-history-modal.component';
import { environment } from '../../../environments/environment';

import mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="mapa-container">
      <mat-card class="mapa-card">
        <mat-card-header>
          <mat-card-title>Mapa Interactivo de Estaciones Sísmicas</mat-card-title>
          <mat-card-subtitle>Ubicación y estado de las estaciones de monitoreo</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="mapa-controls">
            <button mat-raised-button color="primary" (click)="centrarEnManizales()">
              <mat-icon>my_location</mat-icon>
              Centrar en Manizales
            </button>
            <button mat-raised-button (click)="toggleEstaciones()">
              <mat-icon>visibility</mat-icon>
              {{ mostrarEstaciones ? 'Ocultar' : 'Mostrar' }} Estaciones
            </button>
            <button mat-raised-button (click)="toggle3D()">
              <mat-icon>3d_rotation</mat-icon>
              {{ is3D ? 'Vista 2D' : 'Vista 3D' }}
            </button>
          </div>
          
          <div class="mapa-wrapper">
            <div #mapContainer class="mapa" id="mapa" style="width: 100%; height: 500px;"></div>
            <div *ngIf="loading" class="loading-overlay">
              <mat-spinner></mat-spinner>
              <p>Cargando mapa...</p>
            </div>
          </div>
          
          <div class="leyenda">
            <h4>Leyenda</h4>
            <div class="leyenda-item">
              <div class="marker-activa"></div>
              <span>Estación Activa</span>
            </div>
            <div class="leyenda-item">
              <div class="marker-alerta"></div>
              <span>Estación con Alerta</span>
            </div>
            <div class="leyenda-item">
              <div class="marker-inactiva"></div>
              <span>Estación Inactiva</span>
            </div>
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

    .mapa-controls {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }

    .mapa-wrapper {
      position: relative;
      flex: 1;
      min-height: 500px;
    }

    .mapa {
      width: 100%;
      height: 100%;
      border-radius: 8px;
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .leyenda {
      margin-top: 16px;
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 8px;
    }

    .leyenda h4 {
      margin: 0 0 12px 0;
      font-size: 16px;
    }

    .leyenda-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }

    .marker-activa, .marker-inactiva, .marker-alerta {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin-right: 8px;
    }

    .marker-activa {
      background-color: #4CAF50;
      border: 2px solid #2E7D32;
    }

    .marker-alerta {
      background-color: #FF9800;
      border: 2px solid #F57C00;
      animation: pulse 2s infinite;
      box-shadow: 0 0 8px rgba(255, 152, 0, 0.6);
    }

    .marker-inactiva {
      background-color: #F44336;
      border: 2px solid #C62828;
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.2);
        opacity: 0.7;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    /* Estilos para forzar el comportamiento del popup de Mapbox */
    :host ::ng-deep .mapboxgl-popup-content {
      max-width: 320px !important;
      min-width: 300px !important;
      word-wrap: break-word !important;
      overflow-wrap: break-word !important;
      white-space: normal !important;
    }

    :host ::ng-deep .mapboxgl-popup-content div {
      word-wrap: break-word !important;
      overflow-wrap: break-word !important;
      max-width: 100% !important;
    }
  `]
})
export class MapaComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  
  map!: mapboxgl.Map;
  estaciones: Estacion[] = [];
  loading = true;
  mostrarEstaciones = true;
  is3D = false;
  markers: mapboxgl.Marker[] = [];

  // Coordenadas de Manizales
  private readonly MANIZALES_COORDS: [number, number] = [-75.5138, 5.0703];

  currentUser: User | null = null;

  constructor(
    private estacionService: EstacionService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    console.log('Mapbox token:', environment.mapboxAccessToken);
    mapboxgl.accessToken = environment.mapboxAccessToken;
  }

  ngOnInit(): void {
    this.setCurrentUser();
    // Dar tiempo para que el DOM se renderice completamente
    setTimeout(() => {
      this.initializeMap();
      this.loadEstaciones();
      this.checkRouteParams();
    }, 100);
  }

  checkRouteParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['lat'] && params['lng']) {
        const lat = parseFloat(params['lat']);
        const lng = parseFloat(params['lng']);
        const zoom = params['zoom'] ? parseInt(params['zoom']) : 15;
        
        // Centrar el mapa en las coordenadas especificadas
        this.map.flyTo({
          center: [lng, lat],
          zoom: zoom,
          duration: 2000
        });

        // Si hay un estacionId, resaltar esa estación
        if (params['estacionId']) {
          setTimeout(() => {
            this.highlightStation(params['estacionId']);
          }, 2500);
        }
      }
    });
  }

  highlightStation(estacionId: string): void {
    const estacion = this.estaciones.find(e => e.id?.toString() === estacionId);
    if (estacion && estacion.latitud && estacion.longitud) {
      // Crear un popup temporal para resaltar la estación
      const popup = new mapboxgl.Popup({ closeOnClick: true })
        .setLngLat([estacion.longitud, estacion.latitud])
        .setHTML(`
          <div style="padding: 10px;">
            <h4 style="margin: 0 0 8px 0; color: #1976d2;">${estacion.codigo}</h4>
            <p style="margin: 0 0 4px 0;"><strong>${estacion.nombre}</strong></p>
            <p style="margin: 0; color: #666; font-size: 12px;">Estación seleccionada desde la lista</p>
          </div>
        `)
        .addTo(this.map);

      // Cerrar el popup automáticamente después de 5 segundos
      setTimeout(() => {
        popup.remove();
      }, 5000);
    }
  }

  setCurrentUser(): void {
    // Simulación de usuario logueado - en producción vendría del servicio de autenticación
    // Cambiar entre estos usuarios para probar diferentes roles:
    
    // ADMIN - Ve todas las estaciones
    // this.currentUser = {
    //   id: 1,
    //   username: 'admin',
    //   email: 'admin@seismic.com',
    //   firstName: 'Admin',
    //   lastName: 'User',
    //   roles: ['ADMIN']
    // } as User;

    // OPERATOR - Solo ve estaciones asignadas (MAN001, MAN002, MAN003)
    this.currentUser = {
      id: 2,
      username: 'operator_manizales',
      email: 'operator.manizales@seismic.com',
      firstName: 'Juan Carlos',
      lastName: 'Rodríguez',
      roles: ['OPERATOR']
    } as User;

    // VIEWER - Solo lectura de estación asignada (MAN001)
    // this.currentUser = {
    //   id: 4,
    //   username: 'viewer_universidad',
    //   email: 'viewer.universidad@seismic.com',
    //   firstName: 'Dr. Carlos',
    //   lastName: 'Pérez',
    //   roles: ['VIEWER']
    // } as User;
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initializeMap(): void {
    try {
      console.log('Inicializando mapa...');
      console.log('Container element:', this.mapContainer?.nativeElement);
      console.log('Mapbox access token set:', !!mapboxgl.accessToken);
      
      this.map = new mapboxgl.Map({
        container: this.mapContainer.nativeElement,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: this.MANIZALES_COORDS,
        zoom: 13,
        pitch: 0, // Mantener vista 2D por defecto
        bearing: 0
      });

      this.map.on('load', () => {
        console.log('Mapa cargado exitosamente');
        this.add3DBuildingsLayer();
        this.loading = false;
      });

      this.map.on('error', (e) => {
        console.error('Error del mapa:', e);
        this.loading = false;
        this.snackBar.open('Error cargando el mapa. Verifica tu token de Mapbox.', 'Cerrar', {
          duration: 5000
        });
      });

      this.map.on('style.load', () => {
        console.log('Estilo del mapa cargado');
      });

      // Agregar controles de navegación
      this.map.addControl(new mapboxgl.NavigationControl());
      this.map.addControl(new mapboxgl.FullscreenControl());

    } catch (error) {
      console.error('Error inicializando el mapa:', error);
      this.loading = false;
      this.snackBar.open('Error cargando el mapa. Verifica la conexión a internet.', 'Cerrar', {
        duration: 5000
      });
    }
  }

  private loadEstaciones(): void {
    this.loading = true;
    
    // Cargar estaciones basadas en permisos del usuario
    if (this.isAdminUser()) {
      this.estacionService.getEstacionesParaMapa().subscribe({
        next: (estaciones) => {
          this.estaciones = estaciones;
          this.addMarkersToMap();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error cargando estaciones:', error);
          this.snackBar.open('Error cargando estaciones', 'Cerrar', { duration: 5000 });
          this.loading = false;
        }
      });
    } else if (this.currentUser?.id) {
      this.estacionService.getEstacionesByUser(this.currentUser.id).subscribe({
        next: (estaciones) => {
          this.estaciones = estaciones;
          this.addMarkersToMap();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error cargando estaciones del usuario:', error);
          this.snackBar.open('Error cargando estaciones asignadas', 'Cerrar', { duration: 5000 });
          this.loading = false;
        }
      });
    }
  }

  isAdminUser(): boolean {
    return this.currentUser?.roles?.includes('ADMIN') || 
           this.currentUser?.roles?.includes('SUPER_ADMIN') || false;
  }

  private addMarkersToMap(): void {
    this.clearMarkers();

    this.estaciones.forEach(estacion => {
      if (estacion.latitud && estacion.longitud) {
        const isActive = estacion.estado === 1;
        const hasAlert = (estacion as any).alerta === true;
        
        // Determinar colores según estado y alerta
        let backgroundColor, borderColor;
        if (hasAlert) {
          backgroundColor = '#FF9800'; // Naranja para alerta
          borderColor = '#F57C00';
        } else if (isActive) {
          backgroundColor = '#4CAF50'; // Verde para activa sin alerta
          borderColor = '#2E7D32';
        } else {
          backgroundColor = '#F44336'; // Rojo para inactiva
          borderColor = '#C62828';
        }
        
        // Crear elemento personalizado para el marcador
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = backgroundColor;
        el.style.border = `3px solid ${borderColor}`;
        el.style.cursor = 'pointer';
        
        // Agregar efecto de pulsación para alertas
        if (hasAlert) {
          el.style.animation = 'pulse 2s infinite';
          el.style.boxShadow = '0 0 10px rgba(255, 152, 0, 0.6)';
        }

        // Crear popup con botón de historial
        const popupContent = `
          <div style="
            padding: 12px !important; 
            width: 300px !important; 
            max-width: 300px !important; 
            box-sizing: border-box !important;
            overflow-wrap: break-word !important;
            word-break: break-word !important;
            white-space: normal !important;
          ">
            <h4 style="
              margin: 0 0 12px 0 !important; 
              color: #1976d2 !important; 
              font-size: 16px !important; 
              line-height: 1.2 !important;
              word-wrap: break-word !important;
            ">${estacion.nombre}</h4>
            <div style="margin-bottom: 8px !important;">
              <strong>Código:</strong> ${estacion.codigo}
            </div>
            <div style="margin-bottom: 8px !important;">
              <strong>Estado:</strong> 
              <span style="color: ${hasAlert ? '#FF9800' : (isActive ? '#4CAF50' : '#F44336')} !important; font-weight: bold !important;">
                ${hasAlert ? 'ALERTA ACTIVA' : (isActive ? 'Activa' : 'Inactiva')}
              </span>
            </div>
            ${hasAlert ? `
              <div style="
                margin-bottom: 8px !important; 
                padding: 6px !important; 
                background: #FFF3E0 !important; 
                border-left: 4px solid #FF9800 !important; 
                border-radius: 4px !important;
                overflow-wrap: break-word !important;
                word-break: break-word !important;
                max-width: 100% !important;
              ">
                <div style="
                  color: #F57C00 !important; 
                  font-weight: bold !important; 
                  margin-bottom: 2px !important; 
                  font-size: 13px !important;
                  line-height: 1.2 !important;
                ">⚠️ ALERTA</div>
                <div style="
                  color: #F57C00 !important; 
                  font-weight: bold !important; 
                  font-size: 12px !important;
                  line-height: 1.2 !important;
                  margin-bottom: 2px !important;
                ">${(estacion as any).nivelAlerta || 'AMARILLA'}</div>
                <div style="
                  color: #E65100 !important; 
                  font-size: 11px !important; 
                  line-height: 1.3 !important;
                  word-wrap: break-word !important;
                ">${(estacion as any).tipoAlerta || 'Actividad sísmica'}</div>
              </div>
            ` : ''}
            <div style="margin-bottom: 8px;">
              <strong>Sensores:</strong> ${estacion.totalSensores}
            </div>
            ${estacion.geologia ? `
              <div style="margin-bottom: 12px;">
                <strong>Geología:</strong> ${estacion.geologia}
              </div>
            ` : ''}
            <div style="margin-top: 12px; text-align: center;">
              <button 
                id="history-btn-${estacion.id}" 
                style="
                  background: #1976d2; 
                  color: white; 
                  border: none; 
                  padding: 8px 16px; 
                  border-radius: 4px; 
                  cursor: pointer;
                  font-size: 12px;
                  font-weight: 500;
                  display: flex;
                  align-items: center;
                  gap: 6px;
                  margin: 0 auto;
                "
                onmouseover="this.style.background='#1565c0'"
                onmouseout="this.style.background='#1976d2'"
              >
                📊 Ver Historial Sísmico
              </button>
            </div>
          </div>
        `;

        const popup = new mapboxgl.Popup({ 
          offset: 25,
          closeButton: true,
          closeOnClick: false
        }).setHTML(popupContent);

        // Crear marcador
        const marker = new mapboxgl.Marker(el)
          .setLngLat([estacion.longitud, estacion.latitud])
          .setPopup(popup)
          .addTo(this.map);

        // Agregar event listener para el botón de historial
        popup.on('open', () => {
          const historyBtn = document.getElementById(`history-btn-${estacion.id}`);
          if (historyBtn) {
            historyBtn.addEventListener('click', () => {
              this.openSensorHistory(estacion);
            });
          }
        });

        this.markers.push(marker);
      }
    });
  }

  private clearMarkers(): void {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
  }

  centrarEnManizales(): void {
    this.map.flyTo({
      center: this.MANIZALES_COORDS,
      zoom: 12,
      duration: 2000
    });
  }

  toggleEstaciones(): void {
    this.mostrarEstaciones = !this.mostrarEstaciones;
    
    if (this.mostrarEstaciones) {
      this.addMarkersToMap();
    } else {
      this.clearMarkers();
    }
  }

  toggle3D(): void {
    this.is3D = !this.is3D;
    
    if (this.is3D) {
      // Cambiar a vista 3D con edificios
      this.map.easeTo({
        pitch: 60,
        bearing: -17.6,
        duration: 1000
      });
    } else {
      // Volver a vista 2D
      this.map.easeTo({
        pitch: 0,
        bearing: 0,
        duration: 1000
      });
    }
  }

  private add3DBuildingsLayer(): void {
    try {
      // Verificar si el estilo ya tiene edificios 3D
      if (this.map.getLayer('building-3d')) {
        console.log('Capa de edificios 3D ya existe');
        return;
      }

      // Esperar a que el estilo se cargue completamente
      this.map.on('style.load', () => {
        // Agregar capa de edificios 3D manualmente con datos de Mapbox Streets
        this.map.addLayer({
          'id': 'building-3d',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 14,
          'paint': {
            'fill-extrusion-color': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              '#ff6b6b',
              '#4a90e2'
            ],
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14,
              0,
              14.05,
              ['*', ['get', 'height'], 1]
            ],
            'fill-extrusion-base': [
              'interpolate', 
              ['linear'],
              ['zoom'],
              14,
              0,
              14.05,
              ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.8
          }
        });
        
        console.log('Capa de edificios 3D agregada exitosamente');
      });

    } catch (error) {
      console.error('Error agregando capa de edificios 3D:', error);
    }
  }

  openSensorHistory(estacion: Estacion): void {
    const dialogRef = this.dialog.open(SensorHistoryModalComponent, {
      width: '90vw',
      maxWidth: '1200px',
      height: '80vh',
      data: {
        estacionId: estacion.id,
        estacionNombre: estacion.nombre,
        estacionCodigo: estacion.codigo
      },
      panelClass: 'sensor-history-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal de historial cerrado');
    });
  }
}

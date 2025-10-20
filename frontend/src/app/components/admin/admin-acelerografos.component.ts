import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { Acelerografo } from '../../models/acelerografo.model';
import { Estacion } from '../../models/estacion.model';
import { AcelerografoService } from '../../services/acelerografo.service';
import { EstacionService } from '../../services/estacion.service';

@Component({
  selector: 'app-admin-acelerografos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="admin-container">
      <mat-card class="admin-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>speed</mat-icon>
            Administración de Acelerógrafos
          </mat-card-title>
          <mat-card-subtitle>Gestión completa de acelerógrafos sísmicos</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <!-- Toolbar con acciones -->
          <mat-toolbar class="action-toolbar">
            <span>Acelerógrafos Registrados</span>
            <span class="spacer"></span>
            <button mat-raised-button color="primary" (click)="openCreateDialog()">
              <mat-icon>add</mat-icon>
              Nuevo Acelerógrafo
            </button>
            <button mat-raised-button color="accent" (click)="refreshData()">
              <mat-icon>refresh</mat-icon>
              Actualizar
            </button>
          </mat-toolbar>

          <!-- Tabla de acelerógrafos -->
          <div class="table-container">
            <table mat-table [dataSource]="acelerografos" class="acelerografos-table">
              
              <!-- Columna ID -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let acelerografo">{{acelerografo.id}}</td>
              </ng-container>

              <!-- Columna Código -->
              <ng-container matColumnDef="codigo">
                <th mat-header-cell *matHeaderCellDef>Código</th>
                <td mat-cell *matCellDef="let acelerografo">{{acelerografo.codigo}}</td>
              </ng-container>

              <!-- Columna Nombre -->
              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let acelerografo">{{acelerografo.nombre}}</td>
              </ng-container>

              <!-- Columna Marca/Modelo -->
              <ng-container matColumnDef="marca">
                <th mat-header-cell *matHeaderCellDef>Marca/Modelo</th>
                <td mat-cell *matCellDef="let acelerografo">
                  {{acelerografo.marca}} {{acelerografo.modelo}}
                </td>
              </ng-container>

              <!-- Columna Estación -->
              <ng-container matColumnDef="estacion">
                <th mat-header-cell *matHeaderCellDef>Estación</th>
                <td mat-cell *matCellDef="let acelerografo">{{acelerografo.estacionNombre || acelerografo.estacionCodigo || 'Sin asignar'}}</td>
              </ng-container>

              <!-- Columna Ubicación -->
              <ng-container matColumnDef="ubicacion">
                <th mat-header-cell *matHeaderCellDef>Ubicación</th>
                <td mat-cell *matCellDef="let acelerografo">{{acelerografo.ubicacion}}</td>
              </ng-container>

              <!-- Columna Frecuencia -->
              <ng-container matColumnDef="frecuencia">
                <th mat-header-cell *matHeaderCellDef>Freq. (Hz)</th>
                <td mat-cell *matCellDef="let acelerografo">{{acelerografo.frecuenciaMuestreo}}</td>
              </ng-container>

              <!-- Columna Estado -->
              <ng-container matColumnDef="estado">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let acelerografo">
                  <span class="estado-badge" [class.activo]="acelerografo.activo" [class.inactivo]="!acelerografo.activo">
                    {{acelerografo.activo ? 'Activo' : 'Inactivo'}}
                  </span>
                </td>
              </ng-container>

              <!-- Columna Acciones -->
              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let acelerografo">
                  <button mat-icon-button color="primary" (click)="openEditDialog(acelerografo)" 
                          matTooltip="Editar acelerógrafo">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteAcelerografo(acelerografo)" 
                          matTooltip="Eliminar acelerógrafo">
                    <mat-icon>delete</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" (click)="toggleEstado(acelerografo)" 
                          [matTooltip]="acelerografo.activo ? 'Desactivar' : 'Activar'">
                    <mat-icon>{{acelerografo.activo ? 'toggle_on' : 'toggle_off'}}</mat-icon>
                  </button>
                  <button mat-icon-button color="primary" (click)="verDetalles(acelerografo)" 
                          matTooltip="Ver detalles">
                    <mat-icon>visibility</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <!-- Formulario de creación/edición -->
          <div *ngIf="showForm" class="form-container">
            <mat-card class="form-card">
              <mat-card-header>
                <mat-card-title>
                  {{isEditing ? 'Editar' : 'Nuevo'}} Acelerógrafo
                </mat-card-title>
              </mat-card-header>
              
              <mat-card-content>
                <form [formGroup]="acelerografoForm" (ngSubmit)="saveAcelerografo()">
                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Código</mat-label>
                      <input matInput formControlName="codigo" placeholder="Ej: ACL-001">
                      <mat-error *ngIf="acelerografoForm.get('codigo')?.hasError('required')">
                        El código es requerido
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Nombre</mat-label>
                      <input matInput formControlName="nombre" placeholder="Ej: Acelerógrafo Centro">
                      <mat-error *ngIf="acelerografoForm.get('nombre')?.hasError('required')">
                        El nombre es requerido
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Marca</mat-label>
                      <input matInput formControlName="marca" placeholder="Ej: Kinemetrics">
                      <mat-error *ngIf="acelerografoForm.get('marca')?.hasError('required')">
                        La marca es requerida
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Modelo</mat-label>
                      <input matInput formControlName="modelo" placeholder="Ej: Episensor ES-T">
                      <mat-error *ngIf="acelerografoForm.get('modelo')?.hasError('required')">
                        El modelo es requerido
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Estación Asociada</mat-label>
                      <mat-select formControlName="idEstacion" placeholder="Seleccionar estación">
                        <mat-option *ngFor="let estacion of estaciones" [value]="estacion.id">
                          {{estacion.codigo}} - {{estacion.nombre}}
                        </mat-option>
                      </mat-select>
                      <mat-error *ngIf="acelerografoForm.get('idEstacion')?.hasError('required')">
                        Debe seleccionar una estación
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Número de Serie</mat-label>
                      <input matInput formControlName="numeroSerie" placeholder="Ej: KIN-2023-001">
                      <mat-error *ngIf="acelerografoForm.get('numeroSerie')?.hasError('required')">
                        El número de serie es requerido
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Ubicación</mat-label>
                      <input matInput formControlName="ubicacion" placeholder="Ej: Centro de Manizales">
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Latitud</mat-label>
                      <input matInput type="number" formControlName="latitud" 
                             placeholder="Ej: 5.0703" step="0.000001">
                      <mat-error *ngIf="acelerografoForm.get('latitud')?.hasError('required')">
                        La latitud es requerida
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Longitud</mat-label>
                      <input matInput type="number" formControlName="longitud" 
                             placeholder="Ej: -75.5138" step="0.000001">
                      <mat-error *ngIf="acelerografoForm.get('longitud')?.hasError('required')">
                        La longitud es requerida
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Altura (m)</mat-label>
                      <input matInput type="number" formControlName="altura" 
                             placeholder="Ej: 2150">
                      <mat-error *ngIf="acelerografoForm.get('altura')?.hasError('required')">
                        La altura es requerida
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Frecuencia de Muestreo (Hz)</mat-label>
                      <input matInput type="number" formControlName="frecuenciaMuestreo" 
                             placeholder="Ej: 200">
                      <mat-error *ngIf="acelerografoForm.get('frecuenciaMuestreo')?.hasError('required')">
                        La frecuencia de muestreo es requerida
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Rango de Medición (g)</mat-label>
                      <input matInput type="number" formControlName="rangoMedicion" 
                             placeholder="Ej: 2.0" step="0.1">
                      <mat-error *ngIf="acelerografoForm.get('rangoMedicion')?.hasError('required')">
                        El rango de medición es requerido
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Resolución (bits)</mat-label>
                      <input matInput type="number" formControlName="resolucion" 
                             placeholder="Ej: 24">
                      <mat-error *ngIf="acelerografoForm.get('resolucion')?.hasError('required')">
                        La resolución es requerida
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Tipo de Sensor</mat-label>
                      <mat-select formControlName="tipoSensor">
                        <mat-option value="Triaxial">Triaxial</mat-option>
                        <mat-option value="Uniaxial">Uniaxial</mat-option>
                        <mat-option value="Biaxial">Biaxial</mat-option>
                      </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Estado</mat-label>
                      <mat-select formControlName="activo">
                        <mat-option [value]="true">Activo</mat-option>
                        <mat-option [value]="false">Inactivo</mat-option>
                      </mat-select>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Fecha de Instalación</mat-label>
                      <input matInput [matDatepicker]="picker" formControlName="fechaInstalacion">
                      <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                      <mat-datepicker #picker></mat-datepicker>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Responsable</mat-label>
                      <input matInput formControlName="responsable" placeholder="Ej: Dr. Juan Pérez">
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Descripción</mat-label>
                      <textarea matInput formControlName="descripcion" 
                                placeholder="Descripción del acelerógrafo" rows="3"></textarea>
                    </mat-form-field>
                  </div>

                  <div class="form-actions">
                    <button mat-raised-button type="button" (click)="cancelForm()">
                      Cancelar
                    </button>
                    <button mat-raised-button color="primary" type="submit" 
                            [disabled]="acelerografoForm.invalid">
                      {{isEditing ? 'Actualizar' : 'Crear'}} Acelerógrafo
                    </button>
                  </div>
                </form>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .admin-card {
      margin-bottom: 20px;
    }

    .action-toolbar {
      background: #f5f5f5;
      margin-bottom: 20px;
      border-radius: 4px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .table-container {
      overflow-x: auto;
      margin-bottom: 20px;
    }

    .acelerografos-table {
      width: 100%;
      min-width: 1000px;
    }

    .estado-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .estado-badge.activo {
      background-color: #4CAF50;
      color: white;
    }

    .estado-badge.inactivo {
      background-color: #F44336;
      color: white;
    }

    .form-container {
      margin-top: 20px;
    }

    .form-card {
      max-width: 900px;
      margin: 0 auto;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    .form-row mat-form-field.full-width {
      flex: 1 1 100%;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 20px;
    }

    mat-card-header mat-icon {
      margin-right: 8px;
    }
  `]
})
export class AdminAcelerografosComponent implements OnInit {
  acelerografos: Acelerografo[] = [];
  estaciones: Estacion[] = [];
  displayedColumns: string[] = ['codigo', 'nombre', 'marca', 'estacion', 'ubicacion', 'frecuencia', 'estado', 'acciones'];
  
  showForm = false;
  isEditing = false;
  currentAcelerografo: Acelerografo | null = null;
  acelerografoForm: FormGroup;

  constructor(
    private acelerografoService: AcelerografoService,
    private estacionService: EstacionService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.acelerografoForm = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      numeroSerie: ['', Validators.required],
      idEstacion: ['', Validators.required],
      ubicacion: [''],
      latitud: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitud: ['', [Validators.required, Validators.min(-180), Validators.max(180)]],
      altura: ['', Validators.required],
      fechaInstalacion: ['', Validators.required],
      activo: [true],
      descripcion: [''],
      frecuenciaMuestreo: ['', Validators.required],
      rangoMedicion: ['', Validators.required],
      resolucion: ['', Validators.required],
      tipoSensor: ['Triaxial', Validators.required],
      responsable: ['']
    });
  }

  ngOnInit(): void {
    this.loadAcelerografos();
    this.loadEstaciones();
  }

  loadAcelerografos(): void {
    this.acelerografoService.getAcelerografos().subscribe({
      next: (acelerografos: any) => {
        console.log('Acelerógrafos cargados:', acelerografos);
        this.acelerografos = acelerografos;
      },
      error: (error: any) => {
        console.error('Error cargando acelerógrafos:', error);
        this.snackBar.open('Error cargando acelerógrafos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  loadEstaciones(): void {
    this.estacionService.getEstaciones().subscribe({
      next: (estaciones: any) => {
        this.estaciones = estaciones;
      },
      error: (error: any) => {
        console.error('Error cargando estaciones:', error);
        this.snackBar.open('Error cargando estaciones', 'Cerrar', { duration: 3000 });
      }
    });
  }

  openCreateDialog(): void {
    this.showForm = true;
    this.isEditing = false;
    this.currentAcelerografo = null;
    this.acelerografoForm.reset({
      activo: true,
      tipoSensor: 'Triaxial'
    });
  }

  openEditDialog(acelerografo: Acelerografo): void {
    this.showForm = true;
    this.isEditing = true;
    this.currentAcelerografo = acelerografo;
    this.acelerografoForm.patchValue({
      codigo: acelerografo.codigo,
      nombre: acelerografo.nombre,
      marca: acelerografo.marca,
      modelo: acelerografo.modelo,
      numeroSerie: acelerografo.numeroSerie,
      idEstacion: acelerografo.idEstacion,
      ubicacion: acelerografo.ubicacion,
      latitud: acelerografo.latitud,
      longitud: acelerografo.longitud,
      altura: acelerografo.altura,
      fechaInstalacion: acelerografo.fechaInstalacion,
      activo: acelerografo.activo,
      descripcion: acelerografo.descripcion || '',
      frecuenciaMuestreo: acelerografo.frecuenciaMuestreo,
      rangoMedicion: acelerografo.rangoMedicion,
      resolucion: acelerografo.resolucion,
      tipoSensor: acelerografo.tipoSensor,
      responsable: acelerografo.responsable || ''
    });
  }

  saveAcelerografo(): void {
    if (this.acelerografoForm.valid) {
      const formData = this.acelerografoForm.value;
      
      if (this.isEditing && this.currentAcelerografo) {
        // Actualizar acelerógrafo existente
        const updatedAcelerografo: Acelerografo = {
          ...this.currentAcelerografo,
          ...formData
        };
        
        this.acelerografoService.updateAcelerografo(updatedAcelerografo).subscribe({
          next: () => {
            this.snackBar.open('Acelerógrafo actualizado exitosamente', 'Cerrar', { duration: 3000 });
            this.loadAcelerografos();
            this.cancelForm();
          },
          error: (error: any) => {
            console.error('Error actualizando acelerógrafo:', error);
            this.snackBar.open('Error actualizando acelerógrafo', 'Cerrar', { duration: 3000 });
          }
        });
      } else {
        // Crear nuevo acelerógrafo
        const newAcelerografo: Partial<Acelerografo> = formData;
        
        this.acelerografoService.createAcelerografo(newAcelerografo).subscribe({
          next: () => {
            this.snackBar.open('Acelerógrafo creado exitosamente', 'Cerrar', { duration: 3000 });
            this.loadAcelerografos();
            this.cancelForm();
          },
          error: (error: any) => {
            console.error('Error creando acelerógrafo:', error);
            this.snackBar.open('Error creando acelerógrafo', 'Cerrar', { duration: 3000 });
          }
        });
      }
    }
  }

  deleteAcelerografo(acelerografo: Acelerografo): void {
    if (confirm(`¿Estás seguro de eliminar el acelerógrafo "${acelerografo.nombre}"?`)) {
      this.acelerografoService.deleteAcelerografo(acelerografo.id!).subscribe({
        next: () => {
          this.snackBar.open('Acelerógrafo eliminado exitosamente', 'Cerrar', { duration: 3000 });
          this.loadAcelerografos();
        },
        error: (error: any) => {
          console.error('Error eliminando acelerógrafo:', error);
          this.snackBar.open('Error eliminando acelerógrafo', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  toggleEstado(acelerografo: Acelerografo): void {
    const updatedAcelerografo = { ...acelerografo, activo: !acelerografo.activo };
    
    this.acelerografoService.updateAcelerografo(updatedAcelerografo).subscribe({
      next: () => {
        this.snackBar.open(
          `Acelerógrafo ${updatedAcelerografo.activo ? 'activado' : 'desactivado'} exitosamente`, 
          'Cerrar', 
          { duration: 3000 }
        );
        this.loadAcelerografos();
      },
      error: (error: any) => {
        console.error('Error actualizando estado:', error);
        this.snackBar.open('Error actualizando estado del acelerógrafo', 'Cerrar', { duration: 3000 });
      }
    });
  }

  verDetalles(acelerografo: Acelerografo): void {
    // Implementar vista de detalles en el futuro
    this.snackBar.open('Funcionalidad de detalles próximamente', 'Cerrar', { duration: 2000 });
  }

  cancelForm(): void {
    this.showForm = false;
    this.isEditing = false;
    this.currentAcelerografo = null;
    this.acelerografoForm.reset();
  }

  refreshData(): void {
    this.loadAcelerografos();
    this.snackBar.open('Datos actualizados', 'Cerrar', { duration: 2000 });
  }
}

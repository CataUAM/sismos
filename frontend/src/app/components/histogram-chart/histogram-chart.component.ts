import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorReading } from '../../services/sensor-history.service';

interface HistogramBar {
  label: string;
  frequency: number;
  percentage: number;
  range: { min: number; max: number };
}

@Component({
  selector: 'app-histogram-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="histogram-container">
      <div class="chart-header">
        <h4>Distribución de Aceleraciones</h4>
        <div class="chart-controls">
          <select (change)="onBinsChange($event)" class="bins-selector">
            <option value="10">10 intervalos</option>
            <option value="15" selected>15 intervalos</option>
            <option value="20">20 intervalos</option>
            <option value="25">25 intervalos</option>
          </select>
        </div>
      </div>
      <div class="chart-wrapper">
        <div class="histogram-bars" *ngIf="histogramData.length > 0">
          <div 
            *ngFor="let bar of histogramData; let i = index" 
            class="histogram-bar"
            [style.height.%]="bar.percentage"
            [style.background-color]="getBarColor(bar.frequency)"
            [title]="getBarTooltip(bar)">
            <div class="bar-label">{{bar.frequency}}</div>
          </div>
        </div>
        <div class="histogram-labels" *ngIf="histogramData.length > 0">
          <div *ngFor="let bar of histogramData" class="label">{{bar.label}}</div>
        </div>
        <div *ngIf="histogramData.length === 0" class="no-data">
          No hay datos para mostrar
        </div>
      </div>
      <div class="chart-stats">
        <div class="stat-item">
          <span class="label">Media:</span>
          <span class="value">{{statistics.mean | number:'1.6-6'}} m/s²</span>
        </div>
        <div class="stat-item">
          <span class="label">Mediana:</span>
          <span class="value">{{statistics.median | number:'1.6-6'}} m/s²</span>
        </div>
        <div class="stat-item">
          <span class="label">Desv. Estándar:</span>
          <span class="value">{{statistics.stdDev | number:'1.6-6'}} m/s²</span>
        </div>
        <div class="stat-item">
          <span class="label">Rango:</span>
          <span class="value">{{statistics.range | number:'1.6-6'}} m/s²</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .histogram-container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding: 0 8px;
    }

    .chart-header h4 {
      margin: 0;
      color: #333;
      font-size: 16px;
      font-weight: 500;
    }

    .bins-selector {
      padding: 4px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 12px;
      background: white;
    }

    .chart-wrapper {
      flex: 1;
      position: relative;
      min-height: 300px;
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
    }

    .histogram-bars {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      height: 250px;
      padding: 20px 10px 10px;
      border-bottom: 2px solid #ddd;
      border-left: 2px solid #ddd;
      background: linear-gradient(to top, #f8f9fa 0%, #ffffff 100%);
    }

    .histogram-bar {
      flex: 1;
      margin: 0 1px;
      position: relative;
      min-height: 5px;
      border-radius: 3px 3px 0 0;
      transition: all 0.3s ease;
      cursor: pointer;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    .histogram-bar:hover {
      opacity: 0.8;
      transform: translateY(-2px);
    }

    .bar-label {
      position: absolute;
      top: -20px;
      font-size: 10px;
      font-weight: bold;
      color: #333;
      text-align: center;
      width: 100%;
    }

    .histogram-labels {
      display: flex;
      justify-content: space-between;
      padding: 5px 10px;
      border-left: 2px solid #ddd;
    }

    .histogram-labels .label {
      flex: 1;
      text-align: center;
      font-size: 9px;
      color: #666;
      transform: rotate(-45deg);
      transform-origin: center;
      margin-top: 10px;
    }

    .no-data {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 250px;
      color: #999;
      font-style: italic;
    }

    .chart-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 6px;
      border: 1px solid #e9ecef;
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
    }

    .stat-item .label {
      font-weight: 500;
      color: #666;
    }

    .stat-item .value {
      font-weight: bold;
      color: #1976d2;
    }
  `]
})
export class HistogramChartComponent implements OnInit, OnDestroy, OnChanges {
  @Input() readings: SensorReading[] = [];
  @Input() componentType: string = 'Z';

  private numberOfBins = 15;
  histogramData: HistogramBar[] = [];

  statistics = {
    mean: 0,
    median: 0,
    stdDev: 0,
    range: 0
  };

  ngOnInit(): void {
    this.createHistogram();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['readings']) {
      this.createHistogram();
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  onBinsChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.numberOfBins = parseInt(target.value);
    this.createHistogram();
  }

  private createHistogram(): void {
    if (this.readings.length === 0) {
      this.histogramData = [];
      return;
    }

    const accelerations = this.readings.map(r => r.aceleracion);
    this.calculateStatistics(accelerations);

    const min = Math.min(...accelerations);
    const max = Math.max(...accelerations);
    const binWidth = (max - min) / this.numberOfBins;

    const bins: number[] = new Array(this.numberOfBins).fill(0);
    const ranges: { min: number; max: number }[] = [];

    // Create ranges
    for (let i = 0; i < this.numberOfBins; i++) {
      const binMin = min + (i * binWidth);
      const binMax = min + ((i + 1) * binWidth);
      ranges.push({ min: binMin, max: binMax });
    }

    // Count frequencies
    accelerations.forEach(value => {
      let binIndex = Math.floor((value - min) / binWidth);
      if (binIndex >= this.numberOfBins) {
        binIndex = this.numberOfBins - 1;
      }
      bins[binIndex]++;
    });

    const maxFrequency = Math.max(...bins);

    this.histogramData = bins.map((frequency, index) => ({
      label: ranges[index].min.toFixed(3),
      frequency,
      percentage: maxFrequency > 0 ? (frequency / maxFrequency) * 100 : 0,
      range: ranges[index]
    }));
  }

  getBarColor(frequency: number): string {
    const maxFreq = Math.max(...this.histogramData.map(d => d.frequency));
    const intensity = frequency / maxFreq;
    
    if (intensity > 0.7) return '#1976d2';
    if (intensity > 0.4) return '#42a5f5';
    if (intensity > 0.2) return '#90caf9';
    return '#e3f2fd';
  }

  getBarTooltip(bar: HistogramBar): string {
    const percentage = this.readings.length > 0 ? 
      ((bar.frequency / this.readings.length) * 100).toFixed(1) : '0';
    return `Rango: ${bar.range.min.toFixed(4)} - ${bar.range.max.toFixed(4)} m/s²\nFrecuencia: ${bar.frequency} (${percentage}%)`;
  }

  private calculateStatistics(data: number[]): void {
    if (data.length === 0) {
      this.statistics = { mean: 0, median: 0, stdDev: 0, range: 0 };
      return;
    }

    // Mean
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;

    // Median
    const sorted = [...data].sort((a, b) => a - b);
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

    // Standard deviation
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);

    // Range
    const range = Math.max(...data) - Math.min(...data);

    this.statistics = { mean, median, stdDev, range };
  }
}

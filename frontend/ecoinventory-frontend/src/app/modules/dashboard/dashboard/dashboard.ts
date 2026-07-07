import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { Chart, registerables } from 'chart.js';


Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: false
  
})
export class Dashboard implements OnInit, AfterViewInit {
  // Estadísticas
  totalProductos = 0;
  totalCategorias = 0;
  totalMarcas = 0;
  totalProveedores = 0;
  totalMovimientos = 0;
  stockBajo = 0;
  entradas = 0;
  salidas = 0;
  totalUsuarios = 0;

  // Listas
  productosStockBajo: any[] = [];
  ultimosMovimientos: any[] = [];
  productosPorCategoria: any = {};

  // Usuario actual
  usuario: any = {};

  loading = true;
  fechaActual = new Date();  // <--- AGREGAR AQUÍ
  // Controla si se muestra la alerta
  mostrarAlerta = true;


  // Referencias a los gráficos
  @ViewChild('chartMovimientos') chartMovimientosRef!: ElementRef;
  @ViewChild('chartCategorias') chartCategoriasRef!: ElementRef;
  @ViewChild('chartStock') chartStockRef!: ElementRef;

  private chartMovimientos: any = null;
  private chartCategorias: any = null;
  private chartStock: any = null;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.cargarDashboard();
  }

  ngAfterViewInit() {
    // Los gráficos se crean después de cargar los datos
  }

  cargarDashboard() {
    this.loading = true;
    this.dashboardService.getDashboardData().subscribe({
      next: (data: any) => {
        this.totalProductos = data.totalProductos;
        this.totalCategorias = data.totalCategorias;
        this.totalMarcas = data.totalMarcas;
        this.totalProveedores = data.totalProveedores;
        this.totalMovimientos = data.totalMovimientos;
        this.stockBajo = data.stockBajo;
        this.entradas = data.entradas;
        this.salidas = data.salidas;
        this.totalUsuarios = data.totalUsuarios;
        this.productosStockBajo = data.productosStockBajo;
        // Mostrar alerta solo si existen productos con stock bajo
        this.mostrarAlerta = this.productosStockBajo.length > 0;
        this.ultimosMovimientos = data.ultimosMovimientos;
        this.productosPorCategoria = data.productosPorCategoria;

        this.loading = false;
        this.cdr.detectChanges();

        // Crear gráficos después de que la vista se actualice
        setTimeout(() => {
          this.crearGraficos(data);
        }, 300);
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
        console.error('Error cargando dashboard:', err);
      }
    });
  }

  crearGraficos(data: any) {
    // 1. Gráfico de Movimientos (Barras)
    this.crearGraficoMovimientos(data.meses, data.datosMovimientos);

    // 2. Gráfico de Productos por Categoría (Doughnut)
    this.crearGraficoCategorias(data.productosPorCategoria);

    // 3. Gráfico de Stock (Gauge - usando Doughnut)
    this.crearGraficoStock(data.totalProductos, data.stockBajo);
  }

  crearGraficoMovimientos(meses: string[], datos: number[]) {
    const ctx = this.chartMovimientosRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    if (this.chartMovimientos) {
      this.chartMovimientos.destroy();
    }

    this.chartMovimientos = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: meses,
        datasets: [
          {
            label: 'Movimientos',
            data: datos,
            backgroundColor: 'rgba(26, 35, 126, 0.7)',
            borderColor: 'rgba(26, 35, 126, 1)',
            borderWidth: 2,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return 'Movimientos: ' + context.parsed.y;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  crearGraficoCategorias(productosPorCategoria: any) {
    const ctx = this.chartCategoriasRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    if (this.chartCategorias) {
      this.chartCategorias.destroy();
    }

    const labels = Object.keys(productosPorCategoria);
    const data = Object.values(productosPorCategoria);
    const colores = [
      '#1a237e', '#0d47a1', '#1565c0', '#1976d2', '#1e88e5',
      '#42a5f5', '#64b5f6', '#90caf9', '#bbdefb', '#e3f2fd'
    ];

    this.chartCategorias = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: colores.slice(0, labels.length),
            borderWidth: 2,
            borderColor: '#ffffff'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: {
                size: 11
              },
              padding: 10
            }
          }
        }
      }
    });
  }

  crearGraficoStock(total: number, stockBajo: number) {
    const ctx = this.chartStockRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    if (this.chartStock) {
      this.chartStock.destroy();
    }

    const stockNormal = total - stockBajo;

    this.chartStock = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Stock Normal', 'Stock Bajo'],
        datasets: [
          {
            data: [stockNormal, stockBajo],
            backgroundColor: ['#22c55e', '#ef4444'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 12
              }
            }
          }
        }
      }
    });
  }

  verStockBajo() {
    this.router.navigate(['/productos'], { queryParams: { stockBajo: true } });
  }
  // NUEVO
cerrarAlerta() {
  this.mostrarAlerta = false;
}


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}

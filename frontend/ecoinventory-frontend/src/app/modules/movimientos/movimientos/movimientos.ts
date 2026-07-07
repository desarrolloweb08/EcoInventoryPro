import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.html',
  styleUrls: ['./movimientos.css'],
  standalone: false
})
export class Movimientos implements OnInit {
  movimientos: any[] = [];
  movimientosFiltrados: any[] = [];
  productos: any[] = [];
  categorias: any[] = [];
  marcas: any[] = [];
  tiposMovimiento: any[] = [];
  loading = true;
  usuario: any = {};

  // Filtros
  busqueda: string = '';
  filtroTipo: string = '';
  filtroProductoId: number | null = null;
  filtroCategoriaId: number | null = null;
  filtroMarcaId: number | null = null;
  fechaInicio: string = '';
  fechaFin: string = '';
  filtrosActivos: boolean = false;

  // Estadísticas
  totalEntradas: number = 0;
  totalSalidas: number = 0;
  movimientosHoy: number = 0;

  modalVisible = false;
  movimientoSeleccionado: any = {
    productoId: null,
    tipoMovimientoId: null,
    cantidad: null,
    motivo: '',
    observacion: ''
  };
  formErrors: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.cargarMovimientos();
    this.cargarProductos();
    this.cargarCategorias();
    this.cargarMarcas();
    this.cargarTiposMovimiento();
  }

  cargarMovimientos() {
    this.loading = true;
    this.authService.get('movimientos').subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res && res.success && res.data) {
          this.movimientos = [...res.data];
          this.calcularEstadisticas();
          this.aplicarFiltros();
        } else {
          this.movimientos = [];
          this.movimientosFiltrados = [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.movimientos = [];
        this.movimientosFiltrados = [];
        this.cdr.detectChanges();
        console.error('Error:', err);
        Swal.fire('Error', 'No se pudieron cargar los movimientos', 'error');
      }
    });
  }

  cargarProductos() {
    this.authService.get('productos').subscribe({
      next: (res: any) => {
        if (res && res.success && res.data) {
          this.productos = res.data;
        }
      }
    });
  }

  cargarCategorias() {
    this.authService.get('categorias').subscribe({
      next: (res: any) => {
        if (res && res.success && res.data) {
          this.categorias = res.data;
        }
      }
    });
  }

  cargarMarcas() {
    this.authService.get('marcas').subscribe({
      next: (res: any) => {
        if (res && res.success && res.data) {
          this.marcas = res.data;
        }
      }
    });
  }

  cargarTiposMovimiento() {
    this.authService.get('tipo-movimiento').subscribe({
      next: (res: any) => {
        if (res && res.success && res.data) {
          this.tiposMovimiento = res.data;
        }
      },
      error: () => {
        this.tiposMovimiento = [
          { id: 1, nombre: 'ENTRADA' },
          { id: 2, nombre: 'SALIDA' }
        ];
      }
    });
  }

  calcularEstadisticas() {
    const hoy = new Date().toDateString();
    this.totalEntradas = this.movimientos.filter(m => m.tipoMovimiento === 'ENTRADA').length;
    this.totalSalidas = this.movimientos.filter(m => m.tipoMovimiento === 'SALIDA').length;
    this.movimientosHoy = this.movimientos.filter(m => {
      const fecha = new Date(m.fechaMovimiento);
      return fecha.toDateString() === hoy;
    }).length;
  }

  aplicarFiltros() {
    let filtrados = [...this.movimientos];

    // Búsqueda por producto o código
    if (this.busqueda.trim()) {
      const busq = this.busqueda.trim().toLowerCase();
      filtrados = filtrados.filter(m =>
        m.productoNombre?.toLowerCase().includes(busq) ||
        m.productoCodigo?.toLowerCase().includes(busq)
      );
    }

    // Filtro por tipo
    if (this.filtroTipo) {
      filtrados = filtrados.filter(m => m.tipoMovimiento === this.filtroTipo);
    }

    // Filtro por producto
    if (this.filtroProductoId) {
      filtrados = filtrados.filter(m => m.productoId === this.filtroProductoId);
    }

    // Filtro por categoría
    if (this.filtroCategoriaId) {
      const productosIds = this.productos
        .filter(p => p.categoriaId === this.filtroCategoriaId)
        .map(p => p.id);
      filtrados = filtrados.filter(m => productosIds.includes(m.productoId));
    }

    // Filtro por marca
    if (this.filtroMarcaId) {
      const productosIds = this.productos
        .filter(p => p.marcaId === this.filtroMarcaId)
        .map(p => p.id);
      filtrados = filtrados.filter(m => productosIds.includes(m.productoId));
    }

    // Filtro por fechas
    if (this.fechaInicio) {
      const inicio = new Date(this.fechaInicio);
      inicio.setHours(0, 0, 0, 0);
      filtrados = filtrados.filter(m => {
        const fecha = new Date(m.fechaMovimiento);
        return fecha >= inicio;
      });
    }

    if (this.fechaFin) {
      const fin = new Date(this.fechaFin);
      fin.setHours(23, 59, 59, 999);
      filtrados = filtrados.filter(m => {
        const fecha = new Date(m.fechaMovimiento);
        return fecha <= fin;
      });
    }

    this.movimientosFiltrados = filtrados;
    this.filtrosActivos = !!(
      this.busqueda.trim() || this.filtroTipo ||
      this.filtroProductoId || this.filtroCategoriaId ||
      this.filtroMarcaId || this.fechaInicio || this.fechaFin
    );
    this.cdr.detectChanges();
  }

  contarFiltrosActivos(): number {
    let count = 0;
    if (this.busqueda.trim()) count++;
    if (this.filtroTipo) count++;
    if (this.filtroProductoId) count++;
    if (this.filtroCategoriaId) count++;
    if (this.filtroMarcaId) count++;
    if (this.fechaInicio) count++;
    if (this.fechaFin) count++;
    return count;
  }

  limpiarFiltros() {
    this.busqueda = '';
    this.filtroTipo = '';
    this.filtroProductoId = null;
    this.filtroCategoriaId = null;
    this.filtroMarcaId = null;
    this.fechaInicio = '';
    this.fechaFin = '';
    this.aplicarFiltros();
    this.cdr.detectChanges();
  }

  exportarMovimientos() {
    if (this.movimientosFiltrados.length === 0) {
      Swal.fire('Info', 'No hay movimientos para exportar', 'info');
      return;
    }

    let csv = 'Producto,Código,Categoría,Marca,Tipo,Cantidad,Motivo,Fecha\n';
    this.movimientosFiltrados.forEach((m: any) => {
      csv += `${m.productoNombre || ''},${m.productoCodigo || ''},${m.categoriaNombre || ''},${m.marcaNombre || ''},${m.tipoMovimiento || ''},${m.cantidad || 0},${m.motivo || ''},${new Date(m.fechaMovimiento).toLocaleString()}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `movimientos_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    Swal.fire('Éxito', 'Movimientos exportados correctamente', 'success');
  }

  // ... (resto de métodos sin cambios: abrirModal, cerrarModal, guardarMovimiento, eliminarMovimiento, handleError, verificarStock, logout)


  abrirModal() {
    this.formErrors = [];
    this.movimientoSeleccionado = {
      productoId: null,
      tipoMovimientoId: null,
      cantidad: null,
      motivo: '',
      observacion: ''
    };
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.movimientoSeleccionado = {
      productoId: null,
      tipoMovimientoId: null,
      cantidad: null,
      motivo: '',
      observacion: ''
    };
    this.formErrors = [];
  }

  guardarMovimiento() {
    this.formErrors = [];

    if (!this.movimientoSeleccionado.productoId) {
      this.formErrors.push('Debe seleccionar un producto');
      return;
    }
    if (!this.movimientoSeleccionado.tipoMovimientoId) {
      this.formErrors.push('Debe seleccionar un tipo de movimiento');
      return;
    }
    if (!this.movimientoSeleccionado.cantidad || this.movimientoSeleccionado.cantidad <= 0) {
      this.formErrors.push('La cantidad debe ser mayor a 0');
      return;
    }

    const request = {
      productoId: this.movimientoSeleccionado.productoId,
      tipoMovimientoId: this.movimientoSeleccionado.tipoMovimientoId,
      cantidad: this.movimientoSeleccionado.cantidad,
      motivo: this.movimientoSeleccionado.motivo || '',
      observacion: this.movimientoSeleccionado.observacion || ''
    };

    this.loading = true;
    this.authService.post('movimientos', request).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) {
          Swal.fire('Éxito', 'Movimiento registrado correctamente', 'success');
          this.cerrarModal();
          this.cargarMovimientos();
        } else {
          this.handleError(res);
        }
      },
      error: (err) => {
        this.loading = false;
        this.handleError(err);
      }
    });
  }

  eliminarMovimiento(id: number) {
    Swal.fire({
      title: '¿Eliminar movimiento?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.authService.delete(`movimientos/${id}`).subscribe({
          next: (res: any) => {
            this.loading = false;
            if (res.success) {
              Swal.fire('Eliminado', 'Movimiento eliminado correctamente', 'success');
              this.cargarMovimientos();
            }
          },
          error: () => {
            this.loading = false;
            Swal.fire('Error', 'No se pudo eliminar el movimiento', 'error');
          }
        });
      }
    });
  }

  handleError(err: any) {
    const msg = err.error?.message || 'Ocurrió un error';
    if (msg.includes('stock')) {
      this.formErrors.push('Stock insuficiente para realizar esta salida');
    } else {
      this.formErrors.push(msg);
    }
  }

  verificarStock(productoId: number, cantidad: number, tipoId: number): boolean {
    if (tipoId === 2) {
      const producto = this.productos.find(p => p.id === productoId);
      if (producto && producto.stockActual < cantidad) {
        return false;
      }
    }
    return true;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}
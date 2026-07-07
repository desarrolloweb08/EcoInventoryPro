import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.html',
  styleUrls: ['./categorias.css'],
  standalone: false
})
export class Categorias implements OnInit {
  categorias: any[] = [];
  categoriasFiltradas: any[] = [];
  loading = true;
  usuario: any = {};

  // Filtros
  busqueda: string = '';
  filtrosActivos: boolean = false;

  // Estadísticas
  totalProductos: number = 0;
  categoriasActivas: number = 0;
  categoriasInactivas: number = 0;

  modalVisible = false;
  esEdicion = false;
  categoriaSeleccionada: any = { id: null, nombre: '', descripcion: '' };
  formErrors: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.cargarCategorias();
    this.cargarProductos();
  }

  cargarProductos() {
    this.authService.get('productos').subscribe({
      next: (res: any) => {
        if (res && res.success && res.data) {
          this.totalProductos = res.data.length;
        }
      }
    });
  }

  cargarCategorias() {
    this.loading = true;
    this.authService.get('categorias').subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res && res.success && res.data) {
          this.categorias = [...res.data];
          this.calcularEstadisticas();
          this.aplicarFiltros();
        } else {
          this.categorias = [];
          this.categoriasFiltradas = [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.categorias = [];
        this.categoriasFiltradas = [];
        this.cdr.detectChanges();
        console.error('Error:', err);
        Swal.fire('Error', 'No se pudieron cargar las categorías', 'error');
      }
    });
  }

  calcularEstadisticas() {
    this.categoriasActivas = this.categorias.filter(c => c.estado !== false).length;
    this.categoriasInactivas = this.categorias.filter(c => c.estado === false).length;
  }

  aplicarFiltros() {
    let filtradas = [...this.categorias];

    if (this.busqueda.trim()) {
      const busq = this.busqueda.trim().toLowerCase();
      filtradas = filtradas.filter(c =>
        c.nombre?.toLowerCase().includes(busq) ||
        c.descripcion?.toLowerCase().includes(busq)
      );
    }

    this.categoriasFiltradas = filtradas;
    this.filtrosActivos = !!this.busqueda.trim();
    this.cdr.detectChanges();
  }

  limpiarFiltros() {
    this.busqueda = '';
    this.aplicarFiltros();
  }

  abrirModal(categoria?: any) {
    this.formErrors = [];
    if (categoria) {
      this.esEdicion = true;
      this.categoriaSeleccionada = { ...categoria };
    } else {
      this.esEdicion = false;
      this.categoriaSeleccionada = { id: null, nombre: '', descripcion: '' };
    }
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.categoriaSeleccionada = { id: null, nombre: '', descripcion: '' };
    this.formErrors = [];
  }

  guardarCategoria() {
    this.formErrors = [];

    if (!this.categoriaSeleccionada.nombre?.trim()) {
      this.formErrors.push('El nombre es obligatorio');
      return;
    }

    const request = {
      nombre: this.categoriaSeleccionada.nombre.trim(),
      descripcion: this.categoriaSeleccionada.descripcion || ''
    };

    this.loading = true;

    if (this.esEdicion) {
      this.authService.put(`categorias/${this.categoriaSeleccionada.id}`, request).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.success) {
            Swal.fire('Éxito', 'Categoría actualizada correctamente', 'success');
            this.cerrarModal();
            this.cargarCategorias();
          }
        },
        error: (err) => {
          this.loading = false;
          this.handleError(err);
        }
      });
    } else {
      this.authService.post('categorias', request).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.success) {
            Swal.fire('Éxito', 'Categoría creada correctamente', 'success');
            this.cerrarModal();
            this.cargarCategorias();
          }
        },
        error: (err) => {
          this.loading = false;
          this.handleError(err);
        }
      });
    }
  }

  toggleEstado(categoria: any) {
    const nuevoEstado = categoria.estado === false;
    this.authService.patch(`categorias/${categoria.id}/estado?estado=${nuevoEstado}`, {}).subscribe({
      next: (res: any) => {
        if (res.success) {
          categoria.estado = nuevoEstado;
          this.calcularEstadisticas();
          this.aplicarFiltros();
          Swal.fire('Éxito', `Categoría ${nuevoEstado ? 'activada' : 'desactivada'} correctamente`, 'success');
        }
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cambiar el estado de la categoría', 'error');
      }
    });
  }

  eliminarCategoria(id: number, nombre: string) {
    Swal.fire({
      title: '¿Eliminar categoría?',
      text: `¿Estás seguro de eliminar "${nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.authService.delete(`categorias/${id}`).subscribe({
          next: (res: any) => {
            this.loading = false;
            if (res.success) {
              Swal.fire('Eliminado', 'Categoría eliminada correctamente', 'success');
              this.cargarCategorias();
            }
          },
          error: () => {
            this.loading = false;
            Swal.fire('Error', 'No se pudo eliminar la categoría', 'error');
          }
        });
      }
    });
  }

  handleError(err: any) {
    const msg = err.error?.message || 'Ocurrió un error';
    if (msg.includes('nombre')) {
      this.formErrors.push('Ya existe una categoría con ese nombre');
    } else {
      this.formErrors.push(msg);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-marcas',
  templateUrl: './marcas.html',
  styleUrls: ['./marcas.css'],
  standalone: false
})
export class Marcas implements OnInit {
  marcas: any[] = [];
  marcasFiltradas: any[] = [];
  loading = true;
  usuario: any = {};

  // Filtros
  busqueda: string = '';
  filtrosActivos: boolean = false;

  // Estadísticas
  totalProductos: number = 0;
  marcasActivas: number = 0;
  marcasInactivas: number = 0;

  modalVisible = false;
  esEdicion = false;
  marcaSeleccionada: any = { id: null, nombre: '', descripcion: '' };
  formErrors: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.cargarMarcas();
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

  cargarMarcas() {
    this.loading = true;
    this.authService.get('marcas').subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res && res.success && res.data) {
          this.marcas = [...res.data];
          this.calcularEstadisticas();
          this.aplicarFiltros();
        } else {
          this.marcas = [];
          this.marcasFiltradas = [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.marcas = [];
        this.marcasFiltradas = [];
        this.cdr.detectChanges();
        console.error('Error:', err);
        Swal.fire('Error', 'No se pudieron cargar las marcas', 'error');
      }
    });
  }

  calcularEstadisticas() {
    this.marcasActivas = this.marcas.filter(m => m.estado !== false).length;
    this.marcasInactivas = this.marcas.filter(m => m.estado === false).length;
  }

  aplicarFiltros() {
    let filtradas = [...this.marcas];

    if (this.busqueda.trim()) {
      const busq = this.busqueda.trim().toLowerCase();
      filtradas = filtradas.filter(m =>
        m.nombre?.toLowerCase().includes(busq) ||
        m.descripcion?.toLowerCase().includes(busq)
      );
    }

    this.marcasFiltradas = filtradas;
    this.filtrosActivos = !!this.busqueda.trim();
    this.cdr.detectChanges();
  }

  limpiarFiltros() {
    this.busqueda = '';
    this.aplicarFiltros();
  }

  abrirModal(marca?: any) {
    this.formErrors = [];
    if (marca) {
      this.esEdicion = true;
      this.marcaSeleccionada = { ...marca };
    } else {
      this.esEdicion = false;
      this.marcaSeleccionada = { id: null, nombre: '', descripcion: '' };
    }
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.marcaSeleccionada = { id: null, nombre: '', descripcion: '' };
    this.formErrors = [];
  }

  guardarMarca() {
    this.formErrors = [];

    if (!this.marcaSeleccionada.nombre?.trim()) {
      this.formErrors.push('El nombre es obligatorio');
      return;
    }

    const request = {
      nombre: this.marcaSeleccionada.nombre.trim(),
      descripcion: this.marcaSeleccionada.descripcion || ''
    };

    this.loading = true;

    if (this.esEdicion) {
      this.authService.put(`marcas/${this.marcaSeleccionada.id}`, request).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.success) {
            Swal.fire('Éxito', 'Marca actualizada correctamente', 'success');
            this.cerrarModal();
            this.cargarMarcas();
          }
        },
        error: (err) => {
          this.loading = false;
          this.handleError(err);
        }
      });
    } else {
      this.authService.post('marcas', request).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.success) {
            Swal.fire('Éxito', 'Marca creada correctamente', 'success');
            this.cerrarModal();
            this.cargarMarcas();
          }
        },
        error: (err) => {
          this.loading = false;
          this.handleError(err);
        }
      });
    }
  }

  toggleEstado(marca: any) {
    const nuevoEstado = marca.estado === false;
    this.authService.patch(`marcas/${marca.id}/estado?estado=${nuevoEstado}`, {}).subscribe({
      next: (res: any) => {
        if (res.success) {
          marca.estado = nuevoEstado;
          this.calcularEstadisticas();
          this.aplicarFiltros();
          Swal.fire('Éxito', `Marca ${nuevoEstado ? 'activada' : 'desactivada'} correctamente`, 'success');
        }
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cambiar el estado de la marca', 'error');
      }
    });
  }

  eliminarMarca(id: number, nombre: string) {
    Swal.fire({
      title: '¿Eliminar marca?',
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
        this.authService.delete(`marcas/${id}`).subscribe({
          next: (res: any) => {
            this.loading = false;
            if (res.success) {
              Swal.fire('Eliminado', 'Marca eliminada correctamente', 'success');
              this.cargarMarcas();
            }
          },
          error: () => {
            this.loading = false;
            Swal.fire('Error', 'No se pudo eliminar la marca', 'error');
          }
        });
      }
    });
  }

  handleError(err: any) {
    const msg = err.error?.message || 'Ocurrió un error';
    if (msg.includes('nombre')) {
      this.formErrors.push('Ya existe una marca con ese nombre');
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
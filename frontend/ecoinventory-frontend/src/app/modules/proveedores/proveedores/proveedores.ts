import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.html',
  styleUrls: ['./proveedores.css'],
  standalone: false
})
export class Proveedores implements OnInit {
  proveedores: any[] = [];
  proveedoresFiltrados: any[] = [];
  loading = true;
  usuario: any = {};

  // Filtros
  busqueda: string = '';
  filtroEstado: string = '';
  filtrosActivos: boolean = false;

  // Estadísticas
  proveedoresActivos: number = 0;
  proveedoresInactivos: number = 0;
  totalProductos: number = 0;

  modalVisible = false;
  esEdicion = false;
  proveedorSeleccionado: any = {
    id: null,
    nombre: '',
    ruc: '',
    direccion: '',
    telefono: '',
    correo: '',
    descripcion: ''
  };
  formErrors: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.cargarProveedores();
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

  cargarProveedores() {
    this.loading = true;
    this.authService.get('proveedores').subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res && res.success && res.data) {
          this.proveedores = [...res.data];
          this.calcularEstadisticas();
          this.aplicarFiltros();
        } else {
          this.proveedores = [];
          this.proveedoresFiltrados = [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.proveedores = [];
        this.proveedoresFiltrados = [];
        this.cdr.detectChanges();
        console.error('Error:', err);
        Swal.fire('Error', 'No se pudieron cargar los proveedores', 'error');
      }
    });
  }

  calcularEstadisticas() {
    this.proveedoresActivos = this.proveedores.filter(p => p.estado !== false).length;
    this.proveedoresInactivos = this.proveedores.filter(p => p.estado === false).length;
  }

  aplicarFiltros() {
    let filtrados = [...this.proveedores];

    if (this.busqueda.trim()) {
      const busq = this.busqueda.trim().toLowerCase();
      filtrados = filtrados.filter(p =>
        p.nombre?.toLowerCase().includes(busq) ||
        p.ruc?.toLowerCase().includes(busq) ||
        p.correo?.toLowerCase().includes(busq)
      );
    }

    if (this.filtroEstado === 'activo') {
      filtrados = filtrados.filter(p => p.estado !== false);
    } else if (this.filtroEstado === 'inactivo') {
      filtrados = filtrados.filter(p => p.estado === false);
    }

    this.proveedoresFiltrados = filtrados;
    this.filtrosActivos = !!(this.busqueda.trim() || this.filtroEstado);
    this.cdr.detectChanges();
  }

  limpiarFiltros() {
    this.busqueda = '';
    this.filtroEstado = '';
    this.aplicarFiltros();
  }

  abrirModal(proveedor?: any) {
    this.formErrors = [];
    if (proveedor) {
      this.esEdicion = true;
      this.proveedorSeleccionado = { ...proveedor };
    } else {
      this.esEdicion = false;
      this.proveedorSeleccionado = {
        id: null,
        nombre: '',
        ruc: '',
        direccion: '',
        telefono: '',
        correo: '',
        descripcion: ''
      };
    }
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.proveedorSeleccionado = {
      id: null,
      nombre: '',
      ruc: '',
      direccion: '',
      telefono: '',
      correo: '',
      descripcion: ''
    };
    this.formErrors = [];
  }

  guardarProveedor() {
    this.formErrors = [];

    if (!this.proveedorSeleccionado.nombre?.trim()) {
      this.formErrors.push('El nombre es obligatorio');
      return;
    }

    const ruc = this.proveedorSeleccionado.ruc?.trim() || '';
    if (ruc && !/^\d{11}$/.test(ruc)) {
      this.formErrors.push('El RUC debe tener 11 dígitos numéricos');
      return;
    }

    const request = {
      nombre: this.proveedorSeleccionado.nombre.trim(),
      ruc: this.proveedorSeleccionado.ruc?.trim() || null,
      direccion: this.proveedorSeleccionado.direccion?.trim() || null,
      telefono: this.proveedorSeleccionado.telefono?.trim() || null,
      correo: this.proveedorSeleccionado.correo?.trim() || null,
      descripcion: this.proveedorSeleccionado.descripcion?.trim() || null
    };

    this.loading = true;

    if (this.esEdicion) {
      this.authService.put(`proveedores/${this.proveedorSeleccionado.id}`, request).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.success) {
            Swal.fire('Éxito', 'Proveedor actualizado correctamente', 'success');
            this.cerrarModal();
            this.cargarProveedores();
          }
        },
        error: (err) => {
          this.loading = false;
          this.handleError(err);
        }
      });
    } else {
      this.authService.post('proveedores', request).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.success) {
            Swal.fire('Éxito', 'Proveedor creado correctamente', 'success');
            this.cerrarModal();
            this.cargarProveedores();
          }
        },
        error: (err) => {
          this.loading = false;
          this.handleError(err);
        }
      });
    }
  }

  toggleEstado(proveedor: any) {
    const nuevoEstado = proveedor.estado === false;
    this.authService.patch(`proveedores/${proveedor.id}/estado?estado=${nuevoEstado}`, {}).subscribe({
      next: (res: any) => {
        if (res.success) {
          proveedor.estado = nuevoEstado;
          this.calcularEstadisticas();
          this.aplicarFiltros();
          Swal.fire('Éxito', `Proveedor ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`, 'success');
        }
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cambiar el estado del proveedor', 'error');
      }
    });
  }

  eliminarProveedor(id: number, nombre: string) {
    Swal.fire({
      title: '¿Eliminar proveedor?',
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
        this.authService.delete(`proveedores/${id}`).subscribe({
          next: (res: any) => {
            this.loading = false;
            if (res.success) {
              Swal.fire('Eliminado', 'Proveedor eliminado correctamente', 'success');
              this.cargarProveedores();
            }
          },
          error: () => {
            this.loading = false;
            Swal.fire('Error', 'No se pudo eliminar el proveedor', 'error');
          }
        });
      }
    });
  }

  handleError(err: any) {
    const msg = err.error?.message || 'Ocurrió un error';
    if (msg.includes('nombre')) {
      this.formErrors.push('El nombre es obligatorio o ya existe');
    } else if (msg.includes('RUC')) {
      this.formErrors.push('El RUC ya está registrado');
    } else if (msg.includes('correo') || msg.includes('email')) {
      this.formErrors.push('El correo ya está registrado');
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
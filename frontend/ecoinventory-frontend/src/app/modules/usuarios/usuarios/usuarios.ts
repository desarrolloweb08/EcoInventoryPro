import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Chart, registerables } from 'chart.js';
import Swal from 'sweetalert2';

Chart.register(...registerables);

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css'],
  standalone: false
})
export class Usuarios implements OnInit, AfterViewInit {
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  roles: any[] = [];
  loading = true;
  usuario: any = {};

  // Filtros
  busqueda: string = '';
  filtroRol: string = '';
  filtroEstado: string = '';
  filtrosActivos: boolean = false;

  // Estadísticas
  usuariosActivos: number = 0;
  usuariosInactivos: number = 0;

  // Gráfico
  @ViewChild('chartRoles') chartRolesRef!: ElementRef;
  private chartRoles: any = null;

  modalVisible = false;
  esEdicion = false;
  usuarioSeleccionado: any = {
    id: null,
    nombres: '',
    apellidos: '',
    correo: '',
    username: '',
    password: '',
    rolId: null,
    estado: true
  };
  formErrors: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.cargarUsuarios();
    this.cargarRoles();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.crearGraficoRoles();
    }, 500);
  }

  cargarUsuarios() {
    this.loading = true;
    this.authService.get('usuarios').subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res && res.success && res.data) {
          this.usuarios = [...res.data];
          this.calcularEstadisticas();
          this.aplicarFiltros();
          this.crearGraficoRoles();
        } else {
          this.usuarios = [];
          this.usuariosFiltrados = [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.usuarios = [];
        this.usuariosFiltrados = [];
        this.cdr.detectChanges();
        console.error('Error:', err);
        Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
      }
    });
  }

  cargarRoles() {
    this.authService.get('roles').subscribe({
      next: (res: any) => {
        if (res && res.success && res.data) {
          this.roles = res.data;
        }
      },
      error: () => {
        this.roles = [
          { id: 1, nombre: 'SUPER_ADMIN' },
          { id: 2, nombre: 'ADMIN' },
          { id: 3, nombre: 'USUARIO' }
        ];
      }
    });
  }

  calcularEstadisticas() {
    this.usuariosActivos = this.usuarios.filter(u => u.estado !== false).length;
    this.usuariosInactivos = this.usuarios.filter(u => u.estado === false).length;
  }

  aplicarFiltros() {
    let filtrados = [...this.usuarios];

    if (this.busqueda.trim()) {
      const busq = this.busqueda.trim().toLowerCase();
      filtrados = filtrados.filter(u =>
        u.nombres?.toLowerCase().includes(busq) ||
        u.apellidos?.toLowerCase().includes(busq) ||
        u.username?.toLowerCase().includes(busq) ||
        u.correo?.toLowerCase().includes(busq)
      );
    }

    if (this.filtroRol) {
      filtrados = filtrados.filter(u => u.rol === this.filtroRol);
    }

    if (this.filtroEstado === 'activo') {
      filtrados = filtrados.filter(u => u.estado !== false);
    } else if (this.filtroEstado === 'inactivo') {
      filtrados = filtrados.filter(u => u.estado === false);
    }

    this.usuariosFiltrados = filtrados;
    this.filtrosActivos = !!(this.busqueda.trim() || this.filtroRol || this.filtroEstado);
    this.cdr.detectChanges();
  }

  limpiarFiltros() {
    this.busqueda = '';
    this.filtroRol = '';
    this.filtroEstado = '';
    this.aplicarFiltros();
  }

  crearGraficoRoles() {
    const ctx = this.chartRolesRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    if (this.chartRoles) {
      this.chartRoles.destroy();
    }

    const rolesCount: any = {};
    this.usuarios.forEach((u: any) => {
      const rol = u.rol || 'USUARIO';
      rolesCount[rol] = (rolesCount[rol] || 0) + 1;
    });

    const labels = Object.keys(rolesCount);
    const data = Object.values(rolesCount);
    const colores = [
      '#1a237e', '#0d47a1', '#1565c0', '#1976d2', '#1e88e5'
    ];

    this.chartRoles = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colores.slice(0, labels.length),
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: { size: 12 },
              padding: 15
            }
          }
        }
      }
    });
  }

  getColor(nombre: string): string {
    const colores = ['#1a237e', '#0d47a1', '#1565c0', '#1976d2', '#1e88e5', '#42a5f5'];
    const index = nombre?.length ? nombre.length % colores.length : 0;
    return colores[index];
  }

  abrirModal(usuario?: any) {
    this.formErrors = [];
    if (usuario) {
      this.esEdicion = true;
      this.usuarioSeleccionado = {
        ...usuario,
        password: '',
        rolId: usuario.rolId || this.getRolId(usuario.rol)
      };
    } else {
      this.esEdicion = false;
      this.usuarioSeleccionado = {
        id: null,
        nombres: '',
        apellidos: '',
        correo: '',
        username: '',
        password: '',
        rolId: null,
        estado: true
      };
    }
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.usuarioSeleccionado = {
      id: null,
      nombres: '',
      apellidos: '',
      correo: '',
      username: '',
      password: '',
      rolId: null,
      estado: true
    };
    this.formErrors = [];
  }

  getRolId(rolNombre: string): number | null {
    if (!rolNombre) return null;
    const rol = this.roles.find(r => r.nombre === rolNombre);
    return rol ? rol.id : null;
  }

  guardarUsuario() {
    this.formErrors = [];

    if (!this.usuarioSeleccionado.nombres?.trim()) {
      this.formErrors.push('Los nombres son obligatorios');
      return;
    }
    if (!this.usuarioSeleccionado.apellidos?.trim()) {
      this.formErrors.push('Los apellidos son obligatorios');
      return;
    }
    if (!this.usuarioSeleccionado.correo?.trim()) {
      this.formErrors.push('El correo es obligatorio');
      return;
    }
    if (!this.usuarioSeleccionado.username?.trim()) {
      this.formErrors.push('El username es obligatorio');
      return;
    }
    if (!this.esEdicion && !this.usuarioSeleccionado.password?.trim()) {
      this.formErrors.push('La contraseña es obligatoria');
      return;
    }
    if (!this.usuarioSeleccionado.rolId) {
      this.formErrors.push('Debe seleccionar un rol');
      return;
    }

    const request: any = {
      nombres: this.usuarioSeleccionado.nombres.trim(),
      apellidos: this.usuarioSeleccionado.apellidos.trim(),
      correo: this.usuarioSeleccionado.correo.trim(),
      username: this.usuarioSeleccionado.username.trim(),
      rolId: this.usuarioSeleccionado.rolId
    };

    if (this.usuarioSeleccionado.password?.trim()) {
      request.password = this.usuarioSeleccionado.password.trim();
    }

    this.loading = true;

    if (this.esEdicion) {
      this.authService.put(`usuarios/${this.usuarioSeleccionado.id}`, request).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.success) {
            Swal.fire('Éxito', 'Usuario actualizado correctamente', 'success');
            this.cerrarModal();
            this.cargarUsuarios();
          }
        },
        error: (err) => {
          this.loading = false;
          this.handleError(err);
        }
      });
    } else {
      this.authService.post('usuarios', request).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.success) {
            Swal.fire('Éxito', 'Usuario creado correctamente', 'success');
            this.cerrarModal();
            this.cargarUsuarios();
          }
        },
        error: (err) => {
          this.loading = false;
          this.handleError(err);
        }
      });
    }
  }

  toggleEstado(usuario: any) {
    const nuevoEstado = !usuario.estado;
    this.authService.patch(`usuarios/${usuario.id}/estado?estado=${nuevoEstado}`, {}).subscribe({
      next: (res: any) => {
        if (res.success) {
          usuario.estado = nuevoEstado;
          this.calcularEstadisticas();
          this.aplicarFiltros();
          Swal.fire('Éxito', `Usuario ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`, 'success');
        }
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cambiar el estado del usuario', 'error');
      }
    });
  }

  eliminarUsuario(id: number, nombre: string) {
    Swal.fire({
      title: '¿Eliminar usuario?',
      text: `¿Estás seguro de eliminar a "${nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.authService.delete(`usuarios/${id}`).subscribe({
          next: (res: any) => {
            this.loading = false;
            if (res.success) {
              Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success');
              this.cargarUsuarios();
            }
          },
          error: () => {
            this.loading = false;
            Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
          }
        });
      }
    });
  }

  handleError(err: any) {
    const msg = err.error?.message || 'Ocurrió un error';
    if (msg.includes('username')) {
      this.formErrors.push('El nombre de usuario ya existe');
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
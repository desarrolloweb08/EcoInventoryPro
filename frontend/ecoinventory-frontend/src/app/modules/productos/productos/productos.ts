import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.html',
  styleUrls: ['./productos.css'],
  standalone: false
})
export class Productos implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];
  categorias: any[] = [];
  marcas: any[] = [];
  proveedores: any[] = [];
  loading = true;
  usuario: any = {};

  // Filtros
  busqueda: string = '';
  filtroCategoria: string = '';
  filtroMarca: string = '';
  filtroStock: string = '';
  productosStockBajo: number = 0;
  filtrosActivos: boolean = false;

  modalVisible = false;
  esEdicion = false;
  productoSeleccionado: any = {
    id: null,
    codigo: '',
    nombre: '',
    descripcion: '',
    precioCompra: 0,
    precioVenta: 0,
    stockMinimo: 0,
    categoriaId: null,
    marcaId: null,
    proveedorId: null
  };
  formErrors: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.cargarProductos();
    this.cargarCategorias();
    this.cargarMarcas();
    this.cargarProveedores();
  }

  cargarProductos() {
    this.loading = true;
    this.authService.get('productos').subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res && res.success && res.data) {
          this.productos = [...res.data];
          this.productosStockBajo = this.productos.filter(
            (p: any) => p.stockActual <= p.stockMinimo
          ).length;
          this.aplicarFiltros();
        } else {
          this.productos = [];
          this.productosFiltrados = [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.productos = [];
        this.productosFiltrados = [];
        this.cdr.detectChanges();
        console.error('Error:', err);
        Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
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

  cargarProveedores() {
    this.authService.get('proveedores').subscribe({
      next: (res: any) => {
        if (res && res.success && res.data) {
          this.proveedores = res.data;
        }
      }
    });
  }

  aplicarFiltros() {
    let filtrados = [...this.productos];

    // Búsqueda por código o nombre
    if (this.busqueda.trim()) {
      const busq = this.busqueda.trim().toLowerCase();
      filtrados = filtrados.filter(p =>
        p.codigo?.toLowerCase().includes(busq) ||
        p.nombre?.toLowerCase().includes(busq)
      );
    }

    // Filtro por categoría
    if (this.filtroCategoria) {
      filtrados = filtrados.filter(p => p.categoriaNombre === this.filtroCategoria);
    }

    // Filtro por marca
    if (this.filtroMarca) {
      filtrados = filtrados.filter(p => p.marcaNombre === this.filtroMarca);
    }

    // Filtro por stock
    if (this.filtroStock === 'bajo') {
      filtrados = filtrados.filter(p => p.stockActual <= p.stockMinimo);
    } else if (this.filtroStock === 'normal') {
      filtrados = filtrados.filter(p => p.stockActual > p.stockMinimo);
    }

    this.productosFiltrados = filtrados;
    this.filtrosActivos = !!(this.busqueda || this.filtroCategoria || this.filtroMarca || this.filtroStock);
    this.cdr.detectChanges();
  }

  aplicarFiltroStock(tipo: string) {
    this.filtroStock = this.filtroStock === tipo ? '' : tipo;
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.busqueda = '';
    this.filtroCategoria = '';
    this.filtroMarca = '';
    this.filtroStock = '';
    this.aplicarFiltros();
  }

  abrirModal(producto?: any) {
    this.formErrors = [];
    if (producto) {
      this.esEdicion = true;
      this.productoSeleccionado = { ...producto };
    } else {
      this.esEdicion = false;
      this.productoSeleccionado = {
        id: null,
        codigo: '',
        nombre: '',
        descripcion: '',
        precioCompra: 0,
        precioVenta: 0,
        stockMinimo: 0,
        categoriaId: null,
        marcaId: null,
        proveedorId: null
      };
    }
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.productoSeleccionado = {
      id: null,
      codigo: '',
      nombre: '',
      descripcion: '',
      precioCompra: 0,
      precioVenta: 0,
      stockMinimo: 0,
      categoriaId: null,
      marcaId: null,
      proveedorId: null
    };
    this.formErrors = [];
  }

  guardarProducto() {
    this.formErrors = [];

    if (!this.productoSeleccionado.codigo?.trim()) {
      this.formErrors.push('El código es obligatorio');
      return;
    }
    if (!this.productoSeleccionado.nombre?.trim()) {
      this.formErrors.push('El nombre es obligatorio');
      return;
    }
    if (!this.productoSeleccionado.categoriaId) {
      this.formErrors.push('La categoría es obligatoria');
      return;
    }
    if (!this.productoSeleccionado.marcaId) {
      this.formErrors.push('La marca es obligatoria');
      return;
    }
    if (!this.productoSeleccionado.proveedorId) {
      this.formErrors.push('El proveedor es obligatorio');
      return;
    }

    const request = {
      codigo: this.productoSeleccionado.codigo.trim().toUpperCase(),
      nombre: this.productoSeleccionado.nombre.trim(),
      descripcion: this.productoSeleccionado.descripcion?.trim() || null,
      precioCompra: this.productoSeleccionado.precioCompra || 0,
      precioVenta: this.productoSeleccionado.precioVenta || 0,
      stockMinimo: this.productoSeleccionado.stockMinimo || 0,
      categoriaId: this.productoSeleccionado.categoriaId,
      marcaId: this.productoSeleccionado.marcaId,
      proveedorId: this.productoSeleccionado.proveedorId
    };

    this.loading = true;

    if (this.esEdicion) {
      this.authService.put(`productos/${this.productoSeleccionado.id}`, request).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.success) {
            Swal.fire('Éxito', 'Producto actualizado correctamente', 'success');
            this.cerrarModal();
            this.cargarProductos();
          }
        },
        error: (err) => {
          this.loading = false;
          this.handleError(err);
        }
      });
    } else {
      this.authService.post('productos', request).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.success) {
            Swal.fire('Éxito', 'Producto creado correctamente', 'success');
            this.cerrarModal();
            this.cargarProductos();
          }
        },
        error: (err) => {
          this.loading = false;
          this.handleError(err);
        }
      });
    }
  }

  eliminarProducto(id: number, nombre: string) {
    Swal.fire({
      title: '¿Eliminar producto?',
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
        this.authService.delete(`productos/${id}`).subscribe({
          next: (res: any) => {
            this.loading = false;
            if (res.success) {
              Swal.fire('Eliminado', 'Producto eliminado correctamente', 'success');
              this.cargarProductos();
            }
          },
          error: () => {
            this.loading = false;
            Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
          }
        });
      }
    });
  }

  exportarProductos() {
    if (this.productosFiltrados.length === 0) {
      Swal.fire('Info', 'No hay productos para exportar', 'info');
      return;
    }

    let csv = 'Código,Nombre,Categoría,Marca,Stock,Stock Mínimo,Precio Compra,Precio Venta\n';
    this.productosFiltrados.forEach((p: any) => {
      csv += `${p.codigo},${p.nombre},${p.categoriaNombre || ''},${p.marcaNombre || ''},${p.stockActual || 0},${p.stockMinimo || 0},${p.precioCompra || 0},${p.precioVenta || 0}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `productos_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    Swal.fire('Éxito', 'Productos exportados correctamente', 'success');
  }

  handleError(err: any) {
    const msg = err.error?.message || 'Ocurrió un error';
    if (msg.includes('código') || msg.includes('codigo')) {
      this.formErrors.push('El código ya existe');
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
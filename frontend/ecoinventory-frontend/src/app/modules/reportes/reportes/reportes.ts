import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.css'],
  standalone: false
})
export class Reportes implements OnInit {
  usuario: any = {};
  loading = true;
  fechaActual = new Date();

  // Tipos de reporte
  reportTypes = [
    { value: 'productos', icon: '📦', label: 'Productos' },
    { value: 'categorias', icon: '📂', label: 'Categorías' },
    { value: 'marcas', icon: '🏷️', label: 'Marcas' },
    { value: 'proveedores', icon: '🚚', label: 'Proveedores' },
    { value: 'movimientos', icon: '📊', label: 'Movimientos' },
    { value: 'usuarios', icon: '👤', label: 'Usuarios' },
    { value: 'stock', icon: '⚠️', label: 'Stock Bajo' }
  ];

  selectedReport: string = 'productos';

  // Datos
  productos: any[] = [];
  categorias: any[] = [];
  marcas: any[] = [];
  proveedores: any[] = [];
  movimientos: any[] = [];
  usuarios: any[] = [];
  roles: any[] = [];
  productosStockBajo: any[] = [];

  // Filtros
  fechaInicio: string = '';
  fechaFin: string = '';
  filtroProducto = { categoria: '', marca: '' };
  filtroMovimiento = { tipo: '' };
  filtroProveedor = { busqueda: '' };
  filtroUsuario = { rol: '' };

  // Configuración de columnas
  columnasConfig: any = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.cargarDatos();
    this.inicializarColumnas();
  }

  inicializarColumnas() {
    this.columnasConfig = {
      productos: [
        { key: 'codigo', label: 'Código', checked: true },
        { key: 'nombre', label: 'Nombre', checked: true },
        { key: 'categoriaNombre', label: 'Categoría', checked: true },
        { key: 'marcaNombre', label: 'Marca', checked: true },
        { key: 'stockActual', label: 'Stock', checked: true },
        { key: 'precioVenta', label: 'Precio Venta', checked: false }
      ],
      movimientos: [
        { key: 'productoNombre', label: 'Producto', checked: true },
        { key: 'tipoMovimiento', label: 'Tipo', checked: true },
        { key: 'cantidad', label: 'Cantidad', checked: true },
        { key: 'motivo', label: 'Motivo', checked: true },
        { key: 'usuarioNombre', label: 'Usuario', checked: false },
        { key: 'fechaMovimiento', label: 'Fecha', checked: true }
      ],
      proveedores: [
        { key: 'nombre', label: 'Nombre', checked: true },
        { key: 'ruc', label: 'RUC', checked: true },
        { key: 'telefono', label: 'Teléfono', checked: true },
        { key: 'correo', label: 'Correo', checked: true },
        { key: 'direccion', label: 'Dirección', checked: false }
      ],
      usuarios: [
        { key: 'nombres', label: 'Nombres', checked: true },
        { key: 'apellidos', label: 'Apellidos', checked: true },
        { key: 'username', label: 'Usuario', checked: true },
        { key: 'correo', label: 'Correo', checked: true },
        { key: 'rol', label: 'Rol', checked: true },
        { key: 'estado', label: 'Estado', checked: true }
      ],
      stock: [
        { key: 'codigo', label: 'Código', checked: true },
        { key: 'nombre', label: 'Producto', checked: true },
        { key: 'stockActual', label: 'Stock', checked: true },
        { key: 'stockMinimo', label: 'Mínimo', checked: true }
      ],
      categorias: [
        { key: 'id', label: 'ID', checked: true },
        { key: 'nombre', label: 'Nombre', checked: true },
        { key: 'descripcion', label: 'Descripción', checked: true }
      ],
      marcas: [
        { key: 'id', label: 'ID', checked: true },
        { key: 'nombre', label: 'Nombre', checked: true },
        { key: 'descripcion', label: 'Descripción', checked: true }
      ]
    };
  }

  cargarDatos() {
    this.loading = true;

    this.authService.get('productos').subscribe({
      next: (res: any) => {
        if (res && res.success && res.data) {
          this.productos = [...res.data];
          this.productosStockBajo = this.productos.filter(
            (p: any) => p.stockActual <= p.stockMinimo
          );
        }
        this.cdr.detectChanges();
      }
    });

    this.authService.get('categorias').subscribe({
      next: (res: any) => {
        if (res && res.success && res.data) {
          this.categorias = [...res.data];
        }
        this.cdr.detectChanges();
      }
    });

    this.authService.get('marcas').subscribe({
      next: (res: any) => {
        if (res && res.success && res.data) {
          this.marcas = [...res.data];
        }
        this.cdr.detectChanges();
      }
    });

    this.authService.get('proveedores').subscribe({
      next: (res: any) => {
        if (res && res.success && res.data) {
          this.proveedores = [...res.data];
        }
        this.cdr.detectChanges();
      }
    });

    this.authService.get('movimientos').subscribe({
      next: (res: any) => {
        if (res && res.success && res.data) {
          this.movimientos = [...res.data];
        }
        this.cdr.detectChanges();
      }
    });

    this.authService.get('usuarios').subscribe({
      next: (res: any) => {
        if (res && res.success && res.data) {
          this.usuarios = [...res.data];
        }
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

    this.authService.get('roles').subscribe({
      next: (res: any) => {
        if (res && res.success && res.data) {
          this.roles = [...res.data];
        }
      }
    });
  }

  selectReport(tipo: string) {
    this.selectedReport = tipo;
    this.cdr.detectChanges();
  }

  getCount(tipo: string): number {
    switch(tipo) {
      case 'productos': return this.productos.length;
      case 'categorias': return this.categorias.length;
      case 'marcas': return this.marcas.length;
      case 'proveedores': return this.proveedores.length;
      case 'movimientos': return this.movimientos.length;
      case 'usuarios': return this.usuarios.length;
      case 'stock': return this.productosStockBajo.length;
      default: return 0;
    }
  }

  getColumnasDisponibles(): any[] {
    return this.columnasConfig[this.selectedReport] || [];
  }

  getColumnasVisibles(): any[] {
    return (this.columnasConfig[this.selectedReport] || []).filter((c: any) => c.checked);
  }

  getDatosFiltrados(): any[] {
  let datos: any[] = [];

  switch(this.selectedReport) {
    case 'productos':
      datos = [...this.productos];
      if (this.filtroProducto.categoria) {
        datos = datos.filter(p => p.categoriaNombre === this.filtroProducto.categoria);
      }
      if (this.filtroProducto.marca) {
        datos = datos.filter(p => p.marcaNombre === this.filtroProducto.marca);
      }
      break;

    case 'categorias':
      datos = [...this.categorias];
      break;

    case 'marcas':
      datos = [...this.marcas];
      break;

    case 'proveedores':
      datos = [...this.proveedores];
      if (this.filtroProveedor.busqueda) {
        const busq = this.filtroProveedor.busqueda.toLowerCase();
        datos = datos.filter(p =>
          p.nombre?.toLowerCase().includes(busq) ||
          p.ruc?.toLowerCase().includes(busq) ||
          p.correo?.toLowerCase().includes(busq)
        );
      }
      break;

    case 'movimientos':
      datos = [...this.movimientos];
      if (this.filtroMovimiento.tipo) {
        datos = datos.filter(m => m.tipoMovimiento === this.filtroMovimiento.tipo);
      }
      if (this.fechaInicio && this.fechaFin) {
        const inicio = new Date(this.fechaInicio);
        const fin = new Date(this.fechaFin);
        datos = datos.filter(m => {
          const fecha = new Date(m.fechaMovimiento);
          return fecha >= inicio && fecha <= fin;
        });
      }
      break;

    case 'usuarios':
      datos = [...this.usuarios];
      if (this.filtroUsuario.rol) {
        datos = datos.filter(u => u.rol === this.filtroUsuario.rol);
      }
      break;

    case 'stock':
      datos = [...this.productosStockBajo];
      break;

    default:
      datos = [];
  }

  return datos;
}
  getValor(item: any, key: string): any {
    if (key === 'estado') {
      return item.estado ? '✅ Activo' : '❌ Inactivo';
    }
    if (key === 'precioVenta') {
      return 'S/ ' + (item[key] || 0);
    }
    return item[key] || '-';
  }

  generarReporte() {
    const datos = this.getDatosFiltrados();
    if (datos.length === 0) {
      Swal.fire('Info', 'No hay datos para generar el reporte', 'info');
      return;
    }

    const columnas = this.getColumnasVisibles();
    let html = this.generarHtmlReporte(datos, columnas);
    this.abrirVentanaImpresion(html);
  }

  generarHtmlReporte(datos: any[], columnas: any[]): string {
    const titulos: any = {
      productos: '📦 Reporte de Productos',
      categorias: '📂 Reporte de Categorías',
      marcas: '🏷️ Reporte de Marcas',
      proveedores: '🚚 Reporte de Proveedores',
      movimientos: '📊 Reporte de Movimientos',
      usuarios: '👤 Reporte de Usuarios',
      stock: '⚠️ Reporte de Stock Bajo'
    };

    let html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; max-width: 1200px; margin: 0 auto;">
        <div style="text-align: center; border-bottom: 3px solid #1a237e; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #1a237e; font-size: 28px; margin: 0;">${titulos[this.selectedReport] || 'Reporte'}</h1>
          <p style="color: #666; margin: 8px 0 0 0;">Fecha: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
          <p style="color: #999; font-size: 14px;">Total de registros: ${datos.length}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead>
            <tr style="background: #1a237e; color: white;">
              ${columnas.map(c => `<th style="padding: 12px 16px; text-align: left;">${c.label}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
    `;

    datos.forEach((item: any, index: number) => {
      html += `
        <tr style="${index % 2 === 0 ? 'background: #f8fafc;' : ''} border-bottom: 1px solid #e2e8f0;">
          ${columnas.map(c => `<td style="padding: 10px 16px;">${this.getValor(item, c.key)}</td>`).join('')}
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #999; font-size: 12px;">
          <p>EcoInventory Pro - Reporte generado automáticamente</p>
          <p>© ${new Date().getFullYear()} - Todos los derechos reservados</p>
        </div>
      </div>
    `;
    return html;
  }

  exportarExcel() {
    Swal.fire('Info', 'Funcionalidad en desarrollo', 'info');
  }

  resetFiltros() {
    this.filtroProducto = { categoria: '', marca: '' };
    this.filtroMovimiento = { tipo: '' };
    this.filtroProveedor = { busqueda: '' };
    this.filtroUsuario = { rol: '' };
    this.fechaInicio = '';
    this.fechaFin = '';
    Swal.fire('Éxito', 'Filtros reiniciados', 'success');
  }

  abrirVentanaImpresion(html: string) {
    const ventana = window.open('', '_blank', 'width=1200,height=800');
    if (ventana) {
      ventana.document.write(html);
      ventana.document.close();
      setTimeout(() => ventana.print(), 500);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}
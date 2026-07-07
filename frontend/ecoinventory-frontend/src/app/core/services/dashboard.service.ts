import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private authService: AuthService) {}

  getDashboardData(): Observable<any> {
    return forkJoin({
      productos: this.authService.get('productos'),
      categorias: this.authService.get('categorias'),
      marcas: this.authService.get('marcas'),
      proveedores: this.authService.get('proveedores'),
      movimientos: this.authService.get('movimientos'),
      usuarios: this.authService.get('usuarios')
    }).pipe(
      map((res: any) => {
        const productos = res.productos?.data || [];
        const categorias = res.categorias?.data || [];
        const marcas = res.marcas?.data || [];
        const proveedores = res.proveedores?.data || [];
        const movimientos = res.movimientos?.data || [];
        const usuarios = res.usuarios?.data || [];

        // Productos con stock bajo
        const stockBajo = productos.filter((p: any) => p.stockActual <= p.stockMinimo);

        // Movimientos por tipo
        const entradas = movimientos.filter((m: any) => m.tipoMovimiento === 'ENTRADA');
        const salidas = movimientos.filter((m: any) => m.tipoMovimiento === 'SALIDA');

        // Productos por categoría
        const productosPorCategoria: any = {};
        categorias.forEach((c: any) => {
          productosPorCategoria[c.nombre] = productos.filter((p: any) => p.categoriaNombre === c.nombre).length;
        });

        // Movimientos por mes (últimos 6 meses)
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const movimientosPorMes = new Array(12).fill(0);
        movimientos.forEach((m: any) => {
          if (m.fechaMovimiento) {
            const fecha = new Date(m.fechaMovimiento);
            const mes = fecha.getMonth();
            movimientosPorMes[mes]++;
          }
        });
        const ultimos6Meses = meses.slice(new Date().getMonth() - 5, new Date().getMonth() + 1);
        const datos6Meses = movimientosPorMes.slice(new Date().getMonth() - 5, new Date().getMonth() + 1);

        return {
          totalProductos: productos.length,
          totalCategorias: categorias.length,
          totalMarcas: marcas.length,
          totalProveedores: proveedores.length,
          totalMovimientos: movimientos.length,
          stockBajo: stockBajo.length,
          productosStockBajo: stockBajo,
          ultimosMovimientos: movimientos.slice(0, 5),
          entradas: entradas.length,
          salidas: salidas.length,
          productosPorCategoria,
          meses: ultimos6Meses,
          datosMovimientos: datos6Meses,
          totalUsuarios: usuarios.length
        };
      })
    );
  }
  getStockBajo(): Observable<any> {
  return this.authService.get('productos').pipe(
    map((res: any) => {
      if (res.success) {
        return res.data.filter((p: any) => p.stockActual <= p.stockMinimo);
      }
      return [];
    })
  );
}
}
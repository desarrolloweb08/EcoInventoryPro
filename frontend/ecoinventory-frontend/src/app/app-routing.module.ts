import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './modules/auth/login/login';
import { Dashboard } from './modules/dashboard/dashboard/dashboard';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { 
    path: 'categorias', 
    loadChildren: () => import('./modules/categorias/categorias-module').then(m => m.CategoriasModule)
  },
  { 
    path: 'marcas', 
    loadChildren: () => import('./modules/marcas/marcas-module').then(m => m.MarcasModule)
  },
  { 
    path: 'proveedores', 
    loadChildren: () => import('./modules/proveedores/proveedores-module').then(m => m.ProveedoresModule)
  },
  { 
    path: 'productos', 
    loadChildren: () => import('./modules/productos/productos-module').then(m => m.ProductosModule)
  },
  { 
    path: 'movimientos', 
    loadChildren: () => import('./modules/movimientos/movimientos-module').then(m => m.MovimientosModule)
  },
  {
  path: 'reportes',
  loadChildren: () => import('./modules/reportes/reportes-module').then(m => m.ReportesModule)
},
  { 
    path: 'usuarios', 
    loadChildren: () => import('./modules/usuarios/usuarios-module').then(m => m.UsuariosModule)
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
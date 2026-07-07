import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Productos } from './productos/productos';

const routes: Routes = [
  { path: '', component: Productos }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Categorias } from './categorias/categorias';

const routes: Routes = [
  { path: '', component: Categorias }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriasRoutingModule { }

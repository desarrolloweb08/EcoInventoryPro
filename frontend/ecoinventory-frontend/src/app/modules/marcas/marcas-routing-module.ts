import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Marcas } from './marcas/marcas';

const routes: Routes = [
  { path: '', component: Marcas }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarcasRoutingModule { }
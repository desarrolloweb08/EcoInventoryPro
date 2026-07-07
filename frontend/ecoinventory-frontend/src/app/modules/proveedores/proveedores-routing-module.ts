import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Proveedores } from './proveedores/proveedores';

const routes: Routes = [
  { path: '', component: Proveedores }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProveedoresRoutingModule { }
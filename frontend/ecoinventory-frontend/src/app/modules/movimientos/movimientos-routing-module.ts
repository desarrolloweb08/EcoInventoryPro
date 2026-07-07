import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Movimientos } from './movimientos/movimientos';

const routes: Routes = [
  { path: '', component: Movimientos }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovimientosRoutingModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovimientosRoutingModule } from './movimientos-routing-module';
import { Movimientos } from './movimientos/movimientos';

@NgModule({
  declarations: [Movimientos],
  imports: [CommonModule, FormsModule, MovimientosRoutingModule]
})
export class MovimientosModule { }
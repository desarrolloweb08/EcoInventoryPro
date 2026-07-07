import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosRoutingModule } from './productos-routing-module';
import { Productos } from './productos/productos';

@NgModule({
  declarations: [Productos],
  imports: [CommonModule, FormsModule, ProductosRoutingModule]
})
export class ProductosModule { }
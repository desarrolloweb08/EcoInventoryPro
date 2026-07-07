import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriasRoutingModule } from './categorias-routing-module';
import { Categorias } from './categorias/categorias';

@NgModule({
  declarations: [Categorias],
  imports: [CommonModule, FormsModule, CategoriasRoutingModule]
})
export class CategoriasModule { }

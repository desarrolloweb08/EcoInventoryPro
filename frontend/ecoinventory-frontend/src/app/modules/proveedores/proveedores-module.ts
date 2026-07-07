import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProveedoresRoutingModule } from './proveedores-routing-module';
import { Proveedores } from './proveedores/proveedores';

@NgModule({
  declarations: [Proveedores],
  imports: [CommonModule, FormsModule, ProveedoresRoutingModule]
})
export class ProveedoresModule { }
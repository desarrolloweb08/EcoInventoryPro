import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosRoutingModule } from './usuarios-routing-module';
import { Usuarios } from './usuarios/usuarios';

@NgModule({
  declarations: [Usuarios],
  imports: [CommonModule, FormsModule, UsuariosRoutingModule]
})
export class UsuariosModule { }
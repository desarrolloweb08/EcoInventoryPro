import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarcasRoutingModule } from './marcas-routing-module';
import { Marcas } from './marcas/marcas';  // <--- VERIFICA QUE LA RUTA SEA CORRECTA

@NgModule({
  declarations: [
    Marcas  // <--- EL COMPONENTE DECLARADO
  ],
  imports: [
    CommonModule,
    FormsModule,
    MarcasRoutingModule
  ]
})
export class MarcasModule { }
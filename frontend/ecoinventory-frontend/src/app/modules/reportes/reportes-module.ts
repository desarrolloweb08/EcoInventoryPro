import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportesRoutingModule } from './reportes-routing-module';
import { Reportes } from './reportes/reportes';

@NgModule({
  declarations: [Reportes],
  imports: [CommonModule, FormsModule, ReportesRoutingModule]
})
export class ReportesModule { }
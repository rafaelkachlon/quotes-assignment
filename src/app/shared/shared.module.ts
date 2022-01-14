import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToastModule} from 'primeng/toast';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {FormsModule} from '@angular/forms';
import {DynamicDialogModule} from 'primeng/dynamicdialog';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    ToggleButtonModule,
    DynamicDialogModule
  ],

  exports: [
    FormsModule,
    ToastModule,
    ToggleButtonModule,
    DynamicDialogModule
  ]
})
export class SharedModule {
}

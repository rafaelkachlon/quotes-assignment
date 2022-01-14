import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QuotesComponent} from './quotes/quotes.component';
import {SharedModule} from "../shared/shared.module";
import { CreateQuoteComponent } from './create-quote/create-quote.component';


@NgModule({
  declarations: [
    QuotesComponent,
    CreateQuoteComponent
  ],
  exports: [
    QuotesComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class QuotesModule {
}

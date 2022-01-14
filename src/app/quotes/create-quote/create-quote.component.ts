import {Component} from '@angular/core';
import {QuoteDataSource} from '../models/quote.model';
import {NgForm} from '@angular/forms';
import {DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-create-quote',
  templateUrl: './create-quote.component.html',
  styleUrls: ['./create-quote.component.scss']
})
export class CreateQuoteComponent {

  public quoteSource: typeof QuoteDataSource = QuoteDataSource;
  public content: string = '';
  public source: QuoteDataSource = QuoteDataSource.XML;

  public constructor(private ref: DynamicDialogRef) {
  }

  public submit(form: NgForm) {
    if (form.valid) {
      this.ref.close(form.value);
    }
  }

  public get quoteSources() {
    return Object.values(this.quoteSource);
  }
}

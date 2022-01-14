import {Component, OnInit} from '@angular/core';
import {QuoteDataSource} from '../models/quote.model';
import {NgForm} from '@angular/forms';
import {DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-create-quote',
  templateUrl: './create-quote.component.html',
  styleUrls: ['./create-quote.component.scss']
})
export class CreateQuoteComponent implements OnInit {

  public quoteSource: typeof QuoteDataSource = QuoteDataSource;
  public content: string = '';
  public source: QuoteDataSource = QuoteDataSource.XML;

  public constructor(private ref: DynamicDialogRef) {
  }

  public ngOnInit(): void {
  }

  public submit(form: NgForm) {
    if (form.valid) {
      this.ref.close(form.value);
    }
  }

  public get quoteSources() {
    return Object.keys(this.quoteSource);
  }
}

import {Component, OnInit} from '@angular/core';
import {QuotesService} from '../quotes.service';
import {QuoteModel} from '../models/quote.model';
import {take} from 'rxjs';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {CreateQuoteComponent} from '../create-quote/create-quote.component';
import {DynamicDialogConfig} from 'primeng/dynamicdialog/dynamicdialog-config';

const CreateDialogTitle: string = 'Add a quote';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss'],
  providers: [DialogService]
})
export class QuotesComponent implements OnInit {
  public quotes$ = this.quotesService.filteredQuotes$;

  public constructor(private quotesService: QuotesService,
                     private dialogService: DialogService) {
  }

  public ngOnInit(): void {
    this.quotesService.fetchQuotes();
  }

  public trackByIndex(index: number, _el: any) {
    return index;
  }

  public addNewQuote() {
    const config: DynamicDialogConfig = {header: CreateDialogTitle};
    const dialogRef: DynamicDialogRef = this.dialogService.open(CreateQuoteComponent, config);
    dialogRef.onClose.pipe(take(1))
      .subscribe((quote: QuoteModel) => {
        if (!!quote) {
          this.quotesService.addQuote(quote);
        }
      });
  }
}

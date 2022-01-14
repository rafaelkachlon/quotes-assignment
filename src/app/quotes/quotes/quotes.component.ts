import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {QuotesService} from '../quotes.service';
import {QuoteDataSource, QuoteModel} from '../models/quote.model';
import {Subscription, take} from 'rxjs';
import {FilterModel} from '../../shared/filter.model';
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
export class QuotesComponent implements OnInit, OnDestroy {
  @Input() quoteFilter!: FilterModel;
  public quotes: QuoteModel[] = [];
  public subscription!: Subscription;
  public quoteSource: typeof QuoteDataSource = QuoteDataSource;
  public showAddBtn: boolean = false;

  public constructor(private quotesService: QuotesService,
                     private dialogService: DialogService) {
  }

  public ngOnInit(): void {
    this.subscription = this.quotesService.getQuotes()
      .subscribe(quotes => {
        this.quotes = quotes;
        this.showAddBtn = true;
      });
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
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
          this.quotes.push(quote);
          this.scrollToBottom();
        }
      });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
    }, 400);
  }
}

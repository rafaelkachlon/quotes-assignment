import {Component} from '@angular/core';
import {QuoteDataSource} from '../quotes/models/quote.model';
import {QuotesService} from '../quotes/quotes.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  public showXml: boolean = true;
  public showJson: boolean = true;
  public quoteDataSource: typeof QuoteDataSource = QuoteDataSource;

  public constructor(private quoteService: QuotesService) {
  }

  public changeFilter(source: QuoteDataSource): void {
    this.quoteService.toggleSource(source);
  }
}

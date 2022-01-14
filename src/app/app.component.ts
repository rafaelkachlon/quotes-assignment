import {Component} from '@angular/core';
import {QuoteDataSource} from './quotes/models/quote.model';
import {FilterModel} from './shared/filter.model';
import {FilterEventEmitterModel} from './header/filter-event-emitter.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title = 'quotes-assignment';

  public quoteFilter: FilterModel = {field: 'source', values: [QuoteDataSource.XML, QuoteDataSource.JSON]};

  public onFilterChanged(filter: FilterEventEmitterModel): void {
    this.quoteFilter.values = [];
    if (filter.showXml) {
      this.quoteFilter.values.push(QuoteDataSource.XML);
    }
    if (filter.showJson) {
      this.quoteFilter.values.push(QuoteDataSource.JSON);
    }
  }
}

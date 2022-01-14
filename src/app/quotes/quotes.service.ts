import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, catchError, combineLatest, EMPTY, forkJoin, map, Observable, take, tap} from 'rxjs';
import * as xml2js from 'xml2js';
import {QuoteXmlResponseModel} from './models/quote-xml-response.model';
import {QuoteDataSource, QuoteModel} from './models/quote.model';
import {ParserOptions} from 'xml2js';
import {MessageService} from 'primeng/api';

type ActiveSources = { [key in QuoteDataSource]: boolean }
type QuotesOfSource = { [key in QuoteDataSource]: QuoteModel[] }

@Injectable({
  providedIn: 'root'
})
export class QuotesService {

  private xmlUrlPath: string = './assets/xml_source.xml';
  private jsonUrlPath: string = './assets/json_source.json';
  private filterByJson$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private filterByXml$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  private activeSources$: Observable<ActiveSources> = combineLatest([this.filterByJson$, this.filterByXml$])
    .pipe(map(([filterByJson, filterByXml]) => this.createActiveSources(filterByJson, filterByXml)));

  private jsonQuotes$: BehaviorSubject<QuoteModel[]> = new BehaviorSubject<QuoteModel[]>([]);
  private xmlQuotes$: BehaviorSubject<QuoteModel[]> = new BehaviorSubject<QuoteModel[]>([]);

  public filteredQuotes$: Observable<QuoteModel[]> = combineLatest([this.jsonQuotes$, this.xmlQuotes$, this.activeSources$])
    .pipe(map(([jsonQuotes, xmlQuotes, activeSources]) => {
      const quotes: QuotesOfSource = {
        [QuoteDataSource.JSON]: jsonQuotes,
        [QuoteDataSource.XML]: xmlQuotes
      };
      return this.filterBySource(quotes, activeSources);
    }));

  public constructor(private http: HttpClient,
                     private messageService: MessageService) {
  }

  public fetchQuotes(): void {
    forkJoin([this.getQuotesFromJson(), this.getQuotesFromXml()])
      .pipe(
        take(1),
        tap(([json, xml]) => {
          this.jsonQuotes$.next(json);
          this.xmlQuotes$.next(xml);
          this.sendFetchSucceededMessage();
        })
      ).subscribe();
  }

  public addQuote(quote: QuoteModel): void {
    if (quote.source === QuoteDataSource.JSON) {
      this.jsonQuotes$.next([...this.jsonQuotes$.getValue(), quote]);
    } else {
      this.xmlQuotes$.next([...this.xmlQuotes$.getValue(), quote]);
    }
    this.sendAddItemSucceededMessage();
  }

  public toggleSource(source: QuoteDataSource): void {
    if (source === QuoteDataSource.XML) {
      this.filterByXml$.next(!this.filterByXml$.getValue());
    } else {
      this.filterByJson$.next(!this.filterByJson$.getValue());
    }
  }

  private getQuotesFromXml(): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders();
    headers.append('Accept', 'application/xml');
    return this.http.get(this.xmlUrlPath, {headers, responseType: 'text'}).pipe(
      map((response: string) => this.parseXmlResToJson(response)),
      map((res: QuoteXmlResponseModel) => this.setQuoteSource(res.root?.quote, QuoteDataSource.XML)),
      catchError(() => {
        this.sendFetchErrorMessage();
        return EMPTY;
      })
    );
  }

  private getQuotesFromJson(): Observable<any> {
    return this.http.get<QuoteModel[]>(this.jsonUrlPath)
      .pipe(
        map((res: QuoteModel[]) => this.setQuoteSource(res, QuoteDataSource.JSON)),
        catchError(() => {
          this.sendFetchErrorMessage();
          return EMPTY;
        })
      );
  }

  private setQuoteSource(quotes: QuoteModel[] | undefined, source: QuoteDataSource): QuoteModel[] {
    if (!quotes) {
      throw 'No Quotes!';
    }
    quotes.forEach(quote => quote.source = source);
    return quotes;
  }

  private sendFetchErrorMessage(): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: `Something went wrong, couldn't fetch data.`
    });
  }

  private sendFetchSucceededMessage(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Data fetched successfully'
    });
  }

  private sendAddItemSucceededMessage(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Quote added successfully'
    });
  }

  private parseXmlResToJson(response: string): QuoteXmlResponseModel {
    let jsonObj: QuoteXmlResponseModel = {};
    const options: ParserOptions = {explicitArray: false, trim: true};
    xml2js.parseString(response, options, (err, result) => {
      if (err) {
        throw err;
      }
      jsonObj = result;
    });
    return jsonObj;
  }

  private createActiveSources(filterByJson: boolean, filterByXml: boolean): ActiveSources {
    const sources: ActiveSources = {
      [QuoteDataSource.JSON]: filterByJson,
      [QuoteDataSource.XML]: filterByXml
    };
    return sources;
  }

  private filterBySource(quotes: QuotesOfSource, activeSources: ActiveSources): QuoteModel[] {
    return Object.keys(activeSources).reduce((acc, key) => {
      const castedKey = key as QuoteDataSource;
      if (activeSources[castedKey]) {
        return [...acc, ...quotes[castedKey]] as QuoteModel[];
      }
      return acc;
    }, [] as QuoteModel[]);
  }
}

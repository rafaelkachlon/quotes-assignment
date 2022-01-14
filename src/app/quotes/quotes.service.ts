import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, EMPTY, forkJoin, map, Observable, tap} from 'rxjs';
import * as xml2js from 'xml2js';
import {QuoteXmlResponseModel} from './models/quote-xml-response.model';
import {QuoteDataSource, QuoteModel} from './models/quote.model';
import {ParserOptions} from 'xml2js';
import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {

  private xmlUrlPath: string = './assets/xml_source.xml';
  private jsonUrlPath: string = './assets/json_source.json';

  public constructor(private http: HttpClient,
                     private messageService: MessageService) {
  }

  public getQuotes(): Observable<QuoteModel[]> {
    return forkJoin([this.getQuotesFromJson(), this.getQuotesFromXml()])
      .pipe(
        map((response: [QuoteModel[], QuoteModel[]]) => {
          return [...response[0], ...response[1]];
        }),
        tap(() => this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data fetched successfully'
        }))
      );
  }

  private getQuotesFromXml(): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders();
    headers.append('Accept', 'application/xml');
    return this.http.get(this.xmlUrlPath, {headers, responseType: 'text'}).pipe(
      map((response: string) => this.parseXmlResToJson(response)),
      map((res: QuoteXmlResponseModel) => this.setQuoteSource(res.root?.quote, QuoteDataSource.XML)),
      catchError(() => {
        this.handleError();
        return EMPTY;
      })
    );
  }


  private getQuotesFromJson(): Observable<any> {
    return this.http.get<QuoteModel[]>(this.jsonUrlPath)
      .pipe(
        map((res: QuoteModel[]) => this.setQuoteSource(res, QuoteDataSource.JSON)),
        catchError(() => {
          this.handleError();
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

  private handleError(): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: `Something went wrong, couldn't fetch data.`
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
}

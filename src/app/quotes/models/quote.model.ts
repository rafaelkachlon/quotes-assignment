export interface QuoteModel {
  content: string;
  source?: QuoteDataSource;
}

export enum QuoteDataSource {
  XML = 'xml',
  JSON = 'json'
}

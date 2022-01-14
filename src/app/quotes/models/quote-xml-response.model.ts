import {QuoteModel} from "./quote.model";

export interface QuoteXmlResponseModel {
  root?: QuoteXml;
}

export interface QuoteXml {
  quote: QuoteModel[];
}

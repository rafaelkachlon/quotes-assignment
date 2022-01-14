import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FilterEventEmitterModel} from './filter-event-emitter.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  public showXml: boolean = true;
  public showJson: boolean = true;

  @Output() filterChanged: EventEmitter<FilterEventEmitterModel> = new EventEmitter();

  public constructor() {
  }

  public changeFilter(): void {
    const event: FilterEventEmitterModel = {showJson: this.showJson, showXml: this.showXml};
    this.filterChanged.emit(event);
  }
}

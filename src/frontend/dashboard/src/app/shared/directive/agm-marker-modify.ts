//import { Directive, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
//import { GoogleMapsAPIWrapper, MarkerManager, AgmMarker } from '@agm/core';
import { Directive, Input, AfterViewInit } from '@angular/core';
import { MarkerManager, AgmMarker } from '@agm/core';

@Directive({
  selector: 'agm-marker-modify',
})  

export class AgmMarkerModifyDirective   implements AfterViewInit { 

  @Input() marker : AgmMarker;
  @Input() action: string;
  @Input() markerManager: MarkerManager;  
  
  constructor(
    //private markerManager: MarkerManager
    
  ) { }

  ngAfterViewInit() {
    console.log("AgmMarkerModifyDirective - ngAfterViewInit: ", this.markerManager, this.marker, this.action);
    
  }
}

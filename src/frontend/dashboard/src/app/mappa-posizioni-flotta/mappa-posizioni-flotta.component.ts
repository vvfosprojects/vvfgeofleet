import { ErrorHandler, Component, ElementRef, OnInit, Input } from '@angular/core';
import { PosizioneMezzo } from '../posizione-mezzo/posizione-mezzo.model';
import { GoogleMapsAPIWrapper, MarkerManager } from '@agm/core';
import { AgmMarker, MouseEvent } from '@agm/core';

import { Directive, Output, EventEmitter, AfterViewInit, ContentChildren, QueryList } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'app-mappa-posizioni-flotta',
  templateUrl: './mappa-posizioni-flotta.component.html',
  styleUrls: ['./mappa-posizioni-flotta.component.css'],
  providers: [{ provide: MarkerManager, useClass:MarkerManager}, 
    { provide: GoogleMapsAPIWrapper, useClass:GoogleMapsAPIWrapper}    ,
    { provide: AgmMarker, useClass:AgmMarker}    
    
  ]
})


export class MappaPosizioniFlottaComponent implements OnInit {
  
  @Input() elencoPosizioni : PosizioneMezzo[];
  @Input() istanteUltimoAggiornamento: Date;
  //lat: number = 51.678418;
  //lon: number = 7.809007;
  start_lat: number = 41.889777;
  start_lon: number = 12.490689;
  
  clicked_label: string;

  private iconaStatoMezzoCorrente: any ;
  private iconeStati: any ;
  private mapIcone: any ;
  
  private markerManager: MarkerManager ;
  private markerArrays: AgmMarker[];

  //private markers: AgmMarker;


  //@ContentChildren(AgmMarker) agmMarkerChildren: QueryList<AgmMarker>;
  /*
  constructor( 
    private agmMarker: AgmMarker,
    private markerManager: MarkerManager,  
    private gmapsApi: GoogleMapsAPIWrapper) {   }
    */
  constructor() {}    

  ngOnInit() {

       //['6','http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_orange.png']

       //['1','car.png'],

       this.iconeStati = [
      ['0','http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_black.png'],
      ['1','http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_green.png'],
      ['2','http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_red.png'],
      ['3','http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_blue.png'],
      ['4','http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_orange.png'],
      ['5','http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_yellow.png'],
      ['6','http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_orange.png'],
      ['7','http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_gray.png']
    ]    ;    
    this.mapIcone = new Map(this.iconeStati);    

    //console.log(this.markerManager);
/*
    this.gmapsApi.getNativeMap().then(map => {
      this.markerManager.getNativeMarker(this.agmMarker).then(marker => { console.log(marker);
      });
    });    
*/
  }

  /*
  ngAfterViewInit() {
    console.log(this.markerManager);
  }
  */
  /*
  ngAfterContentChecked() {
    console.log("ngAfterContentChecked - agmMarkerChildren:",this.agmMarkerChildren);
    }
  */
    
/*
  ngOnChanges() {
    console.log('ngOnChanges - elencoPosizioni: ', this.elencoPosizioni );
    
    //this.gmapsApi.getNativeMap().then(map => {
    //  this.markerManager.getNativeMarker(this.agmMarker).then(marker => { console.log(marker);
    //  });
    //});  
    
   }
  */
  markerIconUrl(m: PosizioneMezzo) {
    /*
    if (m.infoSO115 != null) {
      this.iconaStatoMezzoCorrente = this.mapIcone.get(m.infoSO115.stato);
      }
    else
      {this.iconaStatoMezzoCorrente = '0';}
    */
    this.iconaStatoMezzoCorrente = this.mapIcone.get(m.infoSO115.stato);
    return this.iconaStatoMezzoCorrente;
  }

  clickedMarker(label: string, index: number) {
    this.clicked_label = this.elencoPosizioni[index].codiceMezzo;
    console.log('clicked the marker: ' + label + ' ' + index);
  }

  /*
  caricaAgmMarker(m: AgmMarker) { 
    console.log('AgmMarker: ', m);
    this.markerArrays.push(m);
  }
  */
  
  overMarker(mezzo: PosizioneMezzo, index: number) {
    //this.clicked_label = this.elencoPosizioni[index].codiceMezzo;
    console.log('over the marker (b): ' + mezzo);
    console.log('over the marker (c): ' + index);
  }

  setMarkerManager(markerManager: MarkerManager){
    this.markerManager = markerManager;
    console.log("setMarkerManager: ", markerManager);
   }

  /**
   * Imposta l'array dei markers presenti sulla mappa
   */
  setMarkers(markers: AgmMarker[]){
    console.log("AgmMarkers: ", markers);
    this.markerArrays = markers;
    /*
    console.log("NativeMarkers: ");
    for(let marker of markers){
      this.markerManager.getNativeMarker(marker).then(marker => {
        console.log(marker);
      });
    }
    */

  /**
   * Sets the markers, used by spidifier
   */
    /*
    this.markers = markers;
    for(let marker of markers){
      this.markerManager.getNativeMarker(marker).then(marker => {
        this.overlappingMarkerSpidifier.addMarker(marker);
      });
    }
    */
  }
}

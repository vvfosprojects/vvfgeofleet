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

  private elencoPosizioniMostrate : PosizioneMezzo[] = [];
  private elencoPosizioniMostratePrecedenti : PosizioneMezzo[] = [];

  private elencoPosizioniNuove : PosizioneMezzo[] = [];
  private elencoPosizioniEliminate : PosizioneMezzo[] = [];
  private elencoPosizioniModificate : PosizioneMezzo[] = [];


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

  }


  ngOnChanges() {
    

    this.elencoPosizioniNuove = this.elencoPosizioni.
      filter( (item) => {
        var v = this.elencoPosizioniMostratePrecedenti.find( x => item.codiceMezzo == x.codiceMezzo );
        if ( v == null) {return item}
        else {return null}  }
       );

    /*
    console.log('ngOnChanges - elencoPosizioniPrecedenti: ', this.elencoPosizioniPrecedenti );
    console.log('ngOnChanges - elencoPosizioni: ', this.elencoPosizioni );
    console.log('ngOnChanges - elencoPosizioniNuove: ', this.elencoPosizioniNuove );
    */

    //this.gmapsApi.getNativeMap().then(map => {
    //  this.markerManager.getNativeMarker(this.agmMarker).then(marker => { console.log(marker);
    //  });
    //});  
    
    this.elencoPosizioniEliminate = this.elencoPosizioniMostratePrecedenti.
    filter( (item) => {
      var v = this.elencoPosizioni.find( x => item.codiceMezzo == x.codiceMezzo );
      if ( v == null) {return item}
      else {return null}  }
     );

    this.elencoPosizioniEliminate.forEach( v => { 
       var k = this.elencoPosizioniMostrate.indexOf( v );
       if (k != -1) { this.elencoPosizioniMostrate.splice(k,1); 
      }
     })

    this.elencoPosizioniMostrate = this.elencoPosizioniMostrate.concat(this.elencoPosizioniNuove);
    this.elencoPosizioniMostratePrecedenti = this.elencoPosizioniMostrate;
    
  }
    
  markerIconUrl(m: PosizioneMezzo) {
    
    if (m.infoSO115 != null) {
      this.iconaStatoMezzoCorrente = this.mapIcone.get(m.infoSO115.stato);
      }
    else
      {this.iconaStatoMezzoCorrente = '0';}
    
    return this.iconaStatoMezzoCorrente;
  }

  clickedMarker(mezzo: PosizioneMezzo, index: number) {
    //this.clicked_label = this.elencoPosizioniMostrate[index].codiceMezzo;
    this.clicked_label = mezzo.codiceMezzo;
    console.log('clicked the marker: ', mezzo, index);
  }

  overMarker(mezzo: PosizioneMezzo, index: number) {
    console.log('over the marker: ', mezzo, index);
  }

  outOfMarker(mezzo: PosizioneMezzo, index: number) {
    console.log('out of the marker: ', mezzo, index);
  }

  setMarkerManager(markerManager: MarkerManager){
    this.markerManager = markerManager;
    //console.log("setMarkerManager: ", markerManager);
   }

  /**
   * Imposta l'array dei markers presenti sulla mappa
   */
  setMarkers(markers: AgmMarker[]){
    //console.log("AgmMarkers: ", markers);
    this.markerArrays = markers;
    /*
    console.log("NativeMarkers: ");
    for(let marker of markers){
      this.markerManager.getNativeMarker(marker).then(marker => {
        console.log(marker);
      });
    }
    */


  }
}

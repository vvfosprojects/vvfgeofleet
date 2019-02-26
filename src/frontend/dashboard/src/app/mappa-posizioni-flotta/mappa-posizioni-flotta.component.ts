import { ErrorHandler, Component, ElementRef, OnInit, Input } from '@angular/core';
import { PosizioneMezzo } from '../shared/model/posizione-mezzo.model';
import { GoogleMapsAPIWrapper, MarkerManager, LatLngLiteral } from '@agm/core';
import { AgmMarker, MouseEvent } from '@agm/core';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { AgmJsMarkerClustererModule, ClusterManager } from '@agm/js-marker-clusterer';

import { Directive, Output, EventEmitter, AfterViewInit, ContentChildren, QueryList } from '@angular/core';

import * as moment from 'moment';
import { Options } from 'selenium-webdriver/ie';
import { Subject, observable } from 'rxjs';

import { Observable } from "rxjs/Rx";

//import {  } from '@types/google-maps';
import {  } from 'google-maps';
import { MapType } from '@angular/compiler';

import { GoogleMap } from '@agm/core/services/google-maps-types';

declare var google :any;

import { Inject, HostListener } from "@angular/core";
import { DOCUMENT } from "@angular/platform-browser";

@Component({
  selector: 'app-mappa-posizioni-flotta',
  templateUrl: './mappa-posizioni-flotta.component.html',
  styleUrls: ['./mappa-posizioni-flotta.component.css'],
  providers: [{ provide: MarkerManager, useClass:MarkerManager}, 
    { provide: GoogleMapsAPIWrapper, useClass:GoogleMapsAPIWrapper},
    { provide: AgmMarker, useClass:AgmMarker},
    { provide: ClusterManager, useClass:ClusterManager}    
    
  ]
})




export class MappaPosizioniFlottaComponent implements OnInit {

  @Input() elencoPosizioni : PosizioneMezzo[] = [];
  @Input() elencoPosizioniDaElaborare : PosizioneMezzo[] = [];
  @Input() elencoMezziDaSeguire : PosizioneMezzo[] = [];
  
  @Input() istanteUltimoAggiornamento: Date;

  /*
  @Input() filtriStatiMezzo: string[] = [];
  @Input() filtriSedi: string[] = [];
  @Input() filtriGeneriMezzo: string[] = [];
  @Input() filtriDestinazioneUso: string[] = [];
  */

  @Input() filtriStatiMezzoObj: Object;
  @Input() filtriSediObj: Object;
  @Input() filtriGeneriMezzoObj : Object ;
  @Input() filtriDestinazioneUsoObj: Object;
 
  @Input() filtriStatiMezzoCardinalita: number ;
  @Input() filtriSediCardinalita: number ;
  @Input() filtriGeneriMezzoCardinalita: number ;
  @Input() filtriDestinazioneUsoCardinalita: number;

  @Input() mapLat: number ;
  @Input() mapLon: number ;
  @Input() mapZoom: number ;

  @Input() mezzoSelezionato: PosizioneMezzo ;
  @Input() reset: Boolean ;  
  @Input() optOnlyMap: Boolean ;  

  @Output() nuovaSelezioneArea: EventEmitter<LatLngLiteral> = new EventEmitter();
   
  //lat: number = 51.678418;
  //lon: number = 7.809007;
  timeout : any;
  start_lat: number = 41.889777;
  start_lon: number = 12.490689;
  start_zoom: number = 6;
  

  clicked_label: string;

  private iconaStatoMezzoCorrente: any ;
  private iconeStati: any ;
  private mapIcone: any ;
  private iconeStatiSelezionato: any ;
  private mapIconeSelezionato: any ;
  
  private markerManager: MarkerManager ;
  private markerArrays: AgmMarker[] = [];
  private clusterManager: ClusterManager;
  //private markers: AgmMarker;

  public elencoPosizioniMostrate : PosizioneMezzo[] = [];
  private elencoPosizioniMostratePrecedenti : PosizioneMezzo[] = [];

  private elencoPosizioniNuove : PosizioneMezzo[] = [];
  private elencoPosizioniEliminate : PosizioneMezzo[] = [];
  private elencoPosizioniRientrate : PosizioneMezzo[] = [];
  private elencoPosizioniModificate : PosizioneMezzo[] = [];
  private sedeMezzoCorrente : string;

  private areaChangedDebounceTime = new Subject();

  constructor( ) { 

   }    

  
  //public fixed: boolean = false; 
  /*
  constructor(@Inject(DOCUMENT) private doc: Document) {}

  @HostListener("window:scroll", [])
  onWindowScroll() {
     let num = this.doc.body.scrollTop;
     console.log('num: ',num);
  }
  */

  ngOnInit() {


    this.iconeStati = [
      ['0','assets/images/mm_20_black.png'],
      ['1','assets/images/mm_20_red.png'],
      ['2','assets/images/mm_20_blue.png'],
      ['3','assets/images/mm_20_green.png'],
      ['4','assets/images/mm_20_gray.png'],
      ['5','assets/images/mm_20_yellow.png'],
      ['6','assets/images/mm_20_orange.png'],
      ['7','assets/images/mm_20_cyan.png']
    ]    ;    
    this.mapIcone = new Map(this.iconeStati);    

    this.iconeStatiSelezionato = [
      ['0','assets/images/mm_30_black.png'],
      ['1','assets/images/mm_30_red.png'],
      ['2','assets/images/mm_30_blue.png'],
      ['3','assets/images/mm_30_green.png'],
      ['4','assets/images/mm_30_gray.png'],
      ['5','assets/images/mm_30_yellow.png'],
      ['6','assets/images/mm_30_orange.png'],
      ['7','assets/images/mm_30_cyan.png']
    ]    ;    
    this.mapIconeSelezionato = new Map(this.iconeStatiSelezionato);    
    
    if ( this.mapLat == null ) { this.mapLat = this.start_lat; }
    if ( this.mapLon == null ) { this.mapLon = this.start_lon; }
    if ( this.mapZoom == null ) { this.mapZoom = this.start_zoom; }

    /*
    Observable.fromEvent(document, 'boundsChange')
    .debounceTime(3000)
    .subscribe(this.areaChanged);
    */
    /*
    var clicks = Observable.fromEvent(document, 'boundsChange');
    var result = clicks.debounceTime(1000);
    result.subscribe(x => console.log(x));
    */

    this.areaChangedDebounceTime.debounceTime(2000).
      subscribe( evento => this.areaChanged(evento));

    //this.markerManager.addMarker( new AgmMarker())
  }

  mapReady(map) {
    
    null;
    /*
    let position = new google.maps.LatLng( 41.889777, 12.490689);

    var cityCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      center: position,
      radius: 10000
    });
    */
}

  ngOnChanges() {

    // aggiunge alle posizioni Mostrate quelle Nuove     
    //if (this.elencoPosizioniMostrate.length == 0 ) 
    if (this.reset || this.elencoPosizioniMostrate.length == 0 ) 
      { 
        //this.elencoPosizioniMostrate = this.elencoPosizioniNuove;
        this.elencoPosizioniMostrate = this.elencoPosizioni;        
        this.elencoPosizioniMostratePrecedenti = [];
      }
    else 
      { this.elencoPosizioniMostrate = this.elencoPosizioniMostrate.concat(this.elencoPosizioniNuove); }

    //console.log("ngOnChanges()-mezzo Selezionato", this.mezzoSelezionato);
    // individua le posizioni non ancora elaborate
    this.elencoPosizioniNuove = this.elencoPosizioniDaElaborare.
      filter( (item) => {
        var v = this.elencoPosizioniMostratePrecedenti.find( x => item.codiceMezzo == x.codiceMezzo );
        if ( v == null) {
          return item}
        else {return null}  }
       );
      
    // rimuove dalle posizioni da elaborare quelle Nuove
    this.elencoPosizioniNuove.forEach( v => { 
      var k = this.elencoPosizioniDaElaborare.indexOf( v );
      if (k != -1) { this.elencoPosizioniDaElaborare.splice(k,1); 
     }
    })


    /*
    console.log('ngOnChanges - elencoPosizioniPrecedenti: ', this.elencoPosizioniPrecedenti );
    console.log('ngOnChanges - elencoPosizioni: ', this.elencoPosizioni );
    console.log('ngOnChanges - elencoPosizioniNuove: ', this.elencoPosizioniNuove );
    */

    //this.gmapsApi.getNativeMap().then(map => {
    //  this.markerManager.getNativeMarker(this.agmMarker).then(marker => { console.log(marker);
    //  });
    //});  
    
    /*
    // individua le posizioni eliminate estraendo quello non più presenti 
    // nell'elenco aggiornato rispetto a quello precedente
    this.elencoPosizioniEliminate = this.elencoPosizioniMostratePrecedenti.
    filter( (item) => {
      var v = this.elencoPosizioniDaElaborare.find( x => item.codiceMezzo == x.codiceMezzo );
      if ( v == null) {return item}
      else {return null}  }
    );
    */
     /*
    // estra le posizioni dei Mezzi rientrati
    this.elencoPosizioniRientrate = this.elencoPosizioniMostratePrecedenti.
     filter( (item) => {
       var v = this.elencoPosizioniDaElaborare.find( x => item.infoSO115.stato == '4' );
       if ( v != null) {return item}
       else {return null}  }
    );
       
    // aggiunge alle posizioni da eliminare quelle dei Mezzi rientrati
    this.elencoPosizioniEliminate = this.elencoPosizioniEliminate.concat(this.elencoPosizioniRientrate);
    */
    /*
    // rimuove dalle posizioni Mostrate quelle Eliminate
    this.elencoPosizioniEliminate.forEach( v => { 
       var k = this.elencoPosizioniMostrate.indexOf( v );
       if (k != -1) { this.elencoPosizioniMostrate.splice(k,1); 
      }
     })
     */


    // modifica nelle posizioni Mostrate quelle con variazioni
    this.elencoPosizioniDaElaborare.forEach( item => { 
      var v = this.elencoPosizioniMostrate.findIndex( x => item.codiceMezzo === x.codiceMezzo );
      //if ( v != null) {  this.elencoPosizioniMostrate[v] = item; }    
      
      if ( v != null ) {  
        if (item.infoSO115.stato != "0")
          { 
            //console.log("stato ok", this.elencoPosizioniMostrate[v] );
            //this.elencoPosizioniMostrate[v] = item; 
            var vePM = Object.values(this.elencoPosizioniMostrate[v]);
            var vitem = Object.values(item);
            var trovato : boolean = false;
            var ii : number = 0;
            do {
                if ( vePM[ii] != null && vitem[ii] != null 
                  && vePM[ii].toString() != vitem[ii].toString() ) 
                {
                  //console.log("item cambiato", vePM.length, vePM[ii], vitem[ii], this.elencoPosizioniMostrate[v], item );
                  this.elencoPosizioniMostrate[v] = item; 
                  trovato = true;
                }
                ii++;
            } while ( !trovato && ii < vePM.length)

          }
        else
          { //console.log("stato 0", this.elencoPosizioniMostrate[v] );
            //console.log(this.elencoPosizioniMostrate[v].infoSO115.stato );
            this.elencoPosizioniMostrate[v].fonte = item.fonte;
            this.elencoPosizioniMostrate[v].classiMezzo = item.classiMezzo;
            this.elencoPosizioniMostrate[v].istanteAcquisizione = item.istanteAcquisizione;
            this.elencoPosizioniMostrate[v].istanteArchiviazione = item.istanteArchiviazione;
            this.elencoPosizioniMostrate[v].istanteInvio = item.istanteInvio;
            this.elencoPosizioniMostrate[v].localizzazione = item.localizzazione;
            /*
            if ( this.elencoPosizioniMostrate[v].fonte != item.fonte)
              this.elencoPosizioniMostrate[v].fonte = item.fonte;
            if (this.elencoPosizioniMostrate[v].classiMezzo != item.classiMezzo)
              this.elencoPosizioniMostrate[v].classiMezzo = item.classiMezzo;
            if (this.elencoPosizioniMostrate[v].istanteAcquisizione != item.istanteAcquisizione)
              this.elencoPosizioniMostrate[v].istanteAcquisizione = item.istanteAcquisizione;
            if (this.elencoPosizioniMostrate[v].istanteArchiviazione != item.istanteArchiviazione)
              this.elencoPosizioniMostrate[v].istanteArchiviazione = item.istanteArchiviazione;
            if (this.elencoPosizioniMostrate[v].istanteInvio != item.istanteInvio)
              this.elencoPosizioniMostrate[v].istanteInvio = item.istanteInvio;
            if (this.elencoPosizioniMostrate[v].localizzazione != item.localizzazione)
              this.elencoPosizioniMostrate[v].localizzazione = item.localizzazione;
            */
            //console.log(this.elencoPosizioniMostrate[v].infoSO115.stato );
          }
      }    

    } )

    // salva l'elenco delle posizioni Mostrate attualmente
    this.elencoPosizioniMostratePrecedenti = this.elencoPosizioniMostrate;
    
  }
    
  markerIconUrl(m: PosizioneMezzo) {
    //console.log("mezzo Selezionato", this.mezzoSelezionato, "mezzo corrente", m);

    /*
    if (m == this.mezzoSelezionato) {
      this.iconaStatoMezzoCorrente = 'assets/images/car.png'; }
    else
    {
    */ 
    if (m.infoSO115 != null) {
      if ( this.mezzoSelezionato != null && m.codiceMezzo == this.mezzoSelezionato.codiceMezzo) {
          this.iconaStatoMezzoCorrente = this.mapIconeSelezionato.get(m.infoSO115.stato);
        }
      else
        {
          this.iconaStatoMezzoCorrente = this.mapIcone.get(m.infoSO115.stato);  
        }
      }
    else {
      if (this.mezzoSelezionato != null &&  m.codiceMezzo == this.mezzoSelezionato.codiceMezzo) {
      this.iconaStatoMezzoCorrente = this.mapIconeSelezionato.get('0');
        }
      else
        {
          this.iconaStatoMezzoCorrente = this.mapIcone.get('0');          
        }
      }
    return this.iconaStatoMezzoCorrente;
  }

  clickedMarker(mezzo: PosizioneMezzo, index: number) {
    //this.clicked_label = this.elencoPosizioniMostrate[index].codiceMezzo;
    //this.clicked_label = mezzo.codiceMezzo;
    this.mezzoSelezionato.codiceMezzo = mezzo.codiceMezzo;
    this.mapLat = Number(mezzo.localizzazione.lat);
    this.mapLon = Number(mezzo.localizzazione.lon);
    this.mapZoom = 12;    

    //console.log('clicked the marker: ', mezzo, index);
  }

  overMarker(mezzo: PosizioneMezzo, index: number) {
    //console.log('over the marker: ', mezzo, index);
    this.mezzoSelezionato = mezzo;

    //this.sedeMezzo(mezzo);
    //mezzo.sedeMezzo();
    
  }

  outOfMarker(mezzo: PosizioneMezzo, index: number) {
    //console.log('out of the marker: ', mezzo, index);
  }

  setClusterManager(clusterManager: ClusterManager){
    this.clusterManager = clusterManager;
    //console.log("setMarkerManager: ", markerManager);
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


  posizioneMezzoSelezionata(p : PosizioneMezzo) { 
    
      if (p.infoSO115 != null) {
       

        var r : boolean ;
        r = (this.elencoMezziDaSeguire.find( i => i.codiceMezzo === p.codiceMezzo) == null) ? false : true;

        /*
        r = (r? true: this.filtriStatiMezzo.
          some(filtro => filtro === p.infoSO115.stato )
          && 
          this.filtriSedi.
          some(filtro => filtro === p.sedeMezzo )
          && this.filtriGeneriMezzo.
          some(filtro => p.classiMezzo.some( item => item === filtro))
          && this.filtriDestinazioneUso.
          some(filtro =>filtro === p.destinazioneUso )
          );        
        */
        
        r = (r? true: 
              ( (this.filtriStatiMezzoObj[p.infoSO115.stato] == p.infoSO115.stato)
              && 
              (this.filtriSediObj[p.sedeMezzo] == p.sedeMezzo)
              && 
              p.classiMezzoDepurata.
                some( gm => this.filtriGeneriMezzoObj[gm] == gm )
              && 
              this.filtriDestinazioneUsoObj[p.destinazioneUso] == p.destinazioneUso)       
            );
  
        /*
        var r : boolean = 
        (this.filtriStatiMezzo.length === this.filtriStatiMezzoCardinalita||
          this.filtriStatiMezzo.
            some(filtro => filtro === p.infoSO115.stato))
        && 
        (this.filtriSedi.length === this.filtriSediCardinalita||
          this.filtriSedi.
            some(filtro => filtro === p.sedeMezzo))
        && 
        (this.filtriGeneriMezzo.length === this.filtriGeneriMezzoCardinalita||
          this.filtriGeneriMezzo.
            some(filtro => p.classiMezzo[1] === filtro))
        ;
        */


        return r;

        //some(filtro => this.posizioneMezzo.classiMezzo.some( item => item === filtro));

      } 
      else { console.log(p, moment().toString()); 

        return false;      
      }
      
  }

  
  /*
  sedeMezzo(p : PosizioneMezzo) {
    return (p.classiMezzo.
      find( i =>  i.substr(0,5) == "PROV:")).substr(5,2);    
  }
  */

  classiMezzoDepurata(p : PosizioneMezzo) {
    return p.classiMezzo.
      filter( i =>  (i.substr(0,5) != "PROV:") )
  }

  indiceMezzoSelezionato(m: PosizioneMezzo) {
    //console.log("mezzo Selezionato", this.mezzoSelezionato, "mezzo corrente", m);

    /*
    if (m == this.mezzoSelezionato) {
      this.iconaStatoMezzoCorrente = 'assets/images/car.png'; }
    else
    {
    */ 
   if (this.mezzoSelezionato != null && m.codiceMezzo == this.mezzoSelezionato.codiceMezzo) 
      { return 2; } else {return 1; }
  }

  /*
  toolTipText(item : PosizioneMezzo) {
    var testo : String;
    var opzioniDataOra = {};
    //" (" + this.sedeMezzo(item) + ") del " + 
    testo = this.classiMezzoDepurata(item) + " " + item.codiceMezzo +
    " (" + item.sedeMezzo + ") del " + 
    new Date(item.istanteAcquisizione).toLocaleString() + 
    " (da " + item.fonte.classeFonte + ":" + item.fonte.codiceFonte + ")";

    if (item.infoSO115 != null && 
      item.infoSO115.codiceIntervento != null &&
        new Number(item.infoSO115.codiceIntervento) != 0) {
      testo = testo + " - Intervento " + item.infoSO115.codiceIntervento + " del " +
      new Date(item.infoSO115.dataIntervento).toLocaleDateString() ;
    }
    return testo;
  }  
  */

  areaChangedOnMap(e) {
    this.areaChangedDebounceTime.next(e);
  }

  areaChanged(e) {
    //this.timeout = setTimeout("areaChanged();",1000);
    if (this.optOnlyMap) {
      /*
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.nuovaSelezioneArea.emit(e);
        clearTimeout(this.timeout);
      }, 3000);      
      */
    
      this.nuovaSelezioneArea.emit(e);
      console.log("areaChanged",e);

    }
  }
  
}

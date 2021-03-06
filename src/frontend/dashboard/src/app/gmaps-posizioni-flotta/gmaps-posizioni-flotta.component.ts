import { ErrorHandler, Component, ElementRef, OnInit, Input, ViewChild } from '@angular/core';
import { PosizioneMezzo } from '../shared/model/posizione-mezzo.model';

//import {  } from '@types/google-maps';
import {  } from 'google-maps';


import '@google/markerclusterer/src/markerclusterer.js';

//import { google } from '@agm/core/services/google-maps-types';
//import { LatLngLiteral } from '@agm/core';

import { Directive, Output, EventEmitter, AfterViewInit, ContentChildren, QueryList } from '@angular/core';

import * as moment from 'moment';
import { Options } from 'selenium-webdriver/ie';

//declare var google: any;

@Component({
  selector: 'app-gmaps-posizioni-flotta',
  templateUrl: './gmaps-posizioni-flotta.component.html',
  styleUrls: ['./gmaps-posizioni-flotta.component.css']
})
export class GmapsPosizioniFlottaComponent implements OnInit {

  @ViewChild('gmap', {static: true} ) gmapElement: any;
  public map: google.maps.Map;
  public markers: google.maps.Marker[] = [];
  public markersAggiunti: google.maps.Marker[] = [];

  @Input() elencoPosizioni : PosizioneMezzo[] = [];
  @Input() elencoPosizioniDaElaborare : PosizioneMezzo[] = [];
  @Input() elencoMezziDaSeguire : PosizioneMezzo[] = [];
  
  @Input() istanteUltimoAggiornamento: Date;
  @Input() filtriStatiMezzo: string[] = [];
  @Input() filtriSedi: string[] = [];
  @Input() filtriGeneriMezzo: string[] = [];
  @Input() filtriStatiMezzoCardinalita: number ;
  @Input() filtriSediCardinalita: number ;
  @Input() filtriGeneriMezzoCardinalita: number ;

  @Input() mapLat: number ;
  @Input() mapLon: number ;
  @Input() mapZoom: number ;

  @Input() mezzoSelezionato: PosizioneMezzo ;
  @Input() reset: Boolean ;  
  @Input() onlyMap: Boolean ;  

  // da definire 'LatLngLiteral'
  //@Output() nuovaSelezioneArea: EventEmitter<LatLngLiteral> = new EventEmitter();
   
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
  
  public elencoPosizioniMostrate : PosizioneMezzo[] = [];
  private elencoPosizioniMostratePrecedenti : PosizioneMezzo[] = [];

  private elencoPosizioniNuove : PosizioneMezzo[] = [];
  private elencoPosizioniEliminate : PosizioneMezzo[] = [];
  private elencoPosizioniRientrate : PosizioneMezzo[] = [];
  private elencoPosizioniModificate : PosizioneMezzo[] = [];
  private sedeMezzoCorrente : string;
  
  constructor() { 
  } 
  
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

  const mapProp = {
    center: new google.maps.LatLng(this.mapLat, this.mapLon),
    zoom: this.mapZoom,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

  }


  ngOnChanges() {

       
    // aggiunge alle posizioni Mostrate quelle Nuove     
    //if (this.elencoPosizioniMostrate.length == 0 ) 
    if (this.reset || this.elencoPosizioniMostrate.length == 0 ) 
      { 
        //this.elencoPosizioniMostrate = this.elencoPosizioniNuove;
        this.elencoPosizioniMostrate = this.elencoPosizioni;        
        this.elencoPosizioniMostratePrecedenti = [];}
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
    
    this.disegnaMarker(this);
  }
    
  disegnaMarker(tt: GmapsPosizioniFlottaComponent) {
      // The marker, positioned at Uluru
  //var marker = new google.maps.Marker({position: uluru, map: map});

  this.markersAggiunti = this.elencoPosizioniNuove.map(function(Mezzo, i) {
    var latLon = {lat: Number(Mezzo.localizzazione.lat), lng:  Number(Mezzo.localizzazione.lon)};
    var iconaMezzo = tt.markerIconUrl(Mezzo);
    //var vis = tt.posizioneMezzoSelezionata(Mezzo);
    var vis = true;
    var marker : google.maps.Marker = new google.maps.Marker( {
      map: tt.map,
      position: latLon,
      icon: iconaMezzo,
      visible: vis
      });
    Mezzo.marker = marker;
    return marker ;
  });

  if (this.markers.length == 0 ) 
    { this.markers = this.markersAggiunti; }
  else 
    { this.markers = this.markers.concat(this.markersAggiunti); }

  /*
    this.elencoPosizioniMostrate.forEach( item => item.marker.setVisible( 
    tt.posizioneMezzoSelezionata(item)
    ))
  */

/*
  var markerCluster : MarkerClusterer = new MarkerClusterer(this.map, this.markers,
    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

*/
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

  posizioneMezzoSelezionata(p : PosizioneMezzo) { 
      if (p.infoSO115 != null) {
        
        var r : boolean ;
        r = (this.elencoMezziDaSeguire.find( i => i.codiceMezzo === p.codiceMezzo) == null) ? false : true;

        r = (r? true: this.filtriStatiMezzo.
        some(filtro => filtro === p.infoSO115.stato )
        && this.filtriSedi.
        some(filtro => filtro === p.sedeMezzo )
        && this.filtriGeneriMezzo.
        some(filtro => p.classiMezzo.some( item => item === filtro))
        );
        //some(filtro => p.classiMezzo[1] === filtro);
        
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


  classiMezzoDepurata(p : PosizioneMezzo) {
    return p.classiMezzo.
      filter( i =>  (i.substr(0,5) != "PROV:") )
  }

  indiceMezzoSelezionato(m: PosizioneMezzo) {
    //console.log("mezzo Selezionato", this.mezzoSelezionato, "mezzo corrente", m);

   if (this.mezzoSelezionato != null && m.codiceMezzo == this.mezzoSelezionato.codiceMezzo) 
      { return 2; } else {return 1; }
  }


  /*
  areaChanged(e) {
    //this.timeout = setTimeout("areaChanged();",1000);
    if (this.onlyMap) {
      this.nuovaSelezioneArea.emit(e);
      //console.log("areaChanged",e);
    }
  }
  */
  
}

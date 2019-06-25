import { ErrorHandler, Component, ElementRef, OnInit, Input } from '@angular/core';
import { PosizioneMezzo } from '../shared/model/posizione-mezzo.model';
import { GoogleMapsAPIWrapper, MarkerManager, LatLngLiteral } from '@agm/core';
import { AgmMarker, MouseEvent } from '@agm/core';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { AgmJsMarkerClustererModule, ClusterManager } from '@agm/js-marker-clusterer';

import { Directive, Output, EventEmitter, AfterViewInit, ContentChildren, QueryList } from '@angular/core';

import * as moment from 'moment';
import { Options } from 'selenium-webdriver/ie';
import { Subject, Observable } from 'rxjs';

import { ParametriGeoFleetWS } from '../shared/model/parametri-geofleet-ws.model';
import { Opzioni } from '../shared/model/opzioni.model';

import { FlottaDispatcherService } from '../service-dispatcher/flotta-dispatcher.service';
import { GestioneOpzioniService } from '../service-opzioni/gestione-opzioni.service';
import { GestioneParametriService } from '../service-parametri/gestione-parametri.service';

import { GestioneFiltriService } from '../service-filter/gestione-filtri.service';
import { VoceFiltro } from "../filtri/voce-filtro.model";

import { Subscription } from 'rxjs';

//import {  } from '@types/google-maps';
import {  } from 'google-maps';
import { MapType } from '@angular/compiler';

import { GoogleMap } from '@agm/core/services/google-maps-types';

declare var google :any;

import { Inject, HostListener } from "@angular/core";
//import { DOCUMENT } from "@angular/platform-browser";

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

  @Input() elencoMezziDaSeguire : PosizioneMezzo[] = [];
  @Input() mezzoSelezionato: PosizioneMezzo ;
  @Input() onlySelected: boolean ;
    
  public elencoPosizioniMostrate : PosizioneMezzo[] = [];

  private elencoPosizioni : PosizioneMezzo[] = [];


  timeout : any;

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


  private sedeMezzoCorrente : string;

  private areaChangedDebounceTime = new Subject();


  private opzioni: Opzioni;
  private opzioniPrecedenti: Opzioni;


  subscription = new Subscription();
  
  constructor( 
    private flottaDispatcherService: FlottaDispatcherService,
    private gestioneOpzioniService: GestioneOpzioniService,
    private gestioneParametriService: GestioneParametriService,
    private gestioneFiltriService: GestioneFiltriService    
  ) 
  {     

    this.opzioni = new Opzioni();
    this.opzioniPrecedenti = new Opzioni();

    
    // attende una eventuale modifica dei filtri
    this.subscription.add(
      this.gestioneFiltriService.getFiltriIsChanged()
      .subscribe( value => {
          this.elaboraPosizioniMostrate();
        })
      );
    
    /*
    this.subscription.add(
      this.gestioneFiltriService.getFiltriStatiMezzo()
      .subscribe( vocifiltro => {
          //console.log("FlottaDispatcherService, getFiltriStatiMezzo:", vocifiltro);
          this.vociFiltroStatiMezzo = vocifiltro;
        })
      );
    
    this.subscription.add(
      this.gestioneFiltriService.getFiltriSedi()
      .subscribe( vocifiltro => {
          //console.log("FlottaDispatcherService, getFiltriSedi:", vocifiltro);
          this.vociFiltroSedi = vocifiltro;
        })
      );

    this.subscription.add(
      this.gestioneFiltriService.getFiltriGeneriMezzo()
      .subscribe( vocifiltro => {
          //console.log("FlottaDispatcherService, getFiltriGeneriMezzo:", vocifiltro);
          this.vociFiltroGeneriMezzo = vocifiltro;
        })
      );

    this.subscription.add(
      this.gestioneFiltriService.getFiltriDestinazioneUso()
      .subscribe( vocifiltro => {
          //console.log("FlottaDispatcherService, getFiltriDestinazioneUso:", vocifiltro);
          this.vociFiltroDestinazioneUso = vocifiltro;
        })
      );
    */

    this.subscription.add(
      this.gestioneOpzioniService.getOpzioni()
      .subscribe( opt => { this.gestisciModificaOpzioni(opt) })
      );   

    this.subscription.add(
      this.flottaDispatcherService.getReset()
      .subscribe( posizioni => {
          // svuota l'elenco delle posizioni mostrate
          this.elencoPosizioniMostrate = [];
          this.elencoPosizioni = [];
          
        })
      );   
            
    this.subscription.add(
      this.flottaDispatcherService.getNuovePosizioniFlotta()
      .subscribe( posizioni => {
          //console.log("MappaPosizioniFlottaComponent, getNuovePosizioniFlotta - posizioni:", posizioni);
          this.aggiungiNuovePosizioniFlotta(posizioni);
          //this.controllaCentraSuUltimaPosizione();
        })
      );   

    this.subscription.add(
      this.flottaDispatcherService.getPosizioniFlottaStatoModificato()
      .subscribe( posizioni => {
          //console.log("MappaPosizioniFlottaComponent, getPosizioniFlottaStatoModificato - posizioni:", posizioni);
          this.modificaPosizioniFlotta(posizioni);
          //this.controllaCentraSuUltimaPosizione();
        })
      );   

    this.subscription.add(
      this.flottaDispatcherService.getPosizioniFlottaLocalizzazioneModificata()
      .subscribe( posizioni => {
          //console.log("MappaPosizioniFlottaComponent, getPosizioniFlottaLocalizzazioneModificata - posizioni:", posizioni);
          this.modificaPosizioniFlotta(posizioni);
          //this.controllaCentraSuUltimaPosizione();
        })
      );   

    this.gestioneParametriService.resetParametriGeoFleetWS();


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

  
  elaboraPosizioniMostrate() : void{
    this.elencoPosizioniMostrate = this.elencoPosizioni.filter( 
      item => this.posizioneMezzoSelezionata(item));
  }
  

  aggiungiNuovePosizioniFlotta( nuovePosizioniMezzo :PosizioneMezzo[]) {
    var p : PosizioneMezzo[];
    p = nuovePosizioniMezzo.filter(r => r.infoSO115 != null); 
    if (p.length  > 0) 
    {
      // aggiunge alle posizioni Mostrate quelle Nuove     
      this.elencoPosizioni = this.elencoPosizioni.concat(p);      
      /*
      this.elencoPosizioniMostrate = this.elencoPosizioniMostrate.concat(
        nuovePosizioniMezzo.
          filter(item => this.posizioneMezzoSelezionata(item)));
      */
    }
    this.elaboraPosizioniMostrate();
    
  }

  modificaPosizioniFlotta( posizioniMezzoModificate :PosizioneMezzo[]) {
    var p : PosizioneMezzo[];
    p = posizioniMezzoModificate.filter(r => r.infoSO115 != null); 

    // modifica nelle posizioni Mostrate quelle con variazioni
    p.forEach( item => { 
      var v = this.elencoPosizioni.findIndex( x => item.codiceMezzo === x.codiceMezzo );
      //var v = this.elencoPosizioniMostrate.findIndex( x => item.codiceMezzo === x.codiceMezzo );
      //if ( v != null) {  this.elencoPosizioni[v] = item; }    
      
      if ( v != -1 ) {  
        // se la posizione modificata è stata trovata
        if (this.posizioneMezzoSelezionata(this.elencoPosizioni[v]))
        {

          // se la posizione ricevuta ha uno stato 'sconosciuto'
          // modifica solo le informazioni di base, senza modificare quelle relative a SO115 
          // altrimenti modifica tutte le informazioni
          if (item.infoSO115.stato != "0")
            { 
              this.elencoPosizioni[v] = item; 
            }
          else
            { //console.log("stato 0", this.elencoPosizioni[v] );
              //console.log(this.elencoPosizioni[v].infoSO115.stato );
              this.elencoPosizioni[v].toolTipText = item.toolTipText;
              this.elencoPosizioni[v].fonte = item.fonte;
              //this.elencoPosizioni[v].classiMezzo = item.classiMezzo;
              this.elencoPosizioni[v].istanteAcquisizione = item.istanteAcquisizione;
              this.elencoPosizioni[v].istanteArchiviazione = item.istanteArchiviazione;
              this.elencoPosizioni[v].istanteInvio = item.istanteInvio;
              this.elencoPosizioni[v].localizzazione = item.localizzazione;

            }
        }
        /*
        else
        // altrimenti la rimuove
        { this.elencoPosizioniMostrate.slice(v,1); }
        */
      }    

    } )
    this.elaboraPosizioniMostrate();
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
    //this.clicked_label = this.elencoPosizioni[index].codiceMezzo;
    //this.clicked_label = mezzo.codiceMezzo;
    this.mezzoSelezionato.codiceMezzo = mezzo.codiceMezzo;
    this.gestioneOpzioniService.setStartLat(Number(mezzo.localizzazione.lat));
    this.gestioneOpzioniService.setStartLon(Number(mezzo.localizzazione.lon));
    this.gestioneOpzioniService.setStartZoom(12);
    
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


  posizioneMezzoSelezionata(p : PosizioneMezzo) : boolean { 
    // mostra tutti i Mezzi selezionati e Mezzi filtrati dai criteri, se non è attiva
    // l'opzione 'mostra solo i selezionati'

    var r : boolean = false;

    if (p.infoSO115 != null) 
    {
        r = (this.elencoMezziDaSeguire.find( i => i.codiceMezzo === p.codiceMezzo) == null) ? false : true;
        r = (r? true: (!this.onlySelected && this.gestioneFiltriService.posizioneMezzoSelezionata(p)) );
    } 

    return r;
      
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


  areaChangedOnMap(e) {
    this.areaChangedDebounceTime.next(e);
  }

  areaChanged(e) {
    // imposta le coordinate del rettangolo da utilizzare per l'estrazione dei dati
    // se verrà attivata l'opzione dall'utente
    this.gestioneParametriService.setRettangoloRicerca(e);
    if (this.opzioni.getOnlyMap()) {
      // se è stata attivata l'opzione dall'utente ed è cambiato il rettangolo,
      // reimposta il limite temporale con il valore indicato nelle opzioni
      this.gestioneParametriService.setAttSec(this.opzioni.getGgMaxPos()*24*60*60);
    }

  }  

  gestisciModificaOpzioni(opt : Opzioni) {
    //console.log('MappaPosizioniFlottaComponent - gestisciModificaOpzioni', opt, this.opzioni);
    if (this.opzioni != opt) {
      this.opzioniPrecedenti.set(this.opzioni);
      this.opzioni.set(opt);
    }

       
  }

}

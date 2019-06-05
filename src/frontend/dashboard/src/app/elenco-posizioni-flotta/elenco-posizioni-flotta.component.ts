import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PosizioneMezzo } from '../shared/model/posizione-mezzo.model';
import { VoceFiltro } from "../filtri/voce-filtro.model";

//import { UiSwitchModule } from 'angular2-ui-switch';
import { UiSwitchModule } from 'ngx-ui-switch';

import {AccordionModule} from 'primeng/accordion';
import {DropdownModule} from 'primeng/dropdown';
import {SliderModule} from 'primeng/slider';
import { ParametriGeoFleetWS } from '../shared/model/parametri-geofleet-ws.model';
import { FlottaDispatcherService } from '../service-dispatcher/flotta-dispatcher.service';
import { GestioneFiltriService } from '../service-filter/gestione-filtri.service';

import { Subscription } from 'rxjs';

import {DragDropModule} from 'primeng/dragdrop';
import { Timestamp } from 'rxjs/Rx';

import * as moment from 'moment';

@Component({
  selector: 'app-elenco-posizioni-flotta',
  templateUrl: './elenco-posizioni-flotta.component.html',
  styleUrls: ['./elenco-posizioni-flotta.component.css']
})
export class ElencoPosizioniFlottaComponent implements OnInit {

  //@Input() elencoUltimePosizioni : PosizioneMezzo[] = [];
  public elencoUltimePosizioni : PosizioneMezzo[] = [];
  //@Input() istanteUltimoAggiornamento: Date;
  public istanteUltimoAggiornamento: Date;
  //@Input() maxIstanteAcquisizione: Date ;
  /*
  @Input() reset: Boolean ;  

  @Input() startLat: number ;
  @Input() startLon: number ;
  @Input() startZoom: number ;
  */

  public reset : Boolean = false;

  public startLat: number = 41.889777;
  public startLon: number = 12.490689;
  public startZoom: number = 6;
  
  @Input() modalita: number ;
  
  @Output() nuovaSelezioneGgMaxPos: EventEmitter<number> = new EventEmitter();
  @Output() nuovaSelezioneAreaPos: EventEmitter<Object[]> = new EventEmitter();

  @Output() nuovoIstanteUltimoAggiornamento: EventEmitter<Date> = new EventEmitter();
  
  public parametriGeoFleetWS : ParametriGeoFleetWS;

  private geolocationPosition : Position;
  private modalitaPrecedente: number = 0;
  //private maxIstanteAcquisizionePrecedente: Date = new Date("01/01/1900 00:00:00");

  public elencoPosizioni : PosizioneMezzo[] = [];
 // public elencoPosizioniDaElaborare: PosizioneMezzo[] = [];
  public mezzoSelezionato: PosizioneMezzo ;

  public seguiMezziSelezionati : PosizioneMezzo[] = [] ;

  private draggedPosizioneMezzo: PosizioneMezzo;
  /*
  startLat: number = 41.889777;
  startLon: number = 12.490689;
  startZoom: number = 6;
  */

  
  centerOnLast: boolean = true;
  centerOnMezzo: boolean = false;
  isSeguiMezzo: boolean = true;
  onlyMap: boolean = false;

  //ggMaxPos: number = 7;
  ggMaxPos: number = 3;

  /*
  public titoloFiltroStatiMezzo: string = "Stati Mezzo";
  public vociFiltroStatiMezzo: VoceFiltro[] = [
    new VoceFiltro(
      "1", "In viaggio verso l'intervento ", 0, true, "", "badge-info", 
      "assets/images/mm_20_red.png"
    ),
    new VoceFiltro(
      "2", "Arrivato sull'intervento", 0, true, "", "badge-info", 
      "assets/images/mm_20_blue.png"
    ),
    new VoceFiltro(
      "3", "In rientro dall'intervento", 0, true, "", "badge-info", 
      "assets/images/mm_20_green.png"
    ),
    new VoceFiltro(
      "5", "Fuori per motivi di Istituto", 0, false, "", "badge-info", "assets/images/mm_20_yellow.png"
    ),
    new VoceFiltro(
      "0", "Stato operativo Sconosciuto", 0, false, "", "badge-info", "assets/images/mm_20_black.png"
    ),
    // posizione inviata da una radio non associata a nessun Mezzo
    new VoceFiltro(
      "6", "Posizioni Radio senza Mezzo", 0, false, "", "badge-info", "assets/images/mm_20_orange.png"
    ),
    // posizione inviata da un Mezzo fuori servizio  
    new VoceFiltro(
      "7", "Mezzi fuori servizio", 0, false, "","badge-info", "assets/images/mm_20_cyan.png"
    ),
    new VoceFiltro(
      "4", "Mezzi rientrati dall'intervento", 0, false, "", "badge-info", "assets/images/mm_20_gray.png"
    )
    ];

    //vociFiltroStatiMezzoDefault: VoceFiltro[];  
    public filtriStatiMezzo: string[] = [];
    public filtriStatiMezzoObj: Object;
*/

    public titoloFiltroStatiMezzo: string = "Stati Mezzo";
    public vociFiltroStatiMezzo: VoceFiltro[] = [];
    public titoloFiltroSedi: string = "Sedi";
    public vociFiltroSedi: VoceFiltro[] = [];
    public titoloFiltroGeneriMezzo: string = "Generi Mezzo";
    public vociFiltroGeneriMezzo: VoceFiltro[] = [];
    public titoloFiltroDestinazioneUso: string = "Destinazione d'uso";
    public vociFiltroDestinazioneUso: VoceFiltro[] = [];
        

   subscription = new Subscription();
      
    constructor(
      private flottaDispatcherService: FlottaDispatcherService
    )    
    {
    this.seguiMezziSelezionati = [];
   
    this.parametriGeoFleetWS = new ParametriGeoFleetWS();
    this.parametriGeoFleetWS.reset();    


    this.subscription.add(
      this.flottaDispatcherService.getFiltriStatiMezzo()
      //.debounceTime(3000)
      .subscribe( vocifiltro => {
          console.log("ElencoPosizioniFlottaComponent, getFiltriStatiMezzo:", vocifiltro);
          this.vociFiltroStatiMezzo = vocifiltro;
        })
      );   
    
    this.subscription.add(
      this.flottaDispatcherService.getFiltriSedi()
      //.debounceTime(3000)
      .subscribe( vocifiltro => {
          console.log("ElencoPosizioniFlottaComponent, getFiltriSedi:", vocifiltro);
          this.vociFiltroSedi = vocifiltro;
        })
      );   

    this.subscription.add(
      this.flottaDispatcherService.getFiltriGeneriMezzo()
      //.debounceTime(3000)
      .subscribe( vocifiltro => {
          console.log("ElencoPosizioniFlottaComponent, getFiltriGeneriMezzo:", vocifiltro);
          this.vociFiltroGeneriMezzo = vocifiltro;
        })
      );   

    this.subscription.add(
      this.flottaDispatcherService.getFiltriDestinazioneUso()
      //.debounceTime(3000)
      .subscribe( vocifiltro => {
          console.log("ElencoPosizioniFlottaComponent, getFiltriDestinazioneUso:", vocifiltro);
          this.vociFiltroDestinazioneUso = vocifiltro;
        })
      );   


    this.subscription.add(
      this.flottaDispatcherService.getNuovePosizioniFlotta()
      //.debounceTime(3000)
      .subscribe( posizioni => {
          console.log("ElencoPosizioniFlottaComponent, getNuovePosizioniFlotta - posizioni:", posizioni);
          //console.log("posizioneFlottaService.length: ", posizioni.length);
          this.aggiungiNuovePosizioniFlotta(posizioni);
          this.controllaCentraSuUltimaPosizione();
        })
      );   

    this.subscription.add(
      this.flottaDispatcherService.getPosizioniFlottaStatoModificato()
      //.debounceTime(3000)
      .subscribe( posizioni => {
          console.log("ElencoPosizioniFlottaComponent, getPosizioniFlottaStatoModificato - posizioni:", posizioni);
          //console.log("posizioneFlottaService.length: ", posizioni.length);
          this.modificaPosizioniFlotta(posizioni);
          this.controllaCentraSuUltimaPosizione();
        })
      );   
  
    this.subscription.add(
      this.flottaDispatcherService.getPosizioniFlottaLocalizzazioneModificata()
      //.debounceTime(3000)
      .subscribe( posizioni => {
          console.log("ElencoPosizioniFlottaComponent, getPosizioniFlottaLocalizzazioneModificata - posizioni:", posizioni);
          //console.log("posizioneFlottaService.length: ", posizioni.length);
          this.modificaPosizioniFlotta(posizioni);
          this.controllaCentraSuUltimaPosizione();
        })
      );   

    this.subscription.add(
      this.flottaDispatcherService.getIstanteUltimoAggiornamento()
      .subscribe( istante => {
          this.istanteUltimoAggiornamento = istante; 
          console.log("this.istanteUltimoAggiornamento:", this.istanteUltimoAggiornamento);
          this.nuovoIstanteUltimoAggiornamento.emit(this.istanteUltimoAggiornamento);

        })
      );
       
   }    


  
  ngOnInit() {
    null;

  }
  
  
  dragStart(event, pos: PosizioneMezzo) {
    this.draggedPosizioneMezzo = pos;
  }  

  dragEnd(event ) {
    this.draggedPosizioneMezzo = null;
  }  

  seguiMezzoDrop(evento) {
    var tipoevento: string = evento[1];
    var pos : PosizioneMezzo ;

    if ( this.draggedPosizioneMezzo ) {
      //this.seguiMezziSelezionati[0] = evento[0];
      pos = this.seguiMezziSelezionati.find( i => i.codiceMezzo ===  
        this.draggedPosizioneMezzo.codiceMezzo);
      if (pos == null) {
        this.seguiMezziSelezionati = this.seguiMezziSelezionati.
          concat(this.draggedPosizioneMezzo);
        this.draggedPosizioneMezzo = null;
      }

      this.centerOnMezzo = true;
    }
    //console.log("seguiMezzo", evento);
  }

  seguiMezzo(evento) {
    var tipoevento: string = evento[1];
    var pos : PosizioneMezzo ;

    if (tipoevento == "dblclick") {
      //this.seguiMezziSelezionati[0] = evento[0];
      pos = this.seguiMezziSelezionati.find( i => i.codiceMezzo === evento[0].codiceMezzo);
      if (pos == null) {
        this.seguiMezziSelezionati = this.seguiMezziSelezionati.concat(evento[0]);        
      }

      this.centerOnMezzo = true;
    }
    //console.log("seguiMezzo", evento);
  }

  rimuoviSeguiMezzo(evento) {
    var tipoevento: string = evento[1];
    var pos : PosizioneMezzo ;
    
    if (tipoevento == "dblclick") {
      //this.seguiMezziSelezionati = [];
      //pos = this.seguiMezziSelezionati.find( i => i.codiceMezzo === evento[0].codiceMezzo);
      let i = this.seguiMezziSelezionati.indexOf( evento[0]);
      this.seguiMezziSelezionati.splice(i,1);

      if (this.seguiMezziSelezionati.length == 0 ) {
        this.centerOnMezzo = false;
      }
    }
    //console.log("rimuoviSeguiMezzo", evento);
  }

  rimuoviSeguiMezzoDrop(evento) {
    var tipoevento: string = evento[1];
    var pos : PosizioneMezzo ;
    
    if ( this.draggedPosizioneMezzo ) {
      //this.seguiMezziSelezionati = [];
      //pos = this.seguiMezziSelezionati.find( i => i.codiceMezzo === evento[0].codiceMezzo);
      let i = this.seguiMezziSelezionati.indexOf( this.draggedPosizioneMezzo);
      this.seguiMezziSelezionati.splice(i,1);

      if (this.seguiMezziSelezionati.length == 0 ) {
        this.centerOnMezzo = false;
      }
    }
    //console.log("rimuoviSeguiMezzo", evento);
  }

  testModalitaCambiata () {
    if (this.modalita != this.modalitaPrecedente) {
      this.cambiaModalita ();
    }
    else { 
      this.reset = false; 
    }
  }

  cambiaModalita () {
    //console.log(this.modalita, this.modalitaPrecedente);
    //if (this.modalita != this.modalitaPrecedente) {
      this.modalitaPrecedente = this.modalita;
      if (window.navigator && window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
            position => {
                this.geolocationPosition = position;
                //console.log(position);                
                this.startLat = this.geolocationPosition.coords.latitude;
                this.startLon = this.geolocationPosition.coords.longitude;
            },
            error => {
                switch (error.code) {
                    case 1:
                        console.log('Permission Denied');
                        break;
                    case 2:
                        console.log('Position Unavailable');
                        break;
                    case 3:
                        console.log('Timeout');
                        break;
                }
            }
        );
      //};
  
      switch (this.modalita ) {
        // Modalità Comando
        case 1:
        {
          if (this.vociFiltroStatiMezzo.length > 0) {
            this.vociFiltroStatiMezzo.find( item => item.codice == "1").selezionato = true;
            this.vociFiltroStatiMezzo.find( item => item.codice == "2").selezionato = true;
            this.vociFiltroStatiMezzo.find( item => item.codice == "3").selezionato = true;
            this.vociFiltroStatiMezzo.find( item => item.codice == "5").selezionato = true;
            this.vociFiltroStatiMezzo.find( item => item.codice == "0").selezionato = true;
            this.vociFiltroStatiMezzo.find( item => item.codice == "6").selezionato = true;
            this.vociFiltroStatiMezzo.find( item => item.codice == "7").selezionato = false;
            this.vociFiltroStatiMezzo.find( item => item.codice == "4").selezionato = false;
            this.startZoom = 10;        
            this.onlyMap = true;   
            this.reset = true;
          }
          //this.nuovaSelezioneAreaPos.emit(e);
          break;     
        }
        // Modalità Direzione Regionale
        case 2:
        {
          if (this.vociFiltroStatiMezzo.length > 0) {
            this.vociFiltroStatiMezzo.find( item => item.codice == "1").selezionato = true;
            this.vociFiltroStatiMezzo.find( item => item.codice == "2").selezionato = true;
            this.vociFiltroStatiMezzo.find( item => item.codice == "3").selezionato = true;
            this.vociFiltroStatiMezzo.find( item => item.codice == "5").selezionato = true;
            this.vociFiltroStatiMezzo.find( item => item.codice == "0").selezionato = true;
            this.vociFiltroStatiMezzo.find( item => item.codice == "6").selezionato = true;
            this.vociFiltroStatiMezzo.find( item => item.codice == "7").selezionato = false;
            this.vociFiltroStatiMezzo.find( item => item.codice == "4").selezionato = false;
            this.startZoom = 8;                
            this.onlyMap = true;  
            this.reset = true;
          }
          //this.nuovaSelezioneAreaPos.emit(e);
          break;                     
        }
        // Modalità CON
        case 3:
        {
          if (this.vociFiltroStatiMezzo.length > 0) {
            this.vociFiltroStatiMezzo.find( item => item.codice == "1").selezionato = true;
            this.vociFiltroStatiMezzo.find( item => item.codice == "2").selezionato = true;
            this.vociFiltroStatiMezzo.find( item => item.codice == "3").selezionato = true;
            this.vociFiltroStatiMezzo.find( item => item.codice == "5").selezionato = false;
            this.vociFiltroStatiMezzo.find( item => item.codice == "0").selezionato = false;
            this.vociFiltroStatiMezzo.find( item => item.codice == "6").selezionato = false;
            this.vociFiltroStatiMezzo.find( item => item.codice == "7").selezionato = false;
            this.vociFiltroStatiMezzo.find( item => item.codice == "4").selezionato = false;
            this.startZoom = 6;                
            this.onlyMap = false;        
            this.reset = true;
            
            //this.nuovaSelezioneGgMaxPos.emit(this.ggMaxPos);            
            this.aggiornaAttSec(this.ggMaxPos);
          }
          break;               
        }
      }
    }
  }

  aggiungiNuovePosizioniFlotta( nuovePosizioniMezzo :PosizioneMezzo[]) {
    this.testModalitaCambiata();
    var p : PosizioneMezzo[];
    p = nuovePosizioniMezzo.filter(r => r.infoSO115 != null); 
    if (p.length  > 0) 
    {
      // aggiunge le nuove posizioni a quelle visualizzate nella pagina HTML
      this.elencoPosizioni = this.elencoPosizioni.concat(p);

      // riordina l'array elencoPosizioni per istanteAcquisizione discendente
      this.elencoPosizioni = this.elencoPosizioni.sort( 
        function(a,b) 
        { var bb : Date = new Date(b.istanteAcquisizione);
          var aa : Date  = new Date(a.istanteAcquisizione);
          return aa>bb ? -1 : aa<bb ? 1 : 0;
        });

      // ordina l'array nuovePosizioniMezzo per istanteAcquisizione ascendente
      nuovePosizioniMezzo = nuovePosizioniMezzo.sort( 
        function(a,b) 
        { var bb : Date = new Date(b.istanteAcquisizione);
          var aa : Date  = new Date(a.istanteAcquisizione);
          return aa>bb ? 1 : aa<bb ? -1 : 0;
        });

      // controlla se la posizione ricevuta è relativa ad un Mezzo da seguire
      nuovePosizioniMezzo.forEach( i => this.controllaMezzoDaSeguire(i));

      // riordina l'array seguiMezziSelezionati per istanteAcquisizione discendente
      this.seguiMezziSelezionati = this.seguiMezziSelezionati.sort( 
        function(a,b) 
        { var bb : Date = new Date(b.istanteAcquisizione);
          var aa : Date  = new Date(a.istanteAcquisizione);
          return aa>bb ? -1 : aa<bb ? 1 : 0;
        });

      // 

    }

  }

  modificaPosizioniFlotta( posizioniMezzoModificate :PosizioneMezzo[]) {
    this.testModalitaCambiata();
    var p : PosizioneMezzo[];
    p = posizioniMezzoModificate.filter(r => r.infoSO115 != null); 

    // ordina l'array posizioniMezzoModificate per istanteAcquisizione ascendente
    p = p.sort( 
      function(a,b) 
      { var bb : Date = new Date(b.istanteAcquisizione);
        var aa : Date  = new Date(a.istanteAcquisizione);
        return aa>bb ? 1 : aa<bb ? -1 : 0;
      });
      
    
    // modifica nelle posizioni Mostrate quelle con variazioni
    p.forEach( item => { 
      var v = this.elencoPosizioni.findIndex( x => item.codiceMezzo === x.codiceMezzo );
      if ( v != null) {  
        // se la posizione ricevuta ha uno stato 'sconosciuto'
        // modifica solo le informazioni di base, senza modificare quelle relative a SO115 
        // altrimenti modifica tutte le informazioni
        if (item.infoSO115.stato != "0")
          { this.elencoPosizioni[v] = item; }
        else
          { this.elencoPosizioni[v].fonte = item.fonte;
            //this.elencoPosizioni[v].classiMezzo = item.classiMezzo;
            this.elencoPosizioni[v].istanteAcquisizione = item.istanteAcquisizione;
            this.elencoPosizioni[v].istanteArchiviazione = item.istanteArchiviazione;
            this.elencoPosizioni[v].istanteInvio = item.istanteInvio;
            this.elencoPosizioni[v].localizzazione = item.localizzazione;
          }

        // controlla se la posizione ricevuta è relativa ad un Mezzo da seguire
        this.controllaMezzoDaSeguire(this.elencoPosizioni[v]);
      }    


    } )
     
    if (p.length  > 0) 
    {
      // riordina l'array elencoPosizioni per istanteAcquisizione discendente
      this.elencoPosizioni = this.elencoPosizioni.sort( 
        function(a,b) 
        { var bb : Date = new Date(b.istanteAcquisizione);
          var aa : Date  = new Date(a.istanteAcquisizione);
          return aa>bb ? -1 : aa<bb ? 1 : 0;
        });
      // riordina l'array seguiMezziSelezionati per istanteAcquisizione discendente
      this.seguiMezziSelezionati = this.seguiMezziSelezionati.sort( 
        function(a,b) 
        { var bb : Date = new Date(b.istanteAcquisizione);
          var aa : Date  = new Date(a.istanteAcquisizione);
          return aa>bb ? -1 : aa<bb ? 1 : 0;
        });
      
    }
        
  }
  


 
  controllaMezzoDaSeguire(p: PosizioneMezzo) {
    var v = this.seguiMezziSelezionati.findIndex(item => item.codiceMezzo == p.codiceMezzo);
    if (v != -1) 
      { 
        // modifica anche la posizione tra i Mezzi da seguire se è presente
        this.seguiMezziSelezionati[v] = p; 
        // se è attivo il flag di Ricentra sull'ultima posizione ricevuta da un Mezzo
        if (this.centerOnMezzo ) {
          this.mezzoSelezionato = p;
          this.startLat = Number(this.mezzoSelezionato.localizzazione.lat);
          this.startLon = Number(this.mezzoSelezionato.localizzazione.lon);
          this.startZoom = 12;
        }


    }
  }

  controllaCentraSuUltimaPosizione() {
    if (!this.centerOnMezzo && 
      (this.mezzoSelezionato == null || this.centerOnLast) ) 
    {
      this.mezzoSelezionato = this.elencoPosizioni[0];
    }
  }

  nuovaSelezioneStatiMezzo(event) {
    //console.log('event: ', event);
    //this.filtriStatiMezzo = event;
    this.flottaDispatcherService.putVisibleStatiMezzo(event);    
  } 
  
  nuovaSelezioneSedi(event) {
    //console.log('event: ', event);
    //this.filtriSedi = event;
    this.flottaDispatcherService.putVisibleSedi(event);

  }

  nuovaSelezioneGeneriMezzo(event) {
    //console.log('event: ', event);
    //this.filtriGeneriMezzo = event;
    this.flottaDispatcherService.putVisibleGeneriMezzo(event);
  }
  
  nuovaSelezioneDestinazioneUso(event) {
    //console.log('event: ', event);
    //this.filtriDestinazioneUso = event;
    this.flottaDispatcherService.putVisibleDestinazioneUso(event);
  }
  
  centraSuMappa(evento) {
    var tipoevento: string = evento[1];
    if (tipoevento == "click") {
      this.mezzoSelezionato = evento[0];
      this.startLat = Number(this.mezzoSelezionato.localizzazione.lat);
      this.startLon = Number(this.mezzoSelezionato.localizzazione.lon);
      this.startZoom = 12;
    }
    //console.log("centraSuMappa", this.mezzoSelezionato);
  }

  evidenziaSuMappa(evento) {
    var tipoevento: string = evento[1];
    if (tipoevento == "mouseover") {
      this.mezzoSelezionato = evento[0];
    }
    //console.log("centraSuMappa", this.mezzoSelezionato);
  }

  changeOptSeguiMezzo() {
    if (!this.centerOnMezzo) {
      this.seguiMezziSelezionati[0] = this.elencoPosizioni [0];}
    else {
      this.seguiMezziSelezionati = []; }
  }

  changeOptOnlyMap(e) {
    if (!this.onlyMap && e != '-') 
      //this.nuovaSelezioneAreaPos.emit(e)
      this.aggiornaArea(e)
    else
    //this.nuovaSelezioneGgMaxPos.emit(this.ggMaxPos);
      this.aggiornaAttSec(this.ggMaxPos);
  }

  fineSelezioneGgMaxPos(e) {    
    //this.nuovaSelezioneGgMaxPos.emit(this.ggMaxPos);
    this.aggiornaAttSec(this.ggMaxPos);
  }
  
  selezioneArea(e) {    
    //this.nuovaSelezioneAreaPos.emit(e)
    this.aggiornaArea(e)
  }




  aggiornaAttSec(evento) {
    //console.log("aggiornaAttSec", evento);

    if (evento != null) {
      var gg: number = evento;
      this.parametriGeoFleetWS.reset();
      this.parametriGeoFleetWS.setRichiestaAPI('posizioneFlotta');
      this.parametriGeoFleetWS.setAttSec( gg*24*60*60 );
      this.parametriGeoFleetWS.setDefaultAttSec( gg*24*60*60 );

      //this.reset = true;
      //this.aggiorna(this.parametriGeoFleetWS, true);
    }      

  }      

  aggiornaArea(evento) {
    //console.log("aggiornaArea", evento);
    if (evento != null) {
      
      var vv = Object.values(evento);
      var vv1 = Object.values(vv[0]);
      var vv2 = Object.values(vv[1]);
      //console.log("aggiornaArea  vv",vv);
      this.parametriGeoFleetWS.reset();
      this.parametriGeoFleetWS.setRichiestaAPI('inRettangolo');
      this.parametriGeoFleetWS.setAttSec(null);
      this.parametriGeoFleetWS.setLat1(vv1[1]);
      this.parametriGeoFleetWS.setLon1(vv2[0]);
      this.parametriGeoFleetWS.setLat2(vv1[0]);
      this.parametriGeoFleetWS.setLon2(vv2[1]);

      //this.timerSubcribe.unsubscribe();
      //this.reset = true;
      //this.aggiorna(this.parametriGeoFleetWS, true);

    }
  }    

}

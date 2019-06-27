import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { PosizioneMezzo } from '../shared/model/posizione-mezzo.model';
import { VoceFiltro } from "../filtri/voce-filtro.model";

//import { UiSwitchModule } from 'angular2-ui-switch';
import { UiSwitchModule } from 'ngx-ui-switch';

import {AccordionModule} from 'primeng/accordion';
import {DropdownModule} from 'primeng/dropdown';
import {SliderModule} from 'primeng/slider';

import { Opzioni } from '../shared/model/opzioni.model';


import { FlottaDispatcherService } from '../service-dispatcher/flotta-dispatcher.service';
import { GestioneOpzioniService } from '../service-opzioni/gestione-opzioni.service';
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

//export class ElencoPosizioniFlottaComponent implements OnInit, OnChanges {
export class ElencoPosizioniFlottaComponent  {

  public elencoPosizioni : PosizioneMezzo[] = [];
  public opzioni: Opzioni;

  // PASSATI IN INPUT AL COMPONENTE MAPPA
  // NOTA: gestirli nel servizio MapService (da creare)
  //public seguiMezziSelezionati : PosizioneMezzo[] = [] ;
  public mezzoSelezionato: PosizioneMezzo ;
  //
  public mezziSelezionati : PosizioneMezzo[] = [] ;

  public aggiornaMezziSelezionati: boolean;

  public istanteUltimoAggiornamento: Date;
  public istanteModificaFiltri : Date;


  private geolocationPosition : Position;

  private draggedPosizioneMezzo: PosizioneMezzo;

   subscription = new Subscription();
      
    constructor(
      private flottaDispatcherService: FlottaDispatcherService,
      private gestioneOpzioniService: GestioneOpzioniService,
      private gestioneFiltriService: GestioneFiltriService      
    )    
    {
    //this.seguiMezziSelezionati = [];
   
    this.opzioni = new Opzioni();
    this.opzioni.reset();
    

    this.subscription.add(
      this.gestioneOpzioniService.getOpzioni()
      .subscribe( opt => { 
        this.opzioni.set(opt); })
      );   

    
    this.subscription.add(
      this.flottaDispatcherService.getReset()
      .subscribe( posizioni => {
          // svuota l'elenco delle posizioni elencate
          this.elencoPosizioni = [];
        })
      );   

    // attende una eventuale modifica dei filtri
    this.subscription.add(
      this.gestioneFiltriService.getFiltriIsChanged()
      .subscribe( value => {
          this.istanteModificaFiltri = moment().toDate();
          this.gestioneFiltriService.calcolcaCardinalitaStatiMezzo(
            this.elencoPosizioni.filter( item => 
              this.gestioneFiltriService.posizioneMezzoSelezionataPerCardinalitaStati(item)),true);
        })
      );

    this.subscription.add(
      this.flottaDispatcherService.getIstanteUltimoAggiornamento()
      .subscribe( istante => {
          this.istanteUltimoAggiornamento = istante; 
        })
      );
        
            
    this.subscription.add(
      this.flottaDispatcherService.getNuovePosizioniFlotta()
      .subscribe( posizioni => {
          //(posizioni.length > 0)?console.log(moment().toDate(),"ElencoPosizioniFlottaComponent, getNuovePosizioniFlotta - posizioni:", posizioni):null;
          this.aggiungiNuovePosizioniFlotta(posizioni);
          this.controllaCentraSuUltimaPosizione();
          //(posizioni.length > 0)?console.log(moment().toDate(),"ElencoPosizioniFlottaComponent, getNuovePosizioniFlotta - fine"):null;
        })
      );   

    this.subscription.add(
      this.flottaDispatcherService.getPosizioniFlottaStatoModificato()
      .subscribe( posizioni => {
          //(posizioni.length > 0)?console.log(moment().toDate(),"ElencoPosizioniFlottaComponent, getPosizioniFlottaStatoModificato - posizioni:", posizioni):null;
          this.modificaPosizioniFlotta(posizioni);
          this.controllaCentraSuUltimaPosizione();
          //(posizioni.length > 0)?console.log(moment().toDate(),"ElencoPosizioniFlottaComponent, getPosizioniFlottaStatoModificato - fine"):null;
        })
      );   
  
    this.subscription.add(
      this.flottaDispatcherService.getPosizioniFlottaLocalizzazioneModificata()
      .subscribe( posizioni => {
          //(posizioni.length > 0)?console.log(moment().toDate(),"ElencoPosizioniFlottaComponent, getPosizioniFlottaLocalizzazioneModificata - posizioni:", posizioni):null;
          this.modificaPosizioniFlotta(posizioni);
          this.controllaCentraSuUltimaPosizione();
          //(posizioni.length > 0)?console.log(moment().toDate(),"ElencoPosizioniFlottaComponent, getPosizioniFlottaLocalizzazioneModificata - fine"):null;
        })
      );   

    this.subscription.add(
      this.flottaDispatcherService.getMezziSelezionati()
      .subscribe( elenco => { this.mezziSelezionati = 
        JSON.parse(JSON.stringify(elenco));

      //console.log(moment().toDate(), "ElencoPosizioniFlottaComponent.getMezziSelezionati() - this.mezziSelezionati",  this.mezziSelezionati);
      
      })
    );   
      
   }    


  /*
  ngOnInit() {
    null;

  }
  
  ngOnChanges() {
    null;
  }
  */
 
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
      /*
      pos = this.seguiMezziSelezionati.find( i => i.codiceMezzo ===  
        this.draggedPosizioneMezzo.codiceMezzo);
      if (pos == null) {
        this.seguiMezziSelezionati = this.seguiMezziSelezionati.
          concat(this.draggedPosizioneMezzo);
        this.draggedPosizioneMezzo = null;
      }

      //this.centerOnMezzo = true;
      this.gestioneOpzioniService.setCenterOnMezzo(true);
      */

      this.flottaDispatcherService.addMezziSelezionati(this.draggedPosizioneMezzo);
    }
    //console.log("seguiMezzo", evento);
  }

  isSeguiMezzo(p : PosizioneMezzo) : Boolean {
    return ( this.mezziSelezionati.findIndex( i => i.codiceMezzo === p.codiceMezzo) != -1 );
    //return (this.elencoPosizioni.find( i => i.codiceMezzo === p.codiceMezzo).selezionato);
  }

  
  seguiMezzo(evento) {
    var tipoevento: string = evento[1];
    //var pos : PosizioneMezzo ;
    //var k: number;
    if (tipoevento == "aggiungi") {

      this.flottaDispatcherService.addMezziSelezionati(evento[0]);

      /*
      pos = this.seguiMezziSelezionati.find( i => i.codiceMezzo === evento[0].codiceMezzo);
      if (pos == null) {
        this.seguiMezziSelezionati = this.seguiMezziSelezionati.concat(evento[0]);        
        this.aggiornaMezziSelezionati = true;
      }
      */
      
      /*
      k = this.elencoPosizioni.findIndex( i => i.codiceMezzo === evento[0].codiceMezzo);
      if (k != -1) {
        this.elencoPosizioni[k].selezionato = true;
        this.seguiMezziSelezionati = this.seguiMezziSelezionati.concat(this.elencoPosizioni[k]);
      }
      */
      
      //console.log(moment().toDate(),"seguiMezzo",evento,this.elencoPosizioni[k]);

      //this.centerOnMezzo = true;
      //this.gestioneOpzioniService.setCenterOnMezzo(true);
      //console.log(moment().toDate(), "ElencoPosizioniFlottaComponent.seguiMezzo(aggiungi) - this.seguiMezziSelezionati", this.seguiMezziSelezionati);
      
    }

    if (tipoevento == "rimuovi") {
      this.flottaDispatcherService.removeMezziSelezionati(evento[0]);
      /*
      //this.seguiMezziSelezionati = [];
      //pos = this.seguiMezziSelezionati.find( i => i.codiceMezzo === evento[0].codiceMezzo);
      let i = this.seguiMezziSelezionati.indexOf( evento[0]);
      this.seguiMezziSelezionati.splice(i,1);
      this.aggiornaMezziSelezionati = true;

      if (this.seguiMezziSelezionati.length == 0 ) {
        //this.centerOnMezzo = false;
        this.gestioneOpzioniService.setCenterOnMezzo(false);
      }      

      console.log(moment().toDate(), "ElencoPosizioniFlottaComponent.seguiMezzo(rimuovi) - this.seguiMezziSelezionati", this.seguiMezziSelezionati);
      */

    }

    if (this.mezziSelezionati.length > 0) 
      {this.gestioneOpzioniService.setCenterOnSelected(true);}
    else
      {this.gestioneOpzioniService.setCenterOnSelected(false);}    
  }


  /*
  rimuoviSeguiMezzo(evento) {
    var tipoevento: string = evento[1];
    var pos : PosizioneMezzo ;
    
    if (tipoevento == "dblclick") {
      //this.seguiMezziSelezionati = [];
      //pos = this.seguiMezziSelezionati.find( i => i.codiceMezzo === evento[0].codiceMezzo);
      let i = this.seguiMezziSelezionati.indexOf( evento[0]);
      this.seguiMezziSelezionati.splice(i,1);

      if (this.seguiMezziSelezionati.length == 0 ) {
        //this.centerOnMezzo = false;
        this.gestioneOpzioniService.setCenterOnMezzo(false);
      }
    }
    //console.log("rimuoviSeguiMezzo", evento);
  }
  */

  rimuoviSeguiMezzoDrop(evento) {
    var tipoevento: string = evento[1];
    var pos : PosizioneMezzo ;
    
    if ( this.draggedPosizioneMezzo ) {
      /*
      let i = this.seguiMezziSelezionati.indexOf( this.draggedPosizioneMezzo);
      this.seguiMezziSelezionati.splice(i,1);

      if (this.seguiMezziSelezionati.length == 0 ) {
        this.gestioneOpzioniService.setCenterOnMezzo(false);        
      }
      */
     this.flottaDispatcherService.removeMezziSelezionati(this.draggedPosizioneMezzo);
    }
    //console.log("rimuoviSeguiMezzo", evento);
  }

  riordinaElenco()
  {

      // riordina l'array elencoPosizioni per istanteAcquisizione discendente
      this.elencoPosizioni = this.elencoPosizioni.sort( 
        function(a,b) 
        { var bb : Date = new Date(b.istanteAcquisizione);
          var aa : Date  = new Date(a.istanteAcquisizione);
          return aa>bb ? -1 : aa<bb ? 1 : 0;
        });
      
      // riordina l'array seguiMezziSelezionati per istanteAcquisizione discendente
      this.mezziSelezionati = this.mezziSelezionati.sort( 
        function(a,b) 
        { var bb : Date = new Date(b.istanteAcquisizione);
          var aa : Date  = new Date(a.istanteAcquisizione);
          return aa>bb ? -1 : aa<bb ? 1 : 0;
        });

      // 


  }

  aggiungiNuovePosizioniFlotta( nuovePosizioniMezzo :PosizioneMezzo[]) {
    //this.testModalitaCambiata();
    var p : PosizioneMezzo[];
    p = nuovePosizioniMezzo.filter(r => r.infoSO115 != null); 

    //console.log("ElencoPosizioniFlottaComponent() - aggiungiNuovePosizioniFlotta", p);
    
    if (p.length  > 0) 
    {
      // riordina l'array ricevuto per istanteAcquisizione ascendente
      /*
      p = p.sort( 
        function(a,b) 
        { var bb : Date = new Date(b.istanteAcquisizione);
          var aa : Date  = new Date(a.istanteAcquisizione);
          return aa>bb ? 1 : aa<bb ? -1 : 0;
        });
      */
      //
      // l'array ricevuto è già ordinato per istanteAcquisizione ascendente.
      //
      // aggiunge le nuove posizioni in cima a quelle visualizzate nella pagina HTML
      // e controlla se la posizione ricevuta è relativa ad un Mezzo da seguire

      p.forEach( item => {
        this.elencoPosizioni.splice(0,0,item);
        this.controllaMezzoDaSeguire(item);
      } )

      this.riordinaElenco();

    }

  }

  modificaPosizioniFlotta( posizioniMezzoModificate :PosizioneMezzo[]) {
    //this.testModalitaCambiata();
    var p : PosizioneMezzo[];
    p = posizioniMezzoModificate.filter(r => r.infoSO115 != null); 

    //console.log("ElencoPosizioniFlottaComponent() - modificaPosizioniFlotta", p);

    if (p.length  > 0) 
    {    
      /*
      // ordina l'array posizioniMezzoModificate per istanteAcquisizione ascendente
      p = p.sort( 
        function(a,b) 
        { var bb : Date = new Date(b.istanteAcquisizione);
          var aa : Date  = new Date(a.istanteAcquisizione);
          return aa>bb ? 1 : aa<bb ? -1 : 0;
        });  
      */  
    
      //
      // l'array ricevuto è già ordinato per istanteAcquisizione ascendente.
      //
      // modifica nelle posizioni Mostrate quelle con variazioni
      p.forEach( item => { 
          var v = this.elencoPosizioni.findIndex( x => item.codiceMezzo === x.codiceMezzo );
          if ( v != -1) 
          {  
            //var selezionatoPrecedente = this.elencoPosizioni[v].selezionato;
            // se la posizione ricevuta ha uno stato 'sconosciuto', ovvero proviene dai TTK,
            // salva le 'infoSO115' e le 'classiMezzo' attuali per riportarli nella nuova posizione
            // in quanto quelle provenient da SO115 sono più aggiornate
            if (item.infoSO115.stato === "0")
            { var infoPrecedenti = JSON.parse(JSON.stringify(this.elencoPosizioni[v].infoSO115));
              var classiMezzoPrecedenti = JSON.parse(JSON.stringify(this.elencoPosizioni[v].classiMezzo));
            }
            var newItem = JSON.parse(JSON.stringify(item));
            if (item.infoSO115.stato === "0")
            {
              newItem.infoSO115 = infoPrecedenti;
              newItem.classiMezzo = classiMezzoPrecedenti;
            }

            //newItem.selezionato = selezionatoPrecedente;
            
            // rimuove la posizione precedente
            this.elencoPosizioni.splice(v,1);
            // aggiunge le nuove posizioni in cima a quelle visualizzate nella pagina HTML
            this.elencoPosizioni.splice(0,0,newItem);

            // controlla se la posizione ricevuta è relativa ad un Mezzo da seguire
            this.controllaMezzoDaSeguire(this.elencoPosizioni[v]);
          }    
        } 
      );

      this.riordinaElenco();
    }
        
  }

  
  controllaMezzoDaSeguire(p: PosizioneMezzo) {
    var v = this.mezziSelezionati.findIndex(item => item.codiceMezzo == p.codiceMezzo);
    if (v != -1) 
      { 
        // modifica anche la posizione tra i Mezzi da seguire se è presente
        this.mezziSelezionati[v] = JSON.parse(JSON.stringify(p)); 
        // se è attivo il flag di Ricentra sull'ultima posizione ricevuta da un Mezzo
        // ed è stato selezionato solo 1 Mezzo, allora si ricentra ed effettua lo zoom,
        // altrimenti lascia tutto invariato
        if (this.opzioni.getCenterOnSelected() && this.mezziSelezionati.length === 0) {
          this.mezzoSelezionato = p;
          
          this.gestioneOpzioniService.setStartLat(Number(this.mezzoSelezionato.localizzazione.lat));
          this.gestioneOpzioniService.setStartLon(Number(this.mezzoSelezionato.localizzazione.lon));
          this.gestioneOpzioniService.setStartZoom(12);
        }
      }
  }

  controllaCentraSuUltimaPosizione() {
    if (!this.opzioni.getCenterOnSelected() && 
      (this.mezzoSelezionato == null || this.opzioni.getCenterOnLast()) ) 
    {
      this.mezzoSelezionato = this.elencoPosizioni[0];
    }
  }

   
  centraSuMappa(evento) {
    var tipoevento: string = evento[1];
    if (tipoevento == "click") {
      this.mezzoSelezionato = evento[0];

      this.gestioneOpzioniService.setStartLat(Number(this.mezzoSelezionato.localizzazione.lat));
      this.gestioneOpzioniService.setStartLon(Number(this.mezzoSelezionato.localizzazione.lon));
      this.gestioneOpzioniService.setStartZoom(12);     
    }
    //console.log("centraSuMappa", this.mezzoSelezionato);
  }

  evidenziaSuMappa(evento) {
    var tipoevento: string = evento[1];
    if (tipoevento == "mouseover") {
      this.mezzoSelezionato = evento[0];
    }
    //console.log("evidenziaSuMappa", this.mezzoSelezionato);
  }

  nuovaSelezioneMezzi(elencoMezzi) {
    //console.log(moment().toDate(), 'ElencoPosizioniFlottaComponent.nuovaSelezioneMezzi()', elencoMezzi );
    /*
    this.mezziSelezionati = this.elencoPosizioni.filter( i => elencoMezzi.
        some( elem => elem === i.codiceMezzo));
    */
    this.flottaDispatcherService.resetMezziSelezionati();
    elencoMezzi.forEach( item => this.flottaDispatcherService.
      addMezziSelezionati(
        this.elencoPosizioni.find( ii => ii.codiceMezzo === item)));
  }

}

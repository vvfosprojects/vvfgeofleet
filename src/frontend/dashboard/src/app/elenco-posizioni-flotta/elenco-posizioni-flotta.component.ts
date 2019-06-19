import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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

  public elencoPosizioni : PosizioneMezzo[] = [];
  public opzioni: Opzioni;

  // PASSATI IN INPUT AL COMPONENTE MAPPA
  // NOTA: gestirli nel servizio MapService (da creare)
  public seguiMezziSelezionati : PosizioneMezzo[] = [] ;
  public mezzoSelezionato: PosizioneMezzo ;
  //

  private geolocationPosition : Position;


  private draggedPosizioneMezzo: PosizioneMezzo;

   subscription = new Subscription();
      
    constructor(
      private flottaDispatcherService: FlottaDispatcherService,
      private gestioneOpzioniService: GestioneOpzioniService
    )    
    {
    this.seguiMezziSelezionati = [];
   
    this.opzioni = new Opzioni();
    this.opzioni.reset();
    

    this.subscription.add(
      this.gestioneOpzioniService.getOpzioni()
      //.debounceTime(3000)
      .subscribe( opt => { 
        this.opzioni.set(opt); })
      );   

    
    this.subscription.add(
      this.flottaDispatcherService.getReset()
      //.debounceTime(3000)
      .subscribe( posizioni => {
          // svuota l'elenco delle posizioni elencate
          this.elencoPosizioni = [];
        })
      );   
      
    this.subscription.add(
      this.flottaDispatcherService.getNuovePosizioniFlotta()
      //.debounceTime(3000)
      .subscribe( posizioni => {
          //console.log("ElencoPosizioniFlottaComponent, getNuovePosizioniFlotta - posizioni:", posizioni);
          this.aggiungiNuovePosizioniFlotta(posizioni);
          this.controllaCentraSuUltimaPosizione();
        })
      );   

    this.subscription.add(
      this.flottaDispatcherService.getPosizioniFlottaStatoModificato()
      //.debounceTime(3000)
      .subscribe( posizioni => {
          //console.log("ElencoPosizioniFlottaComponent, getPosizioniFlottaStatoModificato - posizioni:", posizioni);
          this.modificaPosizioniFlotta(posizioni);
          this.controllaCentraSuUltimaPosizione();
        })
      );   
  
    this.subscription.add(
      this.flottaDispatcherService.getPosizioniFlottaLocalizzazioneModificata()
      //.debounceTime(3000)
      .subscribe( posizioni => {
          //console.log("ElencoPosizioniFlottaComponent, getPosizioniFlottaLocalizzazioneModificata - posizioni:", posizioni);
          this.modificaPosizioniFlotta(posizioni);
          this.controllaCentraSuUltimaPosizione();
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

      //this.centerOnMezzo = true;
      this.gestioneOpzioniService.setCenterOnMezzo(true);
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

      //this.centerOnMezzo = true;
      this.gestioneOpzioniService.setCenterOnMezzo(true);
      
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
        //this.centerOnMezzo = false;
        this.gestioneOpzioniService.setCenterOnMezzo(false);
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
        //this.centerOnMezzo = false;
        this.gestioneOpzioniService.setCenterOnMezzo(false);        
      }
    }
    //console.log("rimuoviSeguiMezzo", evento);
  }

  aggiungiNuovePosizioniFlotta( nuovePosizioniMezzo :PosizioneMezzo[]) {
    //this.testModalitaCambiata();
    var p : PosizioneMezzo[];
    p = nuovePosizioniMezzo.filter(r => r.infoSO115 != null); 

    //console.log("ElencoPosizioniFlottaComponent() - aggiungiNuovePosizioniFlotta", p);
    
    if (p.length  > 0) 
    {
      // riordina l'array ricevuto per istanteAcquisizione ascendente
      p = p.sort( 
        function(a,b) 
        { var bb : Date = new Date(b.istanteAcquisizione);
          var aa : Date  = new Date(a.istanteAcquisizione);
          return aa>bb ? 1 : aa<bb ? -1 : 0;
        });

      // aggiunge le nuove posizioni in cima a quelle visualizzate nella pagina HTML
      // e controlla se la posizione ricevuta è relativa ad un Mezzo da seguire

      p.forEach( item => {
        this.elencoPosizioni.splice(0,0,item);
        this.controllaMezzoDaSeguire(item);
      } )

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
    //this.testModalitaCambiata();
    var p : PosizioneMezzo[];
    p = posizioniMezzoModificate.filter(r => r.infoSO115 != null); 

    //console.log("ElencoPosizioniFlottaComponent() - modificaPosizioniFlotta", p);

    if (p.length  > 0) 
    {    
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
          if ( v != -1) 
          {  
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

            // rimuove la posizione precedente
            this.elencoPosizioni.splice(v,1);
            // aggiunge le nuove posizioni in cima a quelle visualizzate nella pagina HTML
            this.elencoPosizioni.splice(0,0,newItem);

            // controlla se la posizione ricevuta è relativa ad un Mezzo da seguire
            this.controllaMezzoDaSeguire(this.elencoPosizioni[v]);
          }    
        } 
      );

      // riordina l'array seguiMezziSelezionati per istanteAcquisizione discendente
      this.seguiMezziSelezionati = this.seguiMezziSelezionati.sort( 
        function(a,b) 
        { var bb : Date = new Date(b.istanteAcquisizione);
          var aa : Date  = new Date(a.istanteAcquisizione);
          return aa>bb ? -1 : aa<bb ? 1 : 0;
        });
      
    }
        
  }

  /*
  aggiungiNuovePosizioniFlotta( nuovePosizioniMezzo :PosizioneMezzo[]) {
    //this.testModalitaCambiata();
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

      // ordina l'array nuovePosizioniMezzo per istanteAcquisizione discendente
      nuovePosizioniMezzo = nuovePosizioniMezzo.sort( 
        function(a,b) 
        { var bb : Date = new Date(b.istanteAcquisizione);
          var aa : Date  = new Date(a.istanteAcquisizione);
          return aa>bb ? -1 : aa<bb ? 1 : 0;
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
  */

  /*
  modificaPosizioniFlotta( posizioniMezzoModificate :PosizioneMezzo[]) {
    //this.testModalitaCambiata();
    var p : PosizioneMezzo[];
    p = posizioniMezzoModificate.filter(r => r.infoSO115 != null); 

    
    // ordina l'array posizioniMezzoModificate per istanteAcquisizione discendente
    p = p.sort( 
      function(a,b) 
      { var bb : Date = new Date(b.istanteAcquisizione);
        var aa : Date  = new Date(a.istanteAcquisizione);
        return aa>bb ? -1 : aa<bb ? 1 : 0;
      });
    
    
    // modifica nelle posizioni Mostrate quelle con variazioni
    p.forEach( item => { 
      var v = this.elencoPosizioni.findIndex( x => item.codiceMezzo === x.codiceMezzo );
      if ( v != null) {  
        // se la posizione ricevuta ha uno stato 'sconosciuto'
        // modifica solo le informazioni di base, senza modificare quelle relative a SO115 
        // altrimenti modifica tutte le informazioni
        if (item.infoSO115.stato != "0")
          { this.elencoPosizioni[v] = JSON.parse(JSON.stringify(item)); }
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
  */
  
 
  controllaMezzoDaSeguire(p: PosizioneMezzo) {
    var v = this.seguiMezziSelezionati.findIndex(item => item.codiceMezzo == p.codiceMezzo);
    if (v != -1) 
      { 
        // modifica anche la posizione tra i Mezzi da seguire se è presente
        this.seguiMezziSelezionati[v] = JSON.parse(JSON.stringify(p)); 
        // se è attivo il flag di Ricentra sull'ultima posizione ricevuta da un Mezzo
        if (this.opzioni.getCenterOnMezzo() ) {
          this.mezzoSelezionato = p;
          
          this.gestioneOpzioniService.setStartLat(Number(this.mezzoSelezionato.localizzazione.lat));
          this.gestioneOpzioniService.setStartLon(Number(this.mezzoSelezionato.localizzazione.lon));
          this.gestioneOpzioniService.setStartZoom(12);
        }
      }
  }

  controllaCentraSuUltimaPosizione() {
    if (!this.opzioni.getCenterOnMezzo() && 
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



}

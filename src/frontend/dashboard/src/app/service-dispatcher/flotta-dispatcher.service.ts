import { Injectable } from '@angular/core';
import { Observable, Subscription, Subject, of } from "rxjs";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


import * as moment from 'moment';

import { ParametriGeoFleetWS } from '../shared/model/parametri-geofleet-ws.model';


import { PosizioneMezzo } from '../shared/model/posizione-mezzo.model';
import { Mezzo } from '../shared/model/mezzo.model';

import { PosizioneFlottaService } from '../service-VVFGeoFleet/posizione-flotta.service';
import { PosizioneFlottaServiceFake } from '../service-VVFGeoFleet/posizione-flotta.service.fake';

import { GestioneFiltriService } from '../service-filter/gestione-filtri.service';
import { GestioneOpzioniService } from '../service-opzioni/gestione-opzioni.service';

//import { VoceFiltro } from "../filtri/voce-filtro.model";

//import { observable } from 'rxjs';
//import { toObservable } from '@angular/forms/src/validators';

// i dati del Dispatcher vengono condivisi in tutta l'applicazione
@Injectable({
  providedIn: 'root'
})
export class FlottaDispatcherService {

  private istanteUltimoAggiornamento: Date;

  //private subjectElencoPosizioniMezzo$ = new Subject<PosizioneMezzo[]>();

  private subjectNuovePosizioniMezzo$ = new Subject<PosizioneMezzo[]>();
  private subjectPosizioniMezzoStatoModificato$ = new Subject<PosizioneMezzo[]>();
  private subjectPosizioniMezzoLocalizzazioneModificata$ = new Subject<PosizioneMezzo[]>();

  private subjectReset$ = new Subject<Boolean>();
  
  private subjectIstanteUltimoAggiornamento$ = new Subject<Date>();

  // elenco delle posizioni ricevute
  //private elencoPosizioniMezzo : PosizioneMezzo[] = [];

  // elenco delle posizioni da elaborare, ovvero quelle ricevute dal service e 
  // successive all'ultimo istante di aggiornamento 
  private elencoPosizioniDaElaborare : PosizioneMezzo[] = [];

  // array delle sole Nuove posizioni 
  private elencoPosizioniNuove : PosizioneMezzo[] = [];
  // array delle sole posizioni Modificate
  private elencoPosizioniModificate : PosizioneMezzo[] = [];
  // array delle sole posizioni con localizzazione Modificata
  private elencoPosizioniLocalizzazioneModificata : PosizioneMezzo[] = [];
  // array delle sole posizioni con Stato Modificato
  private elencoPosizioniStatoModificato : PosizioneMezzo[] = [];
  
  // array delle sole posizioni Eliminate
  //private elencoPosizioniEliminate : PosizioneMezzo[] = [];
  // array delle sole posizioni Rientrate
  //private elencoPosizioniRientrate : PosizioneMezzo[] = [];
  
  // dataStore delle posizioni
  private elencoPosizioniMostrate : PosizioneMezzo[] = [];
  // copia del dataStore delle posizioni relative all'aggiornamento precedente
  //private elencoPosizioniMostratePrecedenti : PosizioneMezzo[] = [];


  // dataStore dell'elenco Mezzi
  private elencoMezzi: Mezzo[] = [];

  // dataStore dei Mezzi selezionati
  //private mezziSelezionati : PosizioneMezzo[] = [] ;
  //private subjectMezziSelezionati$ = new Subject<PosizioneMezzo[]>();
  private mezziSelezionati : Mezzo[] = [] ;

  private subjectMezziSelezionati$ = new Subject<Mezzo[]>();
  private subjectNuoviMezzi$ = new Subject<Mezzo[]>();
  

  subscription = new Subscription();



  constructor(
    private posizioneFlottaService: PosizioneFlottaService,
    private gestioneFiltriService: GestioneFiltriService,
    private gestioneOpzioniService: GestioneOpzioniService    
  ) { 

    //console.log('FlottaDispatcherService.constructor()');
  
    // attende di ricevere l'istante dell'ultimo aggiornamento
    this.subscription.add(
      this.posizioneFlottaService.getIstanteUltimoAggiornamento()
      .subscribe( istante => {
          this.istanteUltimoAggiornamento = istante;
          this.subjectIstanteUltimoAggiornamento$.next(this.istanteUltimoAggiornamento);          
        })
      ); 

    // in caso di estrazione dei dati senza limite temporale
    // effettua lo svuotamento dello storage delle posizioni
    this.subscription.add(
      this.posizioneFlottaService.getReset()
        .subscribe( value => 
        { 
          //console.log('FlottaDispatcherService.getReset.subscribe', value);
          if (value) 
          {
            this.elencoPosizioniMostrate = [];
            //this.elencoPosizioniMostratePrecedenti = [];
            this.subjectReset$.next(true);  

          }
        })
      ); 
    
    this.aggiornaSituazioneFlotta();

  }


  public getNuoviMezzi(): Observable<Mezzo[]> {
    //console.log('GestioneOpzioniService - getMezziSelezionati()',this.opzioni);    
    return this.subjectNuoviMezzi$.asObservable();
  }
  
  public getMezziSelezionati(): Observable<Mezzo[]> {
    //console.log('GestioneOpzioniService - getMezziSelezionati()',this.opzioni);    
    return this.subjectMezziSelezionati$.asObservable();
  }
  
  public getReset(): Observable<Boolean> {      
    return this.subjectReset$.asObservable();
  }

  public getIstanteUltimoAggiornamento(): 
  Observable<Date> {
    return this.subjectIstanteUltimoAggiornamento$.asObservable();                
  }  
  
  /*
  public getElencoMezzi():
  Observable<PosizioneMezzo[]> {
    //console.log("FlottaDispatcherService.getNuovePosizioniFlotta()", this.subjectNuovePosizioniMezzo$);
    return this.subjectElencoPosizioniMezzo$.asObservable();
  }
  */
  
  public getNuovePosizioniFlotta(): 
  Observable<PosizioneMezzo[]> {
    //console.log("FlottaDispatcherService.getNuovePosizioniFlotta()", this.subjectNuovePosizioniMezzo$);
    return this.subjectNuovePosizioniMezzo$.asObservable();
  }

  public getPosizioniFlottaStatoModificato(): 
  Observable<PosizioneMezzo[]> {
    //console.log("FlottaDispatcherService.getPosizioniFlottaStatoModificato()", this.subjectPosizioniMezzoStatoModificato$);
    return this.subjectPosizioniMezzoStatoModificato$.asObservable();
  }
  
  public getPosizioniFlottaLocalizzazioneModificata(): 
  Observable<PosizioneMezzo[]> {
    //console.log("FlottaDispatcherService.getPosizioniFlottaLocalizzazioneModificata()", this.subjectPosizioniMezzoLocalizzazioneModificata$);
    return this.subjectPosizioniMezzoLocalizzazioneModificata$.asObservable();
  }
      
  private aggiornaSituazioneFlotta(): void {

    this.posizioneFlottaService.getPosizioneFlotta()
    .subscribe( posizioni => 
      {
        if (posizioni === null) { return; }
        
        //console.log("FlottaDispatcherService.aggiornaSituazioneFlotta() - posizioni", posizioni);
        //console.log("FlottaDispatcherService.length: ", posizioni.length);

        // ordina in modo Ascendente
        this.elencoPosizioniDaElaborare = posizioni.sort( 
            function(a,b) 
          { var bb : Date = new Date(b.istanteAcquisizione);
            var aa : Date  = new Date(a.istanteAcquisizione);
            return aa>bb ? 1 : aa<bb ? -1 : 0;
          }
        );

        // elabora le posizioni ricevute in modo da attivare i subject specifici
        // delle posizioni Nuove, Modificate e d Eliminate
        this.elaboraPosizioniRicevute();
      
      });

    }


    elaboraPosizioniRicevute(){

      this.elencoPosizioniNuove = this.elaboraPosizioniNuove(this.elencoPosizioniDaElaborare);
      //(this.elencoPosizioniNuove.length > 0)?console.log(moment().toDate(),"flotta-dispatcher.service - elencoPosizioniNuove", this.elencoPosizioniNuove ):null;
      (this.elencoPosizioniNuove.length > 0)?this.subjectNuovePosizioniMezzo$.next(this.elencoPosizioniNuove):null;
      this.rimuoviPosizioniElaborate(this.elencoPosizioniNuove);

      // aggiunge nel datastore dell'elenco Mezzi quelli eventualmente non ancora presenti
      this.aggiornaElencoMezzi(this.elencoPosizioniNuove);

      this.elencoPosizioniStatoModificato = this.elaboraPosizioniStatoModificato(this.elencoPosizioniDaElaborare);
      //(this.elencoPosizioniStatoModificato.length > 0)?console.log(moment().toDate(),"FlottaDispatcherService.elaboraPosizioniRicevute() - elencoPosizioniStatoModificato", this.elencoPosizioniStatoModificato):null;
      (this.elencoPosizioniStatoModificato.length > 0)?this.subjectPosizioniMezzoStatoModificato$.next(this.elencoPosizioniStatoModificato):null;
      this.rimuoviPosizioniElaborate(this.elencoPosizioniStatoModificato);


      this.elencoPosizioniLocalizzazioneModificata = this.elaboraPosizioniLocalizzazioneModificata(this.elencoPosizioniDaElaborare);
      //(this.elencoPosizioniLocalizzazioneModificata.length > 0)?console.log(moment().toDate(),"FlottaDispatcherService.elaboraPosizioniRicevute() - elencoPosizioniLocalizzazioneModificata", this.elencoPosizioniLocalizzazioneModificata):null;
      (this.elencoPosizioniLocalizzazioneModificata.length > 0)?this.subjectPosizioniMezzoLocalizzazioneModificata$.next(this.elencoPosizioniLocalizzazioneModificata):null;
      this.rimuoviPosizioniElaborate(this.elencoPosizioniLocalizzazioneModificata);


      var el : PosizioneMezzo[] = this.elaboraPosizioniNonModificate(this.elencoPosizioniDaElaborare);
      //(el.length > 0)?console.log(moment().toDate(),"FlottaDispatcherService.elaboraPosizioniNonModificate() - el", el):null;
      this.rimuoviPosizioniElaborate(el);
      

      (this.elencoPosizioniDaElaborare.length > 0)?console.log(moment().toDate(),"Errore! Posizioni non elaborate:", this.elencoPosizioniDaElaborare):null;

      // riesegue il setup dei filtri per mostrare eventuali nuovi valori
      // non presenti nelle precedente elaborazione
      //console.log(moment().toDate(),"FlottaDispatcherService.elaboraPosizioniRicevute() - elencoPosizioniMostrate", this.elencoPosizioniMostrate);

      this.gestioneFiltriService.setupFiltri(this.elencoPosizioniMostrate);

      //this.subjectElencoPosizioniMezzo$.next(this.elencoPosizioniMostrate);

    }    

    // rimuove dalle posizioni da elaborare quelle elaborate
    rimuoviPosizioniElaborate(elenco : PosizioneMezzo[]) : void {
      elenco.forEach( v => { 
        var k = this.elencoPosizioniDaElaborare.
          findIndex( item => item.codiceMezzo === v.codiceMezzo );
        if (k != -1) { this.elencoPosizioniDaElaborare.splice(k,1); 
       }
       else { console.log(moment().toDate(),"rimuoviPosizioniElaborate() - item non trovato", v, this.elencoPosizioniDaElaborare);}
      })
    }

 
    deepEquals(x, y) {
      /*
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
      */
              
      if (x === y) {
        return true; // if both x and y are null or undefined and exactly the same
      } else if (!(x instanceof Object) || !(y instanceof Object)) {
        return false; // if they are not strictly equal, they both need to be Objects
      } else if (x.constructor !== y.constructor) {
        // they must have the exact same prototype chain, the closest we can do is
        // test their constructor.
        return false;
      } else {
        for (const p in x) {
          if (!x.hasOwnProperty(p)) {
            continue; // other properties were tested using x.constructor === y.constructor
          }
          if (!y.hasOwnProperty(p)) {
            return false; // allows to compare x[ p ] and y[ p ] when set to undefined
          }
          if (x[p] === y[p]) {
            continue; // if they have the same strict value or identity then they are equal
          }
          if (typeof (x[p]) !== 'object') {
            return false; // Numbers, Strings, Functions, Booleans must be strictly equal
          }
          if (!this.deepEquals(x[p], y[p])) {
            return false;
          }
        }
        for (const p in y) {
          if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
            return false;
          }
        }
        return true;
      }
    }    

    // individua le posizioni restituite che non hanno subito modifiche
    elaboraPosizioniNonModificate(elenco : PosizioneMezzo[]) : PosizioneMezzo[] {
      return elenco.
        filter( (item) => {
          var v = this.elencoPosizioniMostrate.find( 
            x => item.codiceMezzo === x.codiceMezzo );
          //if ( v != null && JSON.parse(JSON.stringify(v)) === JSON.parse(JSON.stringify(item)) ) 
          if ( v != null && this.deepEquals( v, item) ) 
            {return item}
          else {return null}
        }
      );  
    }
    
    // individua le Nuove posizioni, ovvero quelle di Mezzi non ancora presenti
    elaboraPosizioniNuove(elenco : PosizioneMezzo[]) : PosizioneMezzo[] {
      var elencoOut : PosizioneMezzo[];
      elencoOut = elenco.
        filter( (item) => {
          //var v = this.elencoPosizioniMostratePrecedenti.find( x => item.codiceMezzo == x.codiceMezzo );
          var v = this.elencoPosizioniMostrate.findIndex( x => item.codiceMezzo === x.codiceMezzo );
          if ( v == -1) {
            return item}
          else {return null}  }
         );

      this.elencoPosizioniMostrate = this.elencoPosizioniMostrate.concat(elencoOut);

      // restituisce gli array delle posizioni elaborate
      return elencoOut;

    }
  
    // individua le posizioni con lo stato Modificato
    elaboraPosizioniStatoModificato(elenco : PosizioneMezzo[]) : PosizioneMezzo[] {
      var elencoOut : PosizioneMezzo[];
      elencoOut = elenco.
          filter( (item) => {
            var kk = this.elencoPosizioniMostrate.findIndex( 
              x => item.codiceMezzo === x.codiceMezzo );                
            if ( kk != -1  
                && item.infoSO115.stato != '0' // se non è arrivata dai TTK
                // && this.elencoPosizioniMostrate[kk].istanteAcquisizione != item.istanteAcquisizione 
                && this.elencoPosizioniMostrate[kk].infoSO115.stato != item.infoSO115.stato            
                ) {
                  // modifica nel DataStore l'item con lo stato variato
                  this.elencoPosizioniMostrate[kk].toolTipText = item.toolTipText;
                  this.elencoPosizioniMostrate[kk].fonte = item.fonte;                  
                  this.elencoPosizioniMostrate[kk].istanteAcquisizione = item.istanteAcquisizione;
                  this.elencoPosizioniMostrate[kk].istanteArchiviazione = item.istanteArchiviazione;
                  this.elencoPosizioniMostrate[kk].istanteInvio = item.istanteInvio;
                  this.elencoPosizioniMostrate[kk].localizzazione = item.localizzazione;

                  this.elencoPosizioniMostrate[kk].infoSO115 = item.infoSO115; 
                  
                  return this.elencoPosizioniMostrate[kk];}
            else {return null;}  }
          );
      
      return elencoOut;
  
    }

    // individua le posizioni con istante acquisizione aggiornato
    elaboraPosizioniLocalizzazioneModificata(elenco : PosizioneMezzo[]) : PosizioneMezzo[] {
      var elencoOut : PosizioneMezzo[];
      elencoOut = elenco.
        filter( (item) => {
          //var v = this.elencoPosizioniMostratePrecedenti.find( 
          var kk = this.elencoPosizioniMostrate.findIndex( 
            x => item.codiceMezzo === x.codiceMezzo );                
          if ( kk != -1 
                // && this.elencoPosizioniMostrate[kk].istanteAcquisizione != item.istanteAcquisizione
            )
              {
                // modifica nel DataStore la posizioni variata 
                // ed eventualmente anche il suo stato (se non proviene dai TTK)
                this.elencoPosizioniMostrate[kk].toolTipText = item.toolTipText;
                this.elencoPosizioniMostrate[kk].fonte = item.fonte;
                this.elencoPosizioniMostrate[kk].istanteAcquisizione = item.istanteAcquisizione;
                this.elencoPosizioniMostrate[kk].istanteArchiviazione = item.istanteArchiviazione;
                this.elencoPosizioniMostrate[kk].istanteInvio = item.istanteInvio;
                this.elencoPosizioniMostrate[kk].localizzazione = item.localizzazione;
                if (  item.infoSO115.stato != '0')
                {this.elencoPosizioniMostrate[kk].infoSO115 = item.infoSO115; }
                
                return this.elencoPosizioniMostrate[kk];}
          else {return null}  }
        );
  
      return elencoOut;
    }



    aggiornaElencoMezzi(posizioni: PosizioneMezzo[]) {

      var posizioneDaElaborare = posizioni.filter( item => 
        { return this.elencoMezzi.
          find(itemElenco => item.codiceMezzo === itemElenco.codiceMezzo)?false:true
        });
  
      var elMez = posizioneDaElaborare.map( item => { 
        var mezzo = new Mezzo( item.codiceMezzo, item.descrizionePosizione) ;
        return mezzo;});

      this.elencoMezzi = this.elencoMezzi.concat( elMez);
      
      this.subjectNuoviMezzi$.next(elMez);  
    }    

    resetMezziSelezionati() {
      this.mezziSelezionati = [];
      this.gestioneOpzioniService.setCenterOnSelected(false);
      this.subjectMezziSelezionati$.next(this.mezziSelezionati);    
    }
    
  
    //addMezziSelezionati(item: PosizioneMezzo) {
    addMezziSelezionati(item: Mezzo) {
  
      //var pos : PosizioneMezzo ;
      var pos : Mezzo ;
      var k: number;
      pos = this.mezziSelezionati.find( i => i.codiceMezzo === item.codiceMezzo);
      if (pos == null) {
          this.mezziSelezionati = this.mezziSelezionati.concat(item);        
          this.gestioneOpzioniService.setCenterOnSelected(true);
      }    
      
      //console.log(moment().toDate(), "GestioneOpzioniService.addMezziSelezionati() - item, this.mezziSelezionati", item, this.mezziSelezionati);
      this.subjectMezziSelezionati$.next(this.mezziSelezionati);
    }
  
    //removeMezziSelezionati(item: PosizioneMezzo) {
    removeMezziSelezionati(item: Mezzo) {
  
      let i = this.mezziSelezionati.findIndex( ii => ii.codiceMezzo === item.codiceMezzo);
      if (i != -1 )
      {
        this.mezziSelezionati.splice(i,1);
  
        if (this.mezziSelezionati.length > 0) 
          {this.gestioneOpzioniService.setCenterOnSelected(true);}
        else
          {this.gestioneOpzioniService.setCenterOnSelected(false);}    
    
        this.subjectMezziSelezionati$.next(this.mezziSelezionati);
      }
      //console.log(moment().toDate(), "GestioneOpzioniService.removeMezziSelezionati() - item, this.mezziSelezionati", item, this.mezziSelezionati);
      
    }
        
  }

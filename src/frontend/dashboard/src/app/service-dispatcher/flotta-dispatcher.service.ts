import { Injectable } from '@angular/core';
import { Observable, Subscription, Subject, of } from "rxjs";
//import { Observable, Subject } from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


import * as moment from 'moment';

import { ParametriGeoFleetWS } from '../shared/model/parametri-geofleet-ws.model';
//import { Opzioni } from '../shared/model/opzioni.model';


import { PosizioneMezzo } from '../shared/model/posizione-mezzo.model';
import { PosizioneFlottaService } from '../service-VVFGeoFleet/posizione-flotta.service';
import { PosizioneFlottaServiceFake } from '../service-VVFGeoFleet/posizione-flotta.service.fake';

import { GestioneFiltriService } from '../service-filter/gestione-filtri.service';
import { GestioneOpzioniService } from '../service-opzioni/gestione-opzioni.service';

import { VoceFiltro } from "../filtri/voce-filtro.model";

//import { observable } from 'rxjs';
//import { toObservable } from '@angular/forms/src/validators';

// i dati del Dispatcher vengono condivisi in tutta l'applicazione
@Injectable({
  providedIn: 'root'
})
export class FlottaDispatcherService {

  public parametriGeoFleetWS : ParametriGeoFleetWS;
  /*
  public opzioni: Opzioni;
  public opzioniPrecedenti: Opzioni;
  */
  
    //private elencoPosizioniMezzoPrec : PosizioneMezzo[] = [];
  
  private timer;
  private timerSubcribe: PushSubscription;

  public istanteUltimoAggiornamento: Date;
  private istanteAggiornamentoPrecedente: Date = null;

  public maxIstanteAcquisizione: Date;
  private maxIstanteAcquisizionePrecedente: Date = null;

  private trimSec: Number = 0;
  private defaultAttSec: Number = 259200; // 3 giorni (3 * 24 * 60 * 60)
  //private defaultAttSec: Number = 604800; // 1 settimana (7 * 24 * 60 * 60)
  private defaultrichiestaAPI: string = 'posizioneFlotta';
  //private attSec : Number = 604800; // 1 settimana (7 * 24 * 60 * 60)

  private geolocationPosition : Position;

  public reset : Boolean = false;

  public startLat: number = 41.889777;
  public startLon: number = 12.490689;
  public startZoom: number = 6;

  public modalita: number = 3 ;

  private subjectNuovePosizioniMezzo$ = new Subject<PosizioneMezzo[]>();
  private subjectPosizioniMezzoStatoModificato$ = new Subject<PosizioneMezzo[]>();
  private subjectPosizioniMezzoLocalizzazioneModificata$ = new Subject<PosizioneMezzo[]>();

  //private subjectPosizioniMezzo$ = new Subject<PosizioneMezzo[]>();
  private subjectIstanteUltimoAggiornamento$ = new Subject<Date>();

  //public elencoPosizioni : PosizioneMezzo[] = [];

  // elenco delle posizioni ricevute
  private elencoPosizioniMezzo : PosizioneMezzo[] = [];

  // elenco delle posizioni da elaborare, ovvero quelle ricevute dal service e 
  // successive all'ultimo istante di aggiornamento 
  //public elencoPosizioniMezzoTrim : PosizioneMezzo[] = [];
  private elencoPosizioniDaElaborare : PosizioneMezzo[] = [];

  // array delle sole Nuove posizioni 
  private elencoPosizioniNuove : PosizioneMezzo[] = [];
  // array delle sole posizioni Eliminate
  //private elencoPosizioniEliminate : PosizioneMezzo[] = [];
  // array delle sole posizioni Rientrate
  //private elencoPosizioniRientrate : PosizioneMezzo[] = [];
  // array delle sole posizioni Modificate
  private elencoPosizioniModificate : PosizioneMezzo[] = [];
  // array delle sole posizioni con localizzazione Modificata
  private elencoPosizioniLocalizzazioneModificata : PosizioneMezzo[] = [];
  // array delle sole posizioni con Stato Modificato
  private elencoPosizioniStatoModificato : PosizioneMezzo[] = [];
  
  
  // dataStore delle posizioni
  public elencoPosizioniMostrate : PosizioneMezzo[] = [];
  // copia del dataStore delle posizioni relative all'aggiornamento precedente
  private elencoPosizioniMostratePrecedenti : PosizioneMezzo[] = [];

  subscription = new Subscription();

  public vociFiltroStatiMezzo: VoceFiltro[] = [];
  public vociFiltroSedi: VoceFiltro[] = [];
  public vociFiltroGeneriMezzo: VoceFiltro[] = [];
  public vociFiltroDestinazioneUso: VoceFiltro[] = [];
  /*
  private subjectFiltriStatiMezzo$ = new Subject<VoceFiltro[]>();
  private subjectFiltriSedi$ = new Subject<VoceFiltro[]>();
  private subjectFiltriGeneriMezzo$ = new Subject<VoceFiltro[]>();
  private subjectFiltriDestinazioneUso$ = new Subject<VoceFiltro[]>();
  */

  constructor(
    private posizioneFlottaService: PosizioneFlottaService,
    private gestioneFiltriService: GestioneFiltriService,
    private gestioneOpzioniService: GestioneOpzioniService    
  ) { 

    this.parametriGeoFleetWS = new ParametriGeoFleetWS();
    //this.opzioni = new Opzioni();

    this.parametriGeoFleetWS.richiestaAPI = this.defaultrichiestaAPI;
    this.parametriGeoFleetWS.attSec = this.defaultAttSec;

    /*
    this.subscription.add(
      this.gestioneOpzioniService.getOpzioni()
      //.debounceTime(3000)
      .subscribe( opt => { this.gestisciModificaOpzioni(opt) })
      );   
    */

    this.subscription.add(
      this.gestioneOpzioniService.getParametriGeoFleetWS()
      //.debounceTime(3000)
      .subscribe( parm => { this.gestisciModificaParametri(parm) })
      );   

  
    //this.gestioneOpzioniService.reset();
  
  
    //this.timer = Observable.interval(9000).timeout(120000);
    this.timer = Observable.timer(0,9000).timeout(120000);
    // schedula con un timer l'aggiornamento periodio della Situazione flotta
    this.timerSubcribe = this.timer.subscribe(t => 
      this.aggiornaSituazioneFlotta(this.parametriGeoFleetWS, false));

    // attende una eventuale modifica delle opzioni
    //
  
    // attende una eventuale modifica dei filtri

    this.subscription.add(
      this.gestioneFiltriService.getFiltriStatiMezzo()
      //.debounceTime(3000)
      .subscribe( vocifiltro => {
          //console.log("FlottaDispatcherService, getFiltriStatiMezzo:", vocifiltro);
          this.vociFiltroStatiMezzo = vocifiltro;
          this.impostaPosizioneMezziVisibili(this.elencoPosizioniMostrate);        
          this.subjectPosizioniMezzoStatoModificato$.next(this.elencoPosizioniMostrate);
          //this.subjectFiltriStatiMezzo$.next(this.vociFiltroStatiMezzo);
          
        })
      );   
    
    this.subscription.add(
      this.gestioneFiltriService.getFiltriSedi()
      //.debounceTime(3000)
      .subscribe( vocifiltro => {
          //console.log("FlottaDispatcherService, getFiltriSedi:", vocifiltro);
          this.vociFiltroSedi = vocifiltro;
          this.impostaPosizioneMezziVisibili(this.elencoPosizioniMostrate);          
          this.subjectPosizioniMezzoStatoModificato$.next(this.elencoPosizioniMostrate);
          //this.subjectFiltriSedi$.next(this.vociFiltroSedi);
        })
      );   

    this.subscription.add(
      this.gestioneFiltriService.getFiltriGeneriMezzo()
      //.debounceTime(3000)
      .subscribe( vocifiltro => {
          //console.log("FlottaDispatcherService, getFiltriGeneriMezzo:", vocifiltro);
          this.vociFiltroGeneriMezzo = vocifiltro;
          this.impostaPosizioneMezziVisibili(this.elencoPosizioniMostrate);                    
          this.subjectPosizioniMezzoStatoModificato$.next(this.elencoPosizioniMostrate);
          //this.subjectFiltriGeneriMezzo$.next(this.vociFiltroGeneriMezzo);
        })
      );   

    this.subscription.add(
      this.gestioneFiltriService.getFiltriDestinazioneUso()
      //.debounceTime(3000)
      .subscribe( vocifiltro => {
          //console.log("FlottaDispatcherService, getFiltriDestinazioneUso:", vocifiltro);
          this.vociFiltroDestinazioneUso = vocifiltro;
          this.impostaPosizioneMezziVisibili(this.elencoPosizioniMostrate);          
          this.subjectPosizioniMezzoStatoModificato$.next(this.elencoPosizioniMostrate);
          //this.subjectFiltriDestinazioneUso$.next(this.vociFiltroDestinazioneUso);
        })
      );   

          
  }

/*
  public getFiltriStatiMezzo(): Observable<VoceFiltro[]> {
    return this.subjectFiltriStatiMezzo$.asObservable();
  }

  public getFiltriSedi(): Observable<VoceFiltro[]> {
    return this.subjectFiltriSedi$.asObservable();
  }

  public getFiltriGeneriMezzo(): Observable<VoceFiltro[]> {
    return this.subjectFiltriGeneriMezzo$.asObservable();
  }
  
  public getFiltriDestinazioneUso(): Observable<VoceFiltro[]> {
    return this.subjectFiltriDestinazioneUso$.asObservable();
  }
*/

  public getIstanteUltimoAggiornamento(): 
      Observable<Date> {
        return this.subjectIstanteUltimoAggiornamento$.asObservable();                
      }  

  /*
  public getSituazioneFlotta(parm : ParametriGeoFleetWS, all: boolean): 
      Observable<PosizioneMezzo[]> {

        return this.subjectPosizioniMezzo$.asObservable();
      }
  */

  public getNuovePosizioniFlotta(): 
  Observable<PosizioneMezzo[]> {

    return this.subjectNuovePosizioniMezzo$.asObservable();
  }

  public getPosizioniFlottaStatoModificato(): 
  Observable<PosizioneMezzo[]> {

    return this.subjectPosizioniMezzoStatoModificato$.asObservable();
  }
  
  public getPosizioniFlottaLocalizzazioneModificata(): 
  Observable<PosizioneMezzo[]> {

    return this.subjectPosizioniMezzoLocalizzazioneModificata$.asObservable();
  }
      
  private aggiornaSituazioneFlotta(parm : ParametriGeoFleetWS, all: boolean): void {

    //var obsPosizioniMezzo : Observable<PosizioneMezzo[]>;

    // memorizza l'istante di inizio di questa operazione di aggiornamento
    this.istanteUltimoAggiornamento = moment().toDate();      
  
    // aggiungere sempre X secondi per essere sicuri di perdersi
    // meno posizioni possibili, a causa della distanza di tempo tra
    // l'invio della richiesta dal client e la sua ricezione dal ws
    // Per essere certi, è necessaria un API che restituisca i messaggi
    // acquisiti successivamente ad un certo istante
    
    if (!all && this.maxIstanteAcquisizionePrecedente != null) 
    {parm.attSec = moment(this.istanteUltimoAggiornamento).
      diff(this.maxIstanteAcquisizionePrecedente, 'seconds').valueOf() + 
      this.trimSec.valueOf() ; }

    //console.log("FlottaDispatcherService.aggiornaSituazioneFlotta() - istanti",this.istanteUltimoAggiornamento, this.maxIstanteAcquisizionePrecedente);

    if (all) { this.maxIstanteAcquisizionePrecedente = null; }

    this.posizioneFlottaService.getPosizioneFlotta(parm).debounceTime(3000)
    .subscribe( posizioni => 
      {
        //console.log("posizioneFlottaService: ", posizioni);
        //console.log("posizioneFlottaService.length: ", posizioni.length);
        this.elencoPosizioniMezzo = posizioni.sort( 
          function(a,b) 
          { var bb : Date = new Date(b.istanteAcquisizione);
            var aa : Date  = new Date(a.istanteAcquisizione);
            return aa>bb ? -1 : aa<bb ? 1 : 0;
          }
        );

        //console.log("this.elencoPosizioniMezzo.length", this.elencoPosizioniMezzo.length);

        if (this.elencoPosizioniMezzo.length > 0) {
          //l'attSec deve essere calcolato in relazione all'istante 
          //più alto ma comunque precedente all'istanteUltimoAggiornamento, per escludere 
          //eventuali messaggi "futuri", che potrebbero essere ricevuti dagli adapter SO115
          //a seguito di errata impostazione della data di sistema sui server dei Comandi Provinciali

          var elencoPosizioniMezzoDepurate : PosizioneMezzo[];
          elencoPosizioniMezzoDepurate = this.elencoPosizioniMezzo.filter(
            i => (new Date(i.istanteAcquisizione) < new Date(this.istanteUltimoAggiornamento) )
          );            

          // imposta maxIstanteAcquisizione filtrando le posizioni precedenti all'
          // istanteUltimoAggiornamento
          if (elencoPosizioniMezzoDepurate.length > 0) {
            this.maxIstanteAcquisizione = new Date(elencoPosizioniMezzoDepurate.
              reduce( function (a,b) 
              { var bb : Date = new Date(b.istanteAcquisizione);
                var aa : Date  = new Date(a.istanteAcquisizione);
                return aa>bb ? a : b ;
              }).istanteAcquisizione);

            }

          //console.log("elencoPosizioniMezzo.length", this.elencoPosizioniMezzo.length);
          //console.log("elencoPosizioniMezzoDepurate.length", elencoPosizioniMezzoDepurate.length);
          //console.log("maxIstanteAcquisizione", this.maxIstanteAcquisizione);

          // imposta trimSec calcolando la differenza di tempo tra l'
          // istanteUltimoAggiornamento e l'istanteAcquisizione più alto tra le posizioni ricevute, 
          // purchè succesive a istanteUltimoAggiornamento
          this.trimSec = 0;

          this.elencoPosizioniDaElaborare = this.elencoPosizioniMezzo.filter(
            i => (new Date(i.istanteAcquisizione) >= new Date(this.maxIstanteAcquisizionePrecedente) )
            );

          //console.log("elencoPosizioniDaElaborare", this.elencoPosizioniDaElaborare);
          if (this.elencoPosizioniDaElaborare.length > 0) {
              this.trimSec = moment(
                new Date(this.elencoPosizioniDaElaborare.
                    reduce( function (a,b) 
                    { var bb : Date = new Date(b.istanteAcquisizione);
                      var aa : Date  = new Date(a.istanteAcquisizione);
                      return aa>bb ? a : b ;
                    }).istanteAcquisizione)).diff(this.istanteUltimoAggiornamento, 'seconds');
            }
          //console.log("trimSec", this.trimSec);
          this.trimSec = (this.trimSec.valueOf() > 0 ) ? this.trimSec.valueOf() + 10: 10;
          //console.log("trimSec adj", this.trimSec);

          /*
          //obsPosizioniMezzo = Observable.of( this.elencoPosizioniDaElaborare);
          this.subjectPosizioniMezzo$.next(this.elencoPosizioniDaElaborare);
          */

          // elabora le posizioni ricevute in modo da attivare i subject specifici
          // delle posizioni Nuove, Modificate e d Eliminate
          this.elaboraPosizioniRicevute();

    
          // restituisce l'istante di inizio di questa operazione di aggiornamento
          this.subjectIstanteUltimoAggiornamento$.next(this.istanteUltimoAggiornamento);
                
          if (elencoPosizioniMezzoDepurate.length > 0) {
            this.maxIstanteAcquisizionePrecedente = this.maxIstanteAcquisizione;
          }
                   
        }      
    

      
      });


    //console.log(this.elencoPosizioniMezzo.length);
    }


    elaboraPosizioniRicevute(){
      this.elaboraPosizioniNuove(this.elencoPosizioniDaElaborare);
      this.elaboraPosizioniLocalizzazioneModificata(this.elencoPosizioniDaElaborare);
      this.elaboraPosizioniStatoModificato(this.elencoPosizioniDaElaborare);
      // salva l'elenco delle posizioni Mostrate attualmente
      this.elencoPosizioniMostratePrecedenti = JSON.parse( JSON.stringify(this.elencoPosizioniMostrate));                        

      // riesegue il setup dei filtri per mostrare eventuali nuovi valori non presenti
      // in precedenza
      this.gestioneFiltriService.setupFiltri(this.elencoPosizioniMostrate);


    }    
    
    // individua le Nuove posizioni, ovvero quelle di Mezzi non ancora presenti
    elaboraPosizioniNuove(elenco: PosizioneMezzo[]) : void {
      this.elencoPosizioniNuove = elenco.
        filter( (item) => {
          var v = this.elencoPosizioniMostratePrecedenti.find( x => item.codiceMezzo == x.codiceMezzo );
          if ( v == null) {
            return item}
          else {return null}  }
         );
        
      // rimuove dalle posizioni da elaborare quelle Nuove
      this.elencoPosizioniNuove.forEach( v => { 
        var k = elenco.indexOf( v );
        if (k != -1) { elenco.splice(k,1); 
       }
      })
         
      if (this.elencoPosizioniNuove.length > 0) {
        // aggiunge nel DataStore le Nuove posizioni
        if (this.elencoPosizioniMostrate.length == 0 ) 
          { 
            this.elencoPosizioniMostrate = JSON.parse( 
              JSON.stringify(this.elencoPosizioniNuove));
          }
        else 
          { 
            /*
              this.elencoPosizioniMostratePrecedenti =  JSON.parse( 
              JSON.stringify(this.elencoPosizioniMostrate));    */
            this.elencoPosizioniMostrate = this.elencoPosizioniMostrate.concat(
              JSON.parse( 
              JSON.stringify(this.elencoPosizioniNuove)));                        
          }
    
        this.impostaPosizioneMezziVisibili(this.elencoPosizioniNuove);
        // restituisce gli array delle posizioni elaborate
        this.subjectNuovePosizioniMezzo$.next(this.elencoPosizioniNuove);
      }
    }

      //console.log("flotta-dispatcher.service - elencoPosizioniNuove", this.elencoPosizioniNuove );

  
    // individua le posizioni con localizzazione Modificata ed eventualmente anche lo stato
    elaboraPosizioniLocalizzazioneModificata(elenco: PosizioneMezzo[]) : void {
      this.elencoPosizioniLocalizzazioneModificata = elenco.
        filter( (item) => {
          var v = this.elencoPosizioniMostratePrecedenti.find( 
            x => item.codiceMezzo == x.codiceMezzo );
          if ( v != null &&
               (
                 (v.localizzazione.lat != item.localizzazione.lat ||
               v.localizzazione.lon != item.localizzazione.lon )
               || (v.localizzazione.lat != item.localizzazione.lat ||
                v.localizzazione.lon != item.localizzazione.lon ) && 
                v.infoSO115.stato != item.infoSO115.stato )
              ) {
                // modifica nel DataStore la posizioni variata ed eventualmente il suo stato         
                var kk = this.elencoPosizioniMostrate.findIndex( 
                  x => item.codiceMezzo === x.codiceMezzo );                
                if ( kk != null ) 
                  {                           
                    this.elencoPosizioniMostrate[kk].fonte = item.fonte;
                    this.elencoPosizioniMostrate[kk].istanteAcquisizione = item.istanteAcquisizione;
                    this.elencoPosizioniMostrate[kk].istanteArchiviazione = item.istanteArchiviazione;
                    this.elencoPosizioniMostrate[kk].istanteInvio = item.istanteInvio;
                    this.elencoPosizioniMostrate[kk].localizzazione = item.localizzazione;
                    if (  item.infoSO115.stato != "0")
                     {this.elencoPosizioniMostrate[kk].infoSO115.stato = item.infoSO115.stato; }
                  }
                
                return item}
          else {return null}  }
         );
      //console.log("flotta-dispatcher.service - elencoPosizioniLocalizzazioneModificata", this.elencoPosizioniLocalizzazioneModificata );

      if (this.elencoPosizioniLocalizzazioneModificata.length > 0) {
        this.impostaPosizioneMezziVisibili(this.elencoPosizioniLocalizzazioneModificata);
        this.subjectPosizioniMezzoLocalizzazioneModificata$.next(this.elencoPosizioniLocalizzazioneModificata);
      }
    }

    // individua le posizioni con il solo stato Modificato
    elaboraPosizioniStatoModificato(elenco: PosizioneMezzo[]) : void {
      this.elencoPosizioniStatoModificato = elenco.
        filter( (item) => {
          var v = this.elencoPosizioniMostratePrecedenti.find( 
            x => item.codiceMezzo == x.codiceMezzo );
          if ( v != null &&
               v.infoSO115.stato != item.infoSO115.stato &&
               v.localizzazione.lat === item.localizzazione.lat &&
                v.localizzazione.lon === item.localizzazione.lon               
              ) {
                // modifica nel DataStore lo stato variato
                var kk = this.elencoPosizioniMostrate.findIndex( 
                  x => item.codiceMezzo === x.codiceMezzo );                
                if ( kk != null ) 
                  {                           
                    this.elencoPosizioniMostrate[kk].fonte = item.fonte;
                    this.elencoPosizioniMostrate[kk].istanteAcquisizione = item.istanteAcquisizione;
                    this.elencoPosizioniMostrate[kk].istanteArchiviazione = item.istanteArchiviazione;
                    this.elencoPosizioniMostrate[kk].istanteInvio = item.istanteInvio;
                    this.elencoPosizioniMostrate[kk].infoSO115.stato = item.infoSO115.stato;
                  }
                  
                return item}
          else {return null}  }
         );

        if (this.elencoPosizioniStatoModificato.length > 0) {
          this.impostaPosizioneMezziVisibili(this.elencoPosizioniStatoModificato);
          this.subjectPosizioniMezzoStatoModificato$.next(this.elencoPosizioniStatoModificato);
        }
      }
        

      /*
      // modifica nel DataStore le posizioni con variazioni
      this.elencoPosizioniDaElaborare.forEach( item => { 
        var v = this.elencoPosizioniMostrate.findIndex( 
          x => item.codiceMezzo === x.codiceMezzo );
        
        if ( v != null ) 
          {           
          // se la posizione ricevuta ha uno stato 'sconosciuto', significa che proviene
          // da un dispositivo che fornisce solo la localizzazione pertanto
          // modifica solo quelle informazioni,
          // altrimenti modifica anche aggiuntive, inviate ad esempio da SO115 e GAC
          if (item.infoSO115.stato != "0")
            { 
              //console.log("stato ok", this.elencoPosizioniMostrate[v] );
              this.elencoPosizioniMostrate[v] = item; 
*/              
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
/*  
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

              //console.log(this.elencoPosizioniMostrate[v].infoSO115.stato );
            }
            
        }    


      } )
 */ 

/*
    public putVisibleStatiMezzo(vociFiltroSelezionate : String[]): void {
      this.gestioneFiltriService.setVisibleStatiMezzo(vociFiltroSelezionate);
    }
    public putVisibleSedi(vociFiltroSelezionate : String[]): void {
      this.gestioneFiltriService.setVisibleSedi(vociFiltroSelezionate);
    }
    public putVisibleGeneriMezzo(vociFiltroSelezionate : String[]): void {
      this.gestioneFiltriService.setVisibleGeneriMezzo(vociFiltroSelezionate);
    }
    public putVisibleDestinazioneUso(vociFiltroSelezionate : String[]): void {
      this.gestioneFiltriService.setVisibleDestinazioneUso(vociFiltroSelezionate);
    }
*/    
    setVisiblePosizioneMezzoSelezionato( posizione: PosizioneMezzo,
       elencoMezziSelezionati: PosizioneMezzo[]) { 
        //var r : boolean ;
        //r = (elencoMezziSelezionati.find( i => i.codiceMezzo === posizione.codiceMezzo) == null) ? false : true;
        if (elencoMezziSelezionati.
              find( i => i.codiceMezzo === posizione.codiceMezzo) != null) 
        {  this.elencoPosizioniMostrate.
          find( i => i.codiceMezzo === posizione.codiceMezzo).visibile = true;
        }
    }

    setVisiblePosizioneMezzo(p: PosizioneMezzo) { 
      var pp : number = this.elencoPosizioniMostrate.
        findIndex( i => i.codiceMezzo === p.codiceMezzo);
      if ( pp != 0)
      { var r : boolean ;
        r = (r? true: this.vociFiltroStatiMezzo.filter( checked => checked.selezionato === true).
          some(filtro => filtro.codice === p.infoSO115.stato )
          && this.vociFiltroSedi.filter( checked => checked.selezionato === true).
          some(filtro => filtro.codice === p.sedeMezzo )
          && this.vociFiltroGeneriMezzo.filter( checked => checked.selezionato === true).
          some(filtro => p.classiMezzo.some( item => item === filtro.codice))
          && this.vociFiltroDestinazioneUso.filter( checked => checked.selezionato === true).
          some(filtro => filtro.codice === p.destinazioneUso )
          );

          this.elencoPosizioniMostrate[pp].visibile = r;
      }
    }
    
    private impostaPosizioneMezziVisibili(elenco: PosizioneMezzo[]): void  { 
      if (this.vociFiltroStatiMezzo.length > 0 && this.vociFiltroSedi.length > 0  
        && this.vociFiltroGeneriMezzo.length > 0 && this.vociFiltroDestinazioneUso.length > 0 )
       { elenco.forEach( p  => this.setVisiblePosizioneMezzo(p) ); }
      
    }



    private gestisciModificaParametri(parm : ParametriGeoFleetWS) : void {
    
      this.parametriGeoFleetWS = parm;

      this.timer = Observable.timer(0,9000).timeout(120000);
      // schedula con un timer l'aggiornamento periodio della Situazione flotta
      this.timerSubcribe = this.timer.subscribe(t => 
        this.aggiornaSituazioneFlotta(this.parametriGeoFleetWS, false));
      
    }
  }

import { Injectable } from '@angular/core';
import { Observable, Subject, of } from "rxjs";
//import { Observable, Subject } from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import * as moment from 'moment';

import { ParametriGeoFleetWS } from '../shared/model/parametri-geofleet-ws.model';
import { PosizioneMezzo } from '../shared/model/posizione-mezzo.model';
import { PosizioneFlottaService } from '../service-VVFGeoFleet/posizione-flotta.service';
import { PosizioneFlottaServiceFake } from '../service-VVFGeoFleet/posizione-flotta.service.fake';
//import { observable } from 'rxjs';
//import { toObservable } from '@angular/forms/src/validators';

@Injectable(/*{
  providedIn: 'root'
}*/)
export class FlottaDispatcherService {

  public parametriGeoFleetWS : ParametriGeoFleetWS;
  public elencoPosizioniMezzo : PosizioneMezzo[] = [];
  public elencoPosizioniMezzoTrim : PosizioneMezzo[] = [];
    //private elencoPosizioniMezzoPrec : PosizioneMezzo[] = [];
  
  private timer;
  private timerSubcribe: PushSubscription;

  public istanteUltimoAggiornamento: Date;

  private maxIstanteAcquisizionePrecedente: Date ;
  public maxIstanteAcquisizione: Date = new Date("01/01/1900 00:00:00");

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

  private subjectPosizioniMezzo$ = new Subject<PosizioneMezzo[]>();
  private subjectIstanteUltimoAggiornamento$ = new Subject<Date>();

  constructor(
    private posizioneFlottaService: PosizioneFlottaService
  ) { 

    this.parametriGeoFleetWS = new ParametriGeoFleetWS();
    this.parametriGeoFleetWS.richiestaAPI = this.defaultrichiestaAPI;
    this.parametriGeoFleetWS.attSec = this.defaultAttSec;

    this.timer = Observable.interval(9000).timeout(120000);
    this.timer = Observable.timer(9000,9000).timeout(120000);
    this.timerSubcribe = this.timer.subscribe(t => 
      this.aggiornaSituazioneFlotta(this.parametriGeoFleetWS, false));
  }

  public getIstanteUltimoAggiornamento(): 
      Observable<Date> {
        return this.subjectIstanteUltimoAggiornamento$.asObservable();                
      }  

  public getSituazioneFlotta(parm : ParametriGeoFleetWS, all: boolean): 
      Observable<PosizioneMezzo[]> {

        return this.subjectPosizioniMezzo$.asObservable();
      }

  private aggiornaSituazioneFlotta(parm : ParametriGeoFleetWS, all: boolean): void {
      var obsPosizioniMezzo : Observable<PosizioneMezzo[]>;
    //this.subjectPosizioniMezzo$.next();

    this.istanteUltimoAggiornamento = moment().toDate();      

    this.subjectIstanteUltimoAggiornamento$.next(this.istanteUltimoAggiornamento);
  
    // aggiungere sempre X secondi per essere sicuri di perdersi
    // meno posizioni possibili, a causa della distanza di tempo tra
    // l'invio della richiesta dal client e la sua ricezione dal ws
    // Per essere certi, è necessaria un API che restituisca i messaggi
    // acquisiti successivamente ad un certo istante
    /*
    if (this.maxIstanteAcquisizionePrecedente == null) 
      { this.attSec = null;}
    else 
    */
    
    if (!all && this.maxIstanteAcquisizionePrecedente != null) 
    {parm.attSec = moment(this.istanteUltimoAggiornamento).
      diff(this.maxIstanteAcquisizionePrecedente, 'seconds').valueOf() + 
      this.trimSec.valueOf() ; }

    //console.log("FlottaDispatcherService.aggiornaSituazioneFlotta() - istanti",this.istanteUltimoAggiornamento, this.maxIstanteAcquisizionePrecedente);

    if (all) { this.maxIstanteAcquisizionePrecedente = null;}

    //var posizioni = this.getPosizioneMezzi(parm);


    //this.posizioneFlottaService.getPosizioneFlotta(this.attSec)
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
          //eventuali messaggi "futuri", consentiti dagli adapter SO115.

          // imposta maxIstanteAcquisizione filtrando le posizioni precedente all'
          // istanteUltimoAggiornamento
          var elencoPosizioniMezzoDepurate : PosizioneMezzo[];
          elencoPosizioniMezzoDepurate = this.elencoPosizioniMezzo.filter(
            i => (new Date(i.istanteAcquisizione) < new Date(this.istanteUltimoAggiornamento) )
          );            
          if (elencoPosizioniMezzoDepurate.length > 0) {
            this.maxIstanteAcquisizione = new Date(elencoPosizioniMezzoDepurate.
              reduce( function (a,b) 
              { var bb : Date = new Date(b.istanteAcquisizione);
                var aa : Date  = new Date(a.istanteAcquisizione);
                return aa>bb ? a : b ;
              }).istanteAcquisizione);

            this.maxIstanteAcquisizionePrecedente = this.maxIstanteAcquisizione;
            }

            
          //console.log("elencoPosizioniMezzo.length", this.elencoPosizioniMezzo.length);
          //console.log("elencoPosizioniMezzoDepurate.length", elencoPosizioniMezzoDepurate.length);
          //console.log("maxIstanteAcquisizione", this.maxIstanteAcquisizione);

          // imposta trimSec calcolando la differenza di tempo tra l'
          // istanteUltimoAggiornamento e l'istanteAcquisizione più alto tra le posizioni ricevute, 
          // purchè succesive a istanteUltimoAggiornamento
          this.trimSec = 0;
          //var elencoPosizioniMezzoTrim : PosizioneMezzo[];
          this.elencoPosizioniMezzoTrim = this.elencoPosizioniMezzo.filter(
            i => (new Date(i.istanteAcquisizione) >= new Date(this.istanteUltimoAggiornamento) )
            );
          //console.log("elencoPosizioniMezzoTrim", this.elencoPosizioniMezzoTrim);
          if (this.elencoPosizioniMezzoTrim.length > 0) {
              this.trimSec = moment(
                new Date(this.elencoPosizioniMezzoTrim.
                    reduce( function (a,b) 
                    { var bb : Date = new Date(b.istanteAcquisizione);
                      var aa : Date  = new Date(a.istanteAcquisizione);
                      return aa>bb ? a : b ;
                    }).istanteAcquisizione)).diff(this.istanteUltimoAggiornamento, 'seconds');
            }
          //console.log("trimSec", this.trimSec);
          this.trimSec = (this.trimSec.valueOf() > 0 ) ? this.trimSec.valueOf() + 10: 10;
          //console.log("trimSec adj", this.trimSec);
        }      
    
        obsPosizioniMezzo = Observable.of( this.elencoPosizioniMezzo);
        ////return obsPosizioniMezzo;
        this.subjectPosizioniMezzo$.next(this.elencoPosizioniMezzo);
          
      });


    //console.log(this.elencoPosizioniMezzo.length);
    }


}


import { Injectable } from '@angular/core';
//import { Observable } from "rxjs/Observable";
//import { TimerObservable } from "rxjs/Observable/TimerObservable";
import { Observable, Subscription, Subject, of } from "rxjs";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import * as moment from 'moment';

import { Http, Response, RequestOptions, Headers, RequestMethod  } from '@angular/http';

//import { HttpClient, HttpHeaders, HttpClientModule, HttpResponse } from '@angular/common/http';

import { ParametriGeoFleetWS } from '../shared/model/parametri-geofleet-ws.model';
import { GestioneParametriService } from '../service-parametri/gestione-parametri.service';

import { PosizioneMezzo } from '../shared/model/posizione-mezzo.model';
import { environment } from "../../environments/environment";
import { RispostaMezziInRettangolo } from '../shared/model/risultati-mezzi-in-rettangolo.model';


const API_URL = environment.apiUrl;

let headers = new Headers();
headers.append( 'Access-Control-Allow-Origin', '*' ); 
//headers.append( 'Access-Control-Allow-Origin', '*' ); 
//let options = new RequestOptions( { headers:  headers },  method: RequestMethod.Get);
let options = new RequestOptions( { headers:  headers , method: RequestMethod.Get });



@Injectable()
export class PosizioneFlottaService {

  private istanteUltimoAggiornamento: Date;
  private istanteAggiornamentoPrecedente: Date = null;

  private maxIstanteAcquisizione: Date;
  private maxIstanteAcquisizionePrecedente: Date = null;

  private trimSec: Number = 0;


  private defaultAttSec: Number = 259200; // 3 giorni (3 * 24 * 60 * 60)
  //private defaultAttSec: Number = 604800; // 1 settimana (7 * 24 * 60 * 60)
  private defaultrichiestaAPI: string = 'posizioneFlotta';
  //private attSec : Number = 604800; // 1 settimana (7 * 24 * 60 * 60)
  
  //private timer;
  //private timerSubcribe: PushSubscription;
  public parametriGeoFleetWS : ParametriGeoFleetWS;

  private elencoPosizioni: PosizioneMezzo[] = [];
  private obsPosizioniMezzo$ : Observable<PosizioneMezzo[]>;

  private subjectIstanteUltimoAggiornamento$ = new Subject<Date>();

  subscription = new Subscription();
  
    constructor(private http: Http,
      private gestioneParametriService: GestioneParametriService    
    ) { 
      //this.timer = Observable.timer(9000,9000).timeout(120000);
      /*
      this.timer = Observable.interval(9000).timeout(120000);
      this.obsPosizioniMezzo$ = Observable.of(this.elencoPosizioni);
      */
     this.parametriGeoFleetWS = new ParametriGeoFleetWS();
     this.parametriGeoFleetWS.richiestaAPI = this.defaultrichiestaAPI;
     this.parametriGeoFleetWS.attSec = this.defaultAttSec;

     this.subscription.add(
      this.gestioneParametriService.getParametriGeoFleetWS()
      //.debounceTime(3000)
      .subscribe( parm => { this.parametriGeoFleetWS = parm; })
      );   

       
      
    }
    //constructor(private http: HttpClient) { }
    
    //public getPosizioneFlotta(attSec: Number ): Observable<PosizioneMezzo[]> {
    //public getPosizioneFlotta(parm: ParametriGeoFleetWS ): Observable<PosizioneMezzo[]> {
    public getPosizioneFlotta(): Observable<PosizioneMezzo[]> {

      var parm = this.parametriGeoFleetWS;
      //console.log(API_URL + richiestaWS);


    // memorizza l'istante di inizio di questa operazione di aggiornamento
    this.istanteUltimoAggiornamento = moment().toDate();      
  
    // aggiungere sempre X secondi per essere sicuri di perdersi
    // meno posizioni possibili, a causa della distanza di tempo tra
    // l'invio della richiesta dal client e la sua ricezione dal ws
    // Per essere certi, è necessaria un API che restituisca i messaggi
    // acquisiti successivamente ad un certo istante
    
    //if (!all && this.maxIstanteAcquisizionePrecedente != null) 
    if (this.maxIstanteAcquisizionePrecedente != null) 
    {parm.attSec = moment(this.istanteUltimoAggiornamento).
      diff(this.maxIstanteAcquisizionePrecedente, 'seconds').valueOf() + 
      this.trimSec.valueOf() ; }

    //console.log("FlottaDispatcherService.aggiornaSituazioneFlotta() - istanti",this.istanteUltimoAggiornamento, this.maxIstanteAcquisizionePrecedente);

    //if (all) { this.maxIstanteAcquisizionePrecedente = null; }
      
        var parametri : string = '';
        var richiestaWS : string = '';
        if (parm.attSec != null) { parametri = parametri+ 
          (parametri == '' ? '?': '&') + 'attSec='+ String(parm.attSec); }
        if (parm.lat1 != null) { parametri = parametri+
          (parametri == '' ? '?': '&') + 'lat1='+ String(parm.lat1); }
        if (parm.lon1 != null) { parametri = parametri+
          (parametri == '' ? '?': '&') + 'lon1='+ String(parm.lon1); }
        if (parm.lat2 != null) { parametri = parametri+
          (parametri == '' ? '?': '&') + 'lat2='+ String(parm.lat2); }
        if (parm.lon2 != null) { parametri = parametri+
          (parametri == '' ? '?': '&') + 'lon2='+ String(parm.lon2); }

        if (parametri != '' ) 
          { richiestaWS = parm.richiestaAPI + parametri; }
        else 
          { richiestaWS = parm.richiestaAPI; }

            
        var observable: Observable<Response> = this.http.get(API_URL + richiestaWS);

        
        /*
        var observable: Observable<Response>;
        observable = this.http.get(API_URL + richiestaWS);
        */
        var posizioniMezzo : PosizioneMezzo[];

        //return this.http.get(API_URL + 'posizioneFlotta').      
        if ( parm.richiestaAPI == 'posizioneFlotta')
        {
        this.obsPosizioniMezzo$ = observable.      
        map((r : Response) => 
          {  
          return r.json().
          map((e : PosizioneMezzo) => 
            { if (e.infoSO115 == null) { 
                e.infoSO115 = Object.create( {stato: String}); 
                e.infoSO115.stato = "0";
              }
              if (e.infoSO115.stato == null || e.infoSO115.stato == "" )
              {
                e.infoSO115.stato = "0";              
              }
              //e.tooltipText = Object.create(String.prototype);
              e.sedeMezzo = this.sedeMezzo(e);
              e.destinazioneUso = this.destinazioneUso(e);
              e.selezionato = false;
              e.toolTipText = this.toolTipText(e);
              e.classiMezzoDepurata = this.classiMezzoDepurata(e);
              e.descrizionePosizione = e.classiMezzoDepurata.toString() + " " + e.codiceMezzo + " (" + e.sedeMezzo + ")";            
              e.visibile = false;
              let posizioneMezzo = Object.create(PosizioneMezzo.prototype);
              return Object.assign(posizioneMezzo, e);
            }
          )
          })
        .catch(this.handleError);    
        };

        if ( parm.richiestaAPI == 'inRettangolo')
        {


        //obsPosizioniMezzo$ = observable.      
        this.obsPosizioniMezzo$ = observable.      
        map((r : Response) => 
          {
            //var risp : RispostaMezziInRettangolo = r.json();
            //var posizioniMezzo = risp.risultati.forEach( 
            return r.json().risultati.map( 
            (e : PosizioneMezzo) => 

              { if (e.infoSO115 == null) { 
                  e.infoSO115 = Object.create( {stato: String}); 
                  e.infoSO115.stato = "0";
                }
                if (e.infoSO115.stato == null || e.infoSO115.stato == "" )
                {
                  e.infoSO115.stato = "0";              
                }
                //e.tooltipText = Object.create(String.prototype);
                e.sedeMezzo = this.sedeMezzo(e);
                e.destinazioneUso = this.destinazioneUso(e);
                e.selezionato = false;
                e.toolTipText = this.toolTipText(e);
                e.classiMezzoDepurata = this.classiMezzoDepurata(e);
                e.descrizionePosizione = e.classiMezzoDepurata.toString() + " " + e.codiceMezzo + " (" + e.sedeMezzo + ")";
                e.visibile = false;
                let posizioneMezzo = Object.create(PosizioneMezzo.prototype);
                return Object.assign(posizioneMezzo, e);

              });
              //return Observable.of(posizioniMezzo);
          })
        .catch(this.handleError);      

        };

        var elencoPosizioniWS : PosizioneMezzo[] = [];
        this.obsPosizioniMezzo$.map( obj => 
          elencoPosizioniWS =  JSON.parse( JSON.stringify(obj))
        );
        
        if (elencoPosizioniWS.length > 0) {
          //l'attSec deve essere calcolato in relazione all'istante 
          //più alto ma comunque precedente all'istanteUltimoAggiornamento, per escludere 
          //eventuali messaggi "futuri", che potrebbero essere ricevuti dagli adapter SO115
          //a seguito di errata impostazione della data di sistema sui server dei Comandi Provinciali

          var elencoPosizioniMezzoDepurate : PosizioneMezzo[];
          elencoPosizioniMezzoDepurate = elencoPosizioniWS.filter(
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

          // imposta trimSec calcolando la differenza di tempo tra l'
          // istanteUltimoAggiornamento e l'istanteAcquisizione più alto tra le posizioni ricevute, 
          // purchè succesive a istanteUltimoAggiornamento
          this.trimSec = 0;
          var elencoPosizioniDaElaborare : PosizioneMezzo[];

          elencoPosizioniDaElaborare = elencoPosizioniWS.filter(
            i => (new Date(i.istanteAcquisizione) >= new Date(this.maxIstanteAcquisizionePrecedente) )
            );

          //console.log("elencoPosizioniDaElaborare", elencoPosizioniDaElaborare);
          if (elencoPosizioniDaElaborare.length > 0) {
              this.trimSec = moment(
                new Date(elencoPosizioniDaElaborare.
                    reduce( function (a,b) 
                    { var bb : Date = new Date(b.istanteAcquisizione);
                      var aa : Date  = new Date(a.istanteAcquisizione);
                      return aa>bb ? a : b ;
                    }).istanteAcquisizione)).diff(this.istanteUltimoAggiornamento, 'seconds');
            }
          //console.log("trimSec", this.trimSec);
          this.trimSec = (this.trimSec.valueOf() > 0 ) ? this.trimSec.valueOf() + 10: 10;
          //console.log("trimSec adj", this.trimSec);

   
          // restituisce l'istante di inizio di questa operazione di aggiornamento
          this.subjectIstanteUltimoAggiornamento$.next(this.istanteUltimoAggiornamento);
                
          if (elencoPosizioniMezzoDepurate.length > 0) {
            this.maxIstanteAcquisizionePrecedente = this.maxIstanteAcquisizione;
          }
                   
        }      
    
        
        return this.obsPosizioniMezzo$;

    };
  
    private handleError(error: Response | any) {
      if (error != null)
      { console.error('ApiService::handleError', error);
        return Observable.throw(error);
      }
    }

    public getIstanteUltimoAggiornamento(): 
    Observable<Date> {
      return this.subjectIstanteUltimoAggiornamento$.asObservable();                
    }  
  
    sedeMezzo(p : PosizioneMezzo) {
      //return p.classiMezzo.find( i =>  i.substr(0,5) == "PROV:".substr(5,2));
      
      var r : string;
      if (p.classiMezzo != null) {
        r = p.classiMezzo.find( i =>  (i.substr(0,5) == "PROV:"));
        r = (r != null) ?  r.substr(5,2) : ".."; } 
      return ( r != null ? r: "..");    
    }
    

    destinazioneUso(p : PosizioneMezzo) {
      //return p.classiMezzo.find( i =>  i.substr(0,5) == "PROV:".substr(5,2));
      
      var r : string;
      if (p.classiMezzo != null) {
        r = p.classiMezzo.find( i =>  (i.substr(0,5) == "USO:"));
        //r = (r != null) ?  r.substr(5,2) : ".."; } 
        r = (r != null) ?  r.substr(5,2) : "CORP"; } 
      return ( r != null ? r: "..");
    }
    
  
    classiMezzoDepurata(p : PosizioneMezzo) {
      return p.classiMezzo.
        filter( i =>  (i.substr(0,5) != "PROV:") ).
        filter( i =>  (i.substr(0,5) != "USO:") )
    }
      
    toolTipText(item : PosizioneMezzo) {
      var testo : string;
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

  }

import { Injectable } from '@angular/core';
//import { Observable } from "rxjs/Observable";
//import { TimerObservable } from "rxjs/Observable/TimerObservable";
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


import { Http, Response, RequestOptions, Headers, RequestMethod  } from '@angular/http';

//import { HttpClient, HttpHeaders, HttpClientModule, HttpResponse } from '@angular/common/http';

import { ParametriGeoFleetWS } from '../shared/model/parametri-geofleet-ws.model';
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

  //private timer;
  //private timerSubcribe: PushSubscription;
  public parametriGeoFleetWS : ParametriGeoFleetWS;

  private elencoPosizioni: PosizioneMezzo[] = [];
  private obsPosizioniMezzo$ : Observable<PosizioneMezzo[]>;
  
    constructor(private http: Http) { 
      //this.timer = Observable.timer(9000,9000).timeout(120000);
      /*
      this.timer = Observable.interval(9000).timeout(120000);
      this.obsPosizioniMezzo$ = Observable.of(this.elencoPosizioni);
      */
     
    }
    //constructor(private http: HttpClient) { }
    
    //public getPosizioneFlotta(attSec: Number ): Observable<PosizioneMezzo[]> {
    public getPosizioneFlotta(parm: ParametriGeoFleetWS ): Observable<PosizioneMezzo[]> {

      //console.log(API_URL + richiestaWS);

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
                e.visibile = true;
                let posizioneMezzo = Object.create(PosizioneMezzo.prototype);
                return Object.assign(posizioneMezzo, e);

              });
              //return Observable.of(posizioniMezzo);
          })
        .catch(this.handleError);      

        };

        //console.log( this.obsPosizioniMezzo$);

        return this.obsPosizioniMezzo$;

    };
  
    private handleError(error: Response | any) {
      if (error != null)
      { console.error('ApiService::handleError', error);
        return Observable.throw(error);
      }
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
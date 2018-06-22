
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

const API_URL = environment.apiUrl;


let headers = new Headers();
headers.append( 'Access-Control-Allow-Origin', '*' ); 
headers.append( 'Access-Control-Allow-Origin', '*' ); 
//let options = new RequestOptions( { headers:  headers },  method: RequestMethod.Get);
let options = new RequestOptions( { headers:  headers , method: RequestMethod.Get });



@Injectable()
export class PosizioneFlottaService {

  
  private elencoPosizioni: PosizioneMezzo[];

    constructor(private http: Http) { }
    //constructor(private http: HttpClient) { }
    
    //public getPosizioneFlotta(attSec: Number ): Observable<PosizioneMezzo[]> {
    public getPosizioneFlotta(parm: ParametriGeoFleetWS ): Observable<PosizioneMezzo[]> {
        // this.http.get(API_URL + 'posizioneFlotta', options )
      var richiestaAPI :string;

      /*
      if (parm.attSec == null) { richiestaAPI = 'posizioneFlotta'; }
      else {  richiestaAPI = 'posizioneFlotta?attSec='+ String(parm.attSec);}
      */
      ///api/inRettangolo?lat1={lat1}&lon1={lon1}&lat2={lat2}&lon2={lon2}&classiMezzo={class1}&classiMezzo={class2}&attSec={seconds}
      richiestaAPI = 'posizioneFlotta';
      var parametri : string = '';
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

      if (parametri != '' ) { richiestaAPI = richiestaAPI + parametri};
      
      console.log(API_URL + richiestaAPI);

      var observable: Observable<Response> = this.http.get(API_URL + richiestaAPI) ;
      
      var posizioniMezzo : PosizioneMezzo[];
      var obsPosizioniMezzo : Observable<PosizioneMezzo[]>;

      //return this.http.get(API_URL + 'posizioneFlotta').      
      
      /*
      return observable.      
        map((r : Response) => r.json().
          map(e => 
            { 
              let posizioneMezzo = Object.create(PosizioneMezzo.prototype);
            return Object.assign(posizioneMezzo, e);
            }
          )
        )
        .catch(this.handleError);
      */
     obsPosizioniMezzo = observable.      
      map((r : Response) => r.json().
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
            e.toolTipText = this.toolTipText(e);
            e.classiMezzoDepurata = this.classiMezzoDepurata(e);
            e.descrizionePosizione = e.classiMezzoDepurata.toString() + " " + e.codiceMezzo + " (" + e.sedeMezzo + ")";
            let posizioneMezzo = Object.create(PosizioneMezzo.prototype);
            return Object.assign(posizioneMezzo, e);
          }
        )
      )
      .catch(this.handleError);      

      return obsPosizioniMezzo;


      /*
        console.log('getPosizioneFlotta');
      
        var observable = Observable.create((observer) => {
          var id = setInterval(() => {
            observer.next(console.log('observer.next su setInterval()'));
          }, 2000);
  
          setTimeout(() => {
            //clearInterval(id);
            //observer.complete();
            observer.next(console.log('observer.next su setTimeout()'));     
          }, 5000);        
        }); 
        
        observable = this.http.get(API_URL + 'posizioneFlotta') ;
        return observable.      
        map((r : Response) => r.json().
          map(e => 
            {
              let posizioneMezzo = Object.create(PosizioneMezzo.prototype);
            return Object.assign(posizioneMezzo, e);
            }
          )
        )
        .catch(this.handleError);
      */
    };
  
    private handleError(error: Response | any) {
      console.error('ApiService::handleError', error);
      return Observable.throw(error);
    }

    
    sedeMezzo(p : PosizioneMezzo) {
      return (p.classiMezzo.
        find( i =>  i.substr(0,5) == "PROV:")).substr(5,2);    
    }
    
  
    classiMezzoDepurata(p : PosizioneMezzo) {
      return p.classiMezzo.
        filter( i =>  (i.substr(0,5) != "PROV:") )
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
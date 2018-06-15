
import { Injectable } from '@angular/core';
//import { Observable } from "rxjs/Observable";
//import { TimerObservable } from "rxjs/Observable/TimerObservable";
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


import { Http, Response, RequestOptions, Headers, RequestMethod  } from '@angular/http';

//import { HttpClient, HttpHeaders, HttpClientModule, HttpResponse } from '@angular/common/http';

import { PosizioneMezzo } from '../posizione-mezzo/posizione-mezzo.model';
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
    
    public getPosizioneFlotta(attSec: Number ): Observable<PosizioneMezzo[]> {
      // this.http.get(API_URL + 'posizioneFlotta', options )
      var richiestaAPI :string;

      
      if (attSec == null) { richiestaAPI = 'posizioneFlotta'; }
      else {  richiestaAPI = 'posizioneFlotta?attSec='+ String(attSec);}
      
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
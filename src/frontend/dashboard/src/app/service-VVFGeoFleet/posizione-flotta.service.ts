
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
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
    
    public getPosizioneFlotta(): Observable<PosizioneMezzo[]> {
      //return this.http.get(API_URL + 'posizioneFlotta', options ).    
      
      return this.http.get(API_URL + 'posizioneFlotta').    
        map((r : Response) => r.json().
          map(e => 
            {
              let posizioneMezzo = Object.create(PosizioneMezzo.prototype);
            return Object.assign(posizioneMezzo, e);
            }
          )
        )
        .catch(this.handleError);

    };
  
    private handleError(error: Response | any) {
      console.error('ApiService::handleError', error);
      return Observable.throw(error);
    }
  
  }
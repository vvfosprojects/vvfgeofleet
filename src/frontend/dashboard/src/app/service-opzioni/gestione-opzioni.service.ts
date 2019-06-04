import { Injectable } from '@angular/core';
import { Observable, Subject, of } from "rxjs";
import { ParametriGeoFleetWS } from '../shared/model/parametri-geofleet-ws.model';

@Injectable({
  providedIn: 'root'
})
export class GestioneOpzioniService {

  private subjectParametri$ = new Subject<ParametriGeoFleetWS>();

  constructor() { }

  public getParametri(): Observable<ParametriGeoFleetWS> {
    return this.subjectParametri$.asObservable();
}

}

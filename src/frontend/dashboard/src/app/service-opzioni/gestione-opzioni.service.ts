import { Injectable } from '@angular/core';
import { Observable, Subject, of } from "rxjs";
import { ParametriGeoFleetWS } from '../shared/model/parametri-geofleet-ws.model';
import { Opzioni } from '../shared/model/opzioni.model';

// le opzioni vengono condivise in tutta l'applicazione
@Injectable({
  providedIn: 'root'
})
export class GestioneOpzioniService {

  private subjectParametriGeoFleetWS$ = new Subject<ParametriGeoFleetWS>();
  private subjectOpzioni$ = new Subject<Opzioni>();
  public opzioni : Opzioni;
  public parametriGeoFleetWS : ParametriGeoFleetWS;

  constructor() {  
    this.opzioni = new Opzioni(); 
    this.parametriGeoFleetWS = new ParametriGeoFleetWS();
   }

  public getOpzioni(): Observable<Opzioni> {
    return this.subjectOpzioni$.asObservable();
  }

  public getParametriGeoFleetWS(): Observable<ParametriGeoFleetWS> {
    return this.subjectParametriGeoFleetWS$.asObservable();
  }

  public resetOpzioni(): void { 
    this.opzioni.reset();
    this.subjectOpzioni$.next(this.opzioni);
  }
  
  public resetParametriGeoFleetWS(): void { 
    this.parametriGeoFleetWS.reset();
    this.subjectParametriGeoFleetWS$.next(this.parametriGeoFleetWS);
  }

  public setCenterOnLast(value : boolean): void { 
    this.opzioni.setCenterOnLast(value); 
    this.subjectOpzioni$.next(this.opzioni);
  }

  public setCenterOnMezzo(value : boolean): void { 
    this.opzioni.setCenterOnMezzo(value); 
    this.subjectOpzioni$.next(this.opzioni);
  }
  
  public setIsSeguiMezzo(value : boolean): void { 
    this.opzioni.setIsSeguiMezzo(value); 
    this.subjectOpzioni$.next(this.opzioni);
  }

  public setOnlyMap(value : boolean): void { 
    this.opzioni.setOnlyMap(value);
    this.subjectOpzioni$.next(this.opzioni);
  }

  public setGgMaxPos(value : number): void { 
    this.opzioni.setGgMaxPos(value); 
    this.parametriGeoFleetWS.setAttSec( value*24*60*60 );
    this.parametriGeoFleetWS.setDefaultAttSec( value*24*60*60 );    
    this.parametriGeoFleetWS.setRichiestaAPI('posizioneFlotta');
  
    this.subjectOpzioni$.next(this.opzioni);
    this.subjectParametriGeoFleetWS$.next(this.parametriGeoFleetWS);    
  }
  
  public setStartLat(value : number): void { 
    this.opzioni.setStartLat(value); 
    this.subjectOpzioni$.next(this.opzioni);
  }

  public setStartLon(value : number): void { 
    this.opzioni.setStartLon(value); 
    this.subjectOpzioni$.next(this.opzioni);
  }

  public setStartZoom(value : number): void { 
    this.opzioni.setStartZoom(value); 
    this.subjectOpzioni$.next(this.opzioni);
  }

  public setModalita(value : number): void { 
    this.opzioni.setModalita(value); 
    this.subjectOpzioni$.next(this.opzioni);
  }


  public setRettangoloRicerca(evento) {
    if (evento != null) {
      
      var vv = Object.values(evento);
      var vv1 = Object.values(vv[0]);
      var vv2 = Object.values(vv[1]);

      this.parametriGeoFleetWS.reset();
      this.parametriGeoFleetWS.setRichiestaAPI('inRettangolo');
      this.parametriGeoFleetWS.setAttSec(null);
      this.parametriGeoFleetWS.setLat1(vv1[1]);
      this.parametriGeoFleetWS.setLon1(vv2[0]);
      this.parametriGeoFleetWS.setLat2(vv1[0]);
      this.parametriGeoFleetWS.setLon2(vv2[1]);

      this.subjectParametriGeoFleetWS$.next(this.parametriGeoFleetWS);    

    }
  }    

}


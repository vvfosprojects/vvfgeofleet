import { Injectable } from '@angular/core';
import { Observable, Subject, of } from "rxjs";
import { Opzioni } from '../shared/model/opzioni.model';

import { GestioneParametriService } from '../service-parametri/gestione-parametri.service';

// le opzioni vengono condivise in tutta l'applicazione
@Injectable({
  providedIn: 'root'
})
export class GestioneOpzioniService {

  private subjectOpzioni$ = new Subject<Opzioni>();
  private opzioni : Opzioni;
  private opzioniPrecedenti : Opzioni;

  constructor(private gestioneParametriService: GestioneParametriService
  ) {  
    this.opzioni = new Opzioni(); 

    this.opzioniPrecedenti = new Opzioni();    
    this.opzioniPrecedenti = JSON.parse(JSON.stringify( this.opzioni));
   }

  public getOpzioni(): Observable<Opzioni> {
    return this.subjectOpzioni$.asObservable();
  }


  public resetOpzioni(): void { 
    this.opzioni.reset();
    this.subjectOpzioni$.next(this.opzioni);
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
    // in questo caso verifica che effettivamente l'opzione sia stata modificata 
    // in quanto comporta una nuova richiesta integrale al ws
    // 
    if (this.opzioniPrecedenti.getGgMaxPos() != value)
    { 
      this.gestioneParametriService.setAttSec(value);
      
      this.opzioni.setGgMaxPos(value); 

      this.opzioniPrecedenti = JSON.parse(JSON.stringify( this.opzioni));
      
      this.subjectOpzioni$.next(this.opzioni);
    }
  }
  
  public setStartLat(value : number): void { 
    this.opzioni.setStartLat(value); 
    this.subjectOpzioni$.next(this.opzioni);
  }

  public setStartLon(value : number): void { 
    this.opzioni.setStartLon(value); 
    this.subjectOpzioni$.next(this.opzioni);
  }

  public setUsertLat(value : number): void { 
    this.opzioni.setUsertLat(value); 
    this.subjectOpzioni$.next(this.opzioni);
  }

  public setUserLon(value : number): void { 
    this.opzioni.setUserLon(value); 
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

   
}


import { Injectable } from '@angular/core';
import { Observable, Subject, of } from "rxjs";
import { Opzioni } from '../shared/model/opzioni.model';

import { GestioneParametriService } from '../service-parametri/gestione-parametri.service';
import { GestioneFiltriService } from '../service-filter/gestione-filtri.service';

import { PosizioneMezzo } from '../shared/model/posizione-mezzo.model';

import * as moment from 'moment';


// le opzioni vengono condivise in tutta l'applicazione
@Injectable({
  providedIn: 'root'
})
export class GestioneOpzioniService {

  private subjectOpzioni$ = new Subject<Opzioni>();
  
  private opzioni : Opzioni;
  private opzioniPrecedenti : Opzioni;

  private subjectMezziSelezionati$ = new Subject<PosizioneMezzo[]>();
  private mezziSelezionati : PosizioneMezzo[] = [] ;

  constructor(private gestioneParametriService: GestioneParametriService,
    private gestioneFiltriService: GestioneFiltriService
  ) {  
    this.opzioni = new Opzioni(); 

    this.opzioniPrecedenti = new Opzioni();    
   }

  public getOpzioni(): Observable<Opzioni> {
    //console.log('GestioneOpzioniService - getOpzioni()',this.opzioni);    
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

  public setCenterOnSelected(value : boolean): void { 
    this.opzioni.setCenterOnSelected(value); 
    this.subjectOpzioni$.next(this.opzioni);
  }
  

  public setOnlySelected(value : boolean): void { 
    var k = this.opzioniPrecedenti.getOnlySelected();
    if ( k != value)
    { 
      this.opzioni.setOnlySelected(value);
      this.opzioniPrecedenti.set(this.opzioni);
      
      this.subjectOpzioni$.next(this.opzioni);
    }   
  }

  public setOnlyMap(value : boolean): void { 
    var k = this.opzioniPrecedenti.getOnlyMap();
    if ( k != value)
    { 
      this.opzioni.setOnlyMap(value);
      if (!value) {
        this.gestioneParametriService.setRichiestaAPI('posizioneFlotta');
      }
      else {
        this.gestioneParametriService.setRichiestaAPI('inRettangolo');
      }
      this.gestioneParametriService.setAttSec(this.opzioni.getGgMaxPos()*24*60*60);    
     
      this.opzioniPrecedenti.set(this.opzioni);
      
      this.subjectOpzioni$.next(this.opzioni);
    }      
  }

  public setGgMaxPos(value : number): void { 
    // in questo caso verifica che effettivamente l'opzione sia stata modificata 
    // in quanto comporta una nuova richiesta integrale al ws
    // 
    var k = this.opzioniPrecedenti.getGgMaxPos();
    //console.log(moment().toDate(),k,value);

    if ( k != value)
    { 
      this.gestioneParametriService.setAttSec(value*24*60*60);            
      this.opzioni.setGgMaxPos(value); 

      this.opzioniPrecedenti.set(this.opzioni);
      
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

  public setUserLat(value : number): void { 
    this.opzioni.setUserLat(value); 
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
    // in questo caso verifica che effettivamente l'opzione sia stata modificata 
    // in quanto comporta una nuova richiesta integrale al ws
    // 
    // value:
    // 1 - Comando
    // 2 - Dir.Reg.
    // 3 - CON
    var k = this.opzioniPrecedenti.getModalita();
    if ( k != value)
    { 
      this.opzioni.setModalita(value); 
      if (value == 1 || value == 2)
      { this.opzioni.setOnlyMap(true); 
        this.gestioneParametriService.setRichiestaAPI('inRettangolo');
        this.opzioni.setStartLat(this.opzioni.getUserLat());
        this.opzioni.setStartLon(this.opzioni.getUserLon());
        this.opzioni.setStartZoom(value == 1 ? 10: 8);
        // imposta gli stessi filtri sullo stato Mezzo in entrambi i casi
        this.gestioneFiltriService.setVisibleStatiMezzo(['0','1','2','3','5','6']);
      }
      else 
      { this.opzioni.setOnlyMap(false); 
        this.gestioneParametriService.setRichiestaAPI('posizioneFlotta');
        this.opzioni.setStartLat(this.opzioni.getUserLat());
        this.opzioni.setStartLon(this.opzioni.getUserLon());
        this.opzioni.setStartZoom(6);
        this.gestioneFiltriService.setVisibleStatiMezzo(['1','2','3']);
      }
      this.gestioneParametriService.setAttSec(this.opzioni.getGgMaxPos()*24*60*60);

      this.opzioniPrecedenti.set(this.opzioni);
      
      this.subjectOpzioni$.next(this.opzioni);
    }
  }


}


import { Component } from '@angular/core';
import { PosizioneMezzo } from './posizione-mezzo/posizione-mezzo.model';
import { PosizioneFlottaService } from './service-VVFGeoFleet/posizione-flotta.service';
import { PosizioneFlottaServiceFake } from './service-VVFGeoFleet/posizione-flotta.service.fake';
import { Observable } from "rxjs/Rx";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  title = 'VVFGeoFleet Dashboard';

  public elencoPosizioniMezzo : PosizioneMezzo[] = [];
  //private elencoPosizioniMezzoPrec : PosizioneMezzo[] = [];
  
  private timer;
  private timerSubcribe: PushSubscription;

        constructor(private posizioneFlottaService: PosizioneFlottaService) { 
          
        }
        
        /*
        ngOnInit() { this.posizioneFlottaService.getPosizioneFlotta()
          .subscribe( posizioni => {
            console.log("posizioneFlottaService: ", posizioni);
            this.elencoPosizioniMezzo = posizioni.sort( 
              function(a,b) 
              { var bb : Date = new Date(b.istanteAcquisizione);
                var aa : Date  = new Date(a.istanteAcquisizione);
                return aa>bb ? -1 : aa<bb ? 1 : 0;
              }
            );
          });

      
        }   
        */
  
        ngOnInit() { 
          this.aggiorna('-');
          this.timer = Observable.timer(9000,9000).timeout(120000);
          this.timerSubcribe = this.timer.subscribe(t => this.aggiorna(t));
        }   

        aggiorna(tt) {
          //this.elencoPosizioniMezzoPrec = this.elencoPosizioniMezzo;
          //console.log("elencoPosizioniMezzoPrec: ", this.elencoPosizioniMezzoPrec);
          
          this.posizioneFlottaService.getPosizioneFlotta()
          .subscribe( posizioni => {
            //console.log("posizioneFlottaService: ", posizioni);
            this.elencoPosizioniMezzo = posizioni.sort( 
              function(a,b) 
              { var bb : Date = new Date(b.istanteAcquisizione);
                var aa : Date  = new Date(a.istanteAcquisizione);
                return aa>bb ? -1 : aa<bb ? 1 : 0;
              }
            );
          });
            
        }
    
        ngOnDestroy(){
          this.timerSubcribe.unsubscribe();
          //console.log("Destroy timer");
      
        }

}

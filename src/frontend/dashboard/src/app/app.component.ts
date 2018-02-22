import { Component } from '@angular/core';
import { PosizioneMezzo } from './posizione-mezzo/posizione-mezzo.model';
import { PosizioneFlottaService } from './service-VVFGeoFleet/posizione-flotta.service';
import { PosizioneFlottaServiceFake } from './service-VVFGeoFleet/posizione-flotta.service.fake';
import { Observable } from "rxjs/Rx";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [{ provide: PosizioneFlottaService, useClass:PosizioneFlottaService}],
  //providers: [{ provide: PosizioneFlottaService, useClass:PosizioneFlottaServiceFake}],
})

export class AppComponent {
  title = 'VVFGeoFleet Dashboard';

  private elencoPosizioniMezzo : PosizioneMezzo[] = [];

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
        /*
        ngOnInit() { 
       
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

             
          observable = this.posizioneFlottaService.getPosizioneFlotta()
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
          this.timer = Observable.timer(2000,5000).timeout(10000);
          this.timerSubcribe = this.timer.subscribe(t => this.aggiorna(t));
        }   

        aggiorna(tt) {
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
          console.log("Destroy timer");
      
        }

}

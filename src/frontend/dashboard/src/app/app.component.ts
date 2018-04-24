import { Component } from '@angular/core';
import { PosizioneMezzo } from './posizione-mezzo/posizione-mezzo.model';
import { PosizioneFlottaService } from './service-VVFGeoFleet/posizione-flotta.service';
import { PosizioneFlottaServiceFake } from './service-VVFGeoFleet/posizione-flotta.service.fake';
import { Observable } from "rxjs/Rx";
import * as moment from 'moment';


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

  public istanteUltimoAggiornamento: Date;

  private maxIstanteAcquisizionePrecedente: Date ;
  public maxIstanteAcquisizione: Date = new Date("01/01/1900 00:00:00");


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
          var attSec : Number;

          this.istanteUltimoAggiornamento = moment().toDate();      
          
          // aggiungere sempre X secondi per essere sicuri di perdersi
          // meno posizioni possibili, a causa della distanza di tempo tra
          // l'invio della richiesta dal client e la sua ricezione dal ws
          // Per essere certi, è necessaria un API che restituisca i messaggi
          // acquisiti successivamente ad un certo istante
          if (this.maxIstanteAcquisizionePrecedente == null) { attSec = null;}
          else {attSec = moment(this.istanteUltimoAggiornamento).
            diff(this.maxIstanteAcquisizionePrecedente, 'seconds') + 10 ; }
           
          this.posizioneFlottaService.getPosizioneFlotta(attSec)
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

          if (this.elencoPosizioniMezzo.length > 0) {
            this.maxIstanteAcquisizione = new Date(this.elencoPosizioniMezzo.
              reduce( function (a,b) 
              { var bb : Date = new Date(b.istanteAcquisizione);
                var aa : Date  = new Date(a.istanteAcquisizione);
                return aa>bb ? a : b ;
              }).istanteAcquisizione);

            this.maxIstanteAcquisizionePrecedente = this.maxIstanteAcquisizione;

          }      
      
     
        }
    
        ngOnDestroy(){
          this.timerSubcribe.unsubscribe();
          //console.log("Destroy timer");
      
        }


       

}

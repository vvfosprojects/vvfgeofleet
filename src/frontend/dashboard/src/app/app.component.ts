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

  private trimSec: Number = 0;

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
            diff(this.maxIstanteAcquisizionePrecedente, 'seconds').valueOf() + 
            this.trimSec.valueOf() ; }
        
          //console.log("istanti",this.istanteUltimoAggiornamento,this.maxIstanteAcquisizionePrecedente);

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
            //l'attSec deve essere calcolato in relazione all'istante 
            //più alto ma comunque precedente all'istanteUltimoAggiornamento, per escludere 
            //eventuali messaggi "futuri", consentiti dagli adapter SO115.

            // imposta maxIstanteAcquisizione filtrando le posizioni precedente all'
            // istanteUltimoAggiornamento
            var elencoPosizioniMezzoDepurate : PosizioneMezzo[];
            elencoPosizioniMezzoDepurate = this.elencoPosizioniMezzo.filter(
              i => (new Date(i.istanteAcquisizione) < new Date(this.istanteUltimoAggiornamento) )
            );            
            if (elencoPosizioniMezzoDepurate.length > 0) {
              this.maxIstanteAcquisizione = new Date(elencoPosizioniMezzoDepurate.
                reduce( function (a,b) 
                { var bb : Date = new Date(b.istanteAcquisizione);
                  var aa : Date  = new Date(a.istanteAcquisizione);
                  return aa>bb ? a : b ;
                }).istanteAcquisizione);

              this.maxIstanteAcquisizionePrecedente = this.maxIstanteAcquisizione;
              }

            //console.log("maxIstanteAcquisizione", this.maxIstanteAcquisizione);

            // imposta trimSec calcolando la differenza di tempo tra l'
            // istanteUltimoAggiornamento e l'istanteAcquisizione più alto tra le posizioni ricevute, 
            // purchè succesive a istanteUltimoAggiornamento
            this.trimSec = 0;
            var elencoPosizioniMezzoTrim : PosizioneMezzo[];
            elencoPosizioniMezzoTrim = this.elencoPosizioniMezzo.filter(
              i => (new Date(i.istanteAcquisizione) >= new Date(this.istanteUltimoAggiornamento) )
              );
            //console.log("elencoPosizioniMezzoTrim", elencoPosizioniMezzoTrim);
            if (elencoPosizioniMezzoTrim.length > 0) {
                this.trimSec = moment(
                  new Date(elencoPosizioniMezzoTrim.
                      reduce( function (a,b) 
                      { var bb : Date = new Date(b.istanteAcquisizione);
                        var aa : Date  = new Date(a.istanteAcquisizione);
                        return aa>bb ? a : b ;
                      }).istanteAcquisizione)).diff(this.istanteUltimoAggiornamento, 'seconds');
              }
            //console.log("trimSec", this.trimSec);
            this.trimSec = (this.trimSec.valueOf() > 0 ) ? this.trimSec.valueOf() + 10: 10;
            //console.log("trimSec adj", this.trimSec);
          }      
      

        }
    
        ngOnDestroy(){
          this.timerSubcribe.unsubscribe();
          //console.log("Destroy timer");
      
        }


       

}

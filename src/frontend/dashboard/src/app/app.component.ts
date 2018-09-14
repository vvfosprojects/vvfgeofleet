import { Component, OnInit } from '@angular/core';
import { ParametriGeoFleetWS } from './shared/model/parametri-geofleet-ws.model';
import { PosizioneMezzo } from './shared/model/posizione-mezzo.model';
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

  public parametriGeoFleetWS : ParametriGeoFleetWS;
  public elencoPosizioniMezzo : PosizioneMezzo[] = [];
  public elencoPosizioniMezzoTrim : PosizioneMezzo[] = [];
    //private elencoPosizioniMezzoPrec : PosizioneMezzo[] = [];
  
  private timer;
  private timerSubcribe: PushSubscription;

  public istanteUltimoAggiornamento: Date;

  private maxIstanteAcquisizionePrecedente: Date ;
  public maxIstanteAcquisizione: Date = new Date("01/01/1900 00:00:00");

  private trimSec: Number = 0;
  private defaultAttSec: Number = 259200; // 3 giorni (3 * 24 * 60 * 60)
  //private defaultAttSec: Number = 604800; // 1 settimana (7 * 24 * 60 * 60)
  private defaultrichiestaAPI: string = 'posizioneFlotta';
  //private attSec : Number = 604800; // 1 settimana (7 * 24 * 60 * 60)

  private geolocationPosition : Position;
  public reset : Boolean = false;

  public startLat: number = 41.889777;
  public startLon: number = 12.490689;
  public startZoom: number = 6;

  public modalita: number = 3 ;

  constructor(
          private posizioneFlottaService: PosizioneFlottaService
        ) { 

          this.parametriGeoFleetWS = new ParametriGeoFleetWS();
          this.parametriGeoFleetWS.richiestaAPI = this.defaultrichiestaAPI;
          this.parametriGeoFleetWS.attSec = this.defaultAttSec;
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

          if (window.navigator && window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition(
                position => {
                    this.geolocationPosition = position;
                    //console.log(position);
                    /*
                    this.startLat = this.geolocationPosition.coords.latitude;
                    this.startLon = this.geolocationPosition.coords.longitude;
                    this.startZoom = 10;
                    */
                },
                error => {
                    switch (error.code) {
                        case 1:
                            console.log('Permission Denied');
                            break;
                        case 2:
                            console.log('Position Unavailable');
                            break;
                        case 3:
                            console.log('Timeout');
                            break;
                    }
                }
            );
          };

          this.aggiorna(this.parametriGeoFleetWS, true);
          this.timer = Observable.timer(9000,9000).timeout(120000);
          this.timerSubcribe = this.timer.subscribe(t => this.aggiorna(this.parametriGeoFleetWS,false));
        }   

        /*
        ngOnChanges() { 
          console.log(this.elencoPosizioniMezzo.length);
        }
        */

        //aggiorna(val : Number, all: boolean) {
        aggiorna(parm : ParametriGeoFleetWS, all: boolean) {
            //this.elencoPosizioniMezzoPrec = this.elencoPosizioniMezzo;
          //console.log("elencoPosizioniMezzoPrec: ", this.elencoPosizioniMezzoPrec);

          this.istanteUltimoAggiornamento = moment().toDate();      
          
          // aggiungere sempre X secondi per essere sicuri di perdersi
          // meno posizioni possibili, a causa della distanza di tempo tra
          // l'invio della richiesta dal client e la sua ricezione dal ws
          // Per essere certi, è necessaria un API che restituisca i messaggi
          // acquisiti successivamente ad un certo istante
          /*
          if (this.maxIstanteAcquisizionePrecedente == null) 
            { this.attSec = null;}
          else 
          */
          
          if (!all && this.maxIstanteAcquisizionePrecedente != null) 
           {parm.attSec = moment(this.istanteUltimoAggiornamento).
            diff(this.maxIstanteAcquisizionePrecedente, 'seconds').valueOf() + 
            this.trimSec.valueOf() ; }
        
          //console.log("istanti",this.istanteUltimoAggiornamento, this.maxIstanteAcquisizionePrecedente);

          if (all) { this.maxIstanteAcquisizionePrecedente = null;}
          
          //this.posizioneFlottaService.getPosizioneFlotta(this.attSec)
          this.posizioneFlottaService.getPosizioneFlotta(parm).debounceTime(3000)
          .subscribe( posizioni => {
              //console.log("posizioneFlottaService: ", posizioni);
              console.log("posizioneFlottaService.length: ", posizioni.length);
              this.elencoPosizioniMezzo = posizioni.sort( 
                function(a,b) 
                { var bb : Date = new Date(b.istanteAcquisizione);
                  var aa : Date  = new Date(a.istanteAcquisizione);
                  return aa>bb ? -1 : aa<bb ? 1 : 0;
                }
              );

              //console.log("this.elencoPosizioniMezzo.length", this.elencoPosizioniMezzo.length);

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
    
                   
                //console.log("elencoPosizioniMezzo.length", this.elencoPosizioniMezzo.length);
                //console.log("elencoPosizioniMezzoDepurate.length", elencoPosizioniMezzoDepurate.length);
                //console.log("maxIstanteAcquisizione", this.maxIstanteAcquisizione);
    
                // imposta trimSec calcolando la differenza di tempo tra l'
                // istanteUltimoAggiornamento e l'istanteAcquisizione più alto tra le posizioni ricevute, 
                // purchè succesive a istanteUltimoAggiornamento
                this.trimSec = 0;
                //var elencoPosizioniMezzoTrim : PosizioneMezzo[];
                this.elencoPosizioniMezzoTrim = this.elencoPosizioniMezzo.filter(
                  i => (new Date(i.istanteAcquisizione) >= new Date(this.istanteUltimoAggiornamento) )
                  );
                //console.log("elencoPosizioniMezzoTrim", this.elencoPosizioniMezzoTrim);
                if (this.elencoPosizioniMezzoTrim.length > 0) {
                    this.trimSec = moment(
                      new Date(this.elencoPosizioniMezzoTrim.
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
          
              
            });


            //console.log(this.elencoPosizioniMezzo.length);
        }
    
        ngOnDestroy() {
          this.timerSubcribe.unsubscribe();
          //console.log("Destroy timer");
      
        }


        aggiornaAttSec(evento) {
          //console.log("aggiornaAttSec", evento);

          if (evento != null) {
            //var gg: number = evento.value;
            var gg: number = evento;
            this.parametriGeoFleetWS.richiestaAPI = 'posizioneFlotta';            
            this.parametriGeoFleetWS.attSec = gg*24*60*60;
            this.defaultAttSec = this.parametriGeoFleetWS.attSec ;
            this.parametriGeoFleetWS.lat1= null;
            this.parametriGeoFleetWS.lon1= null;
            this.parametriGeoFleetWS.lat2= null;
            this.parametriGeoFleetWS.lon2= null;
            
            // console.log("aggiornaAttSec", evento, gg, this.attSec);
            this.timerSubcribe.unsubscribe();
            this.reset = true;
            this.aggiorna(this.parametriGeoFleetWS, true);
            this.timer = Observable.timer(9000,9000).timeout(120000);
            this.timerSubcribe = this.timer.subscribe(t => 
              {this.aggiorna(this.parametriGeoFleetWS,false);
                this.reset = false;
              });
          }

        }
        
        aggiornaArea(evento) {
          //console.log("aggiornaArea", evento);
          if (evento != null) {
            
            var vv = Object.values(evento);
            var vv1 = Object.values(vv[0]);
            var vv2 = Object.values(vv[1]);
            //console.log("aggiornaArea  vv",vv);
            this.parametriGeoFleetWS.richiestaAPI = 'inRettangolo';
            this.parametriGeoFleetWS.attSec = this.defaultAttSec ;
            this.parametriGeoFleetWS.lat1= vv1[1];
            this.parametriGeoFleetWS.lon1= vv2[0];
            this.parametriGeoFleetWS.lat2= vv1[0];
            this.parametriGeoFleetWS.lon2= vv2[1];

            this.timerSubcribe.unsubscribe();
            this.reset = true;
            this.aggiorna(this.parametriGeoFleetWS, true);
            this.timer = Observable.timer(9000,9000).timeout(120000);
            this.timerSubcribe = this.timer.subscribe(t => 
              {this.aggiorna(this.parametriGeoFleetWS,false);
                this.reset = false;
              });
          }
        }

}

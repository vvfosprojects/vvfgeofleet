import { Component, OnInit } from '@angular/core';
import { ParametriGeoFleetWS } from './shared/model/parametri-geofleet-ws.model';
import { PosizioneMezzo } from './shared/model/posizione-mezzo.model';
//import { PosizioneFlottaService } from './service-VVFGeoFleet/posizione-flotta.service';
//import { PosizioneFlottaServiceFake } from './service-VVFGeoFleet/posizione-flotta.service.fake';
import { FlottaDispatcherService } from './service-dispatcher/flotta-dispatcher.service';
import { Observable, Subscription } from "rxjs/Rx";
import * as moment from 'moment';


import { GestioneOpzioniService } from './service-opzioni/gestione-opzioni.service';

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
  /*
  private defaultAttSec: Number = 259200; // 3 giorni (3 * 24 * 60 * 60)
  //private defaultAttSec: Number = 604800; // 1 settimana (7 * 24 * 60 * 60)
  private defaultrichiestaAPI: string = 'posizioneFlotta';
  //private attSec : Number = 604800; // 1 settimana (7 * 24 * 60 * 60)
  */

  private geolocationPosition : Position;
  public reset : Boolean = false;

  public startLat: number = 41.889777;
  public startLon: number = 12.490689;
  public startZoom: number = 6;

  public modalita: number = 3 ;

  subscription = new Subscription();
     
  constructor(
          private flottaDispatcherService: FlottaDispatcherService,
          private gestioneOpzioniService: GestioneOpzioniService
        ) { 

          //this.parametriGeoFleetWS = new ParametriGeoFleetWS();
          //this.parametriGeoFleetWS.reset();
        
          
          this.subscription.add(
            this.flottaDispatcherService.getIstanteUltimoAggiornamento()
            .subscribe( istante => {
                this.istanteUltimoAggiornamento = istante; 
                console.log("this.istanteUltimoAggiornamento:", this.istanteUltimoAggiornamento);
              })
            );
          
        }

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


         
        }   

        
        /*
        aggiorna(parm : ParametriGeoFleetWS, all: boolean) {

         
          this.flottaDispatcherService.getSituazioneFlotta(parm, all).debounceTime(3000)
          .subscribe( posizioni => {
              console.log("app.component.aggiorna() - posizioni:", posizioni);
              //console.log("posizioneFlottaService.length: ", posizioni.length);
              this.elencoPosizioniMezzo = posizioni;
            }      
          );
        }
        */

   
        ngOnDestroy() {
          //this.timerSubcribe.unsubscribe();
          //console.log("Destroy timer");
      
        }
/*
        aggiornaIstanteUltimoAggiornamento(evento) {
          //console.log("aggiornaAttSec", evento);
          var dd: Date = evento;
          this.istanteUltimoAggiornamento = dd;

        }
*/

        ngOnChanges() {
          this.gestioneOpzioniService.setModalita(this.modalita);
        }
        /*
        aggiornaAttSec(evento) {
          //console.log("aggiornaAttSec", evento);

          if (evento != null) {
            //var gg: number = evento.value;
            var gg: number = evento;

            this.parametriGeoFleetWS.reset();
            this.parametriGeoFleetWS.setRichiestaAPI('posizioneFlotta');
            this.parametriGeoFleetWS.setAttSec( gg*24*60*60 );
            this.parametriGeoFleetWS.setDefaultAttSec( gg*24*60*60 );



            this.reset = true;
            this.aggiorna(this.parametriGeoFleetWS, true);

          }

        }
        */

        /*
        aggiornaArea(evento) {
          //console.log("aggiornaArea", evento);
          if (evento != null) {
            
            var vv = Object.values(evento);
            var vv1 = Object.values(vv[0]);
            var vv2 = Object.values(vv[1]);
            //console.log("aggiornaArea  vv",vv);
            this.parametriGeoFleetWS.setRichiestaAPI('inRettangolo');
            this.parametriGeoFleetWS.setAttSec(null);
            this.parametriGeoFleetWS.setLat1(vv1[1]);
            this.parametriGeoFleetWS.setLon1(vv2[0]);
            this.parametriGeoFleetWS.setLat2(vv1[0]);
            this.parametriGeoFleetWS.setLon2(vv2[1]);

            //this.timerSubcribe.unsubscribe();
            this.reset = true;
            this.aggiorna(this.parametriGeoFleetWS, true);

          }
        }
        */

}

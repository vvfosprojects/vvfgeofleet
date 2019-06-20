import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ParametriGeoFleetWS } from './shared/model/parametri-geofleet-ws.model';
import { FlottaDispatcherService } from './service-dispatcher/flotta-dispatcher.service';
import { Observable, Subscription } from "rxjs/Rx";
import * as moment from 'moment';


import { GestioneOpzioniService } from './service-opzioni/gestione-opzioni.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
  title = 'VVFGeoFleet Dashboard';

  public modalita: number = 3 ;
  public istanteUltimoAggiornamento: Date;

  private geolocationPosition : Position;

  subscription = new Subscription();
     
  constructor(
          private flottaDispatcherService: FlottaDispatcherService,
          private gestioneOpzioniService: GestioneOpzioniService
        ) { 

          
          this.subscription.add(
            this.flottaDispatcherService.getIstanteUltimoAggiornamento()
            .subscribe( istante => {
                this.istanteUltimoAggiornamento = istante; 
                //console.log("AppComponent - this.istanteUltimoAggiornamento:", this.istanteUltimoAggiornamento);
              })
            );
          
          this.impostaLocalizzazioneUtente();
              
        }

        ngOnInit() { 
          //console.log('AppComponent - ngOnInit()', this.modalita);

          if (window.navigator && window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition(
                position => {
                    this.geolocationPosition = position;
                    //console.log(position);

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

   
        ngOnDestroy() {

        }


        // ngOnChanges non viene attivato su modifiche al model che non 
        // siano via Input
        /* 
        ngOnChanges(changes: SimpleChanges) {
          console.log('AppComponent - ngOnChanges()', this.modalita);
          this.gestioneOpzioniService.setModalita(this.modalita);
        }
        */
        
        cambiaModalita($event,value) {
          this.modalita = value;
          //console.log('AppComponent - cambiaModalita()', $event,this.modalita);
          this.gestioneOpzioniService.setModalita(this.modalita);
        }
        

        impostaLocalizzazioneUtente() {
          if (window.navigator && window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition(
                position => {
                    this.geolocationPosition = position;
                    //console.log(position);                
                    this.gestioneOpzioniService.setUserLat(this.geolocationPosition.coords.latitude);
                    this.gestioneOpzioniService.setUserLon(this.geolocationPosition.coords.longitude);
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
              
}

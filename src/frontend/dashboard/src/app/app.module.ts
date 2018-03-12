import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ElencoPosizioniFlottaComponent } from './elenco-posizioni-flotta/elenco-posizioni-flotta.component';
import { PosizioneMezzoComponent } from './posizione-mezzo/posizione-mezzo.component';
import { PosizioneFlottaService } from './service-VVFGeoFleet/posizione-flotta.service';
import { PosizioneFlottaServiceFake } from './service-VVFGeoFleet/posizione-flotta.service.fake';

import { AgmCoreModule } from '@agm/core';
import { MappaPosizioniFlottaComponent } from './mappa-posizioni-flotta/mappa-posizioni-flotta.component';
import { FiltriComponent } from './filtri/filtri.component';
import { UiSwitchModule } from 'angular2-ui-switch/src';
import { FormsModule } from '@angular/forms';



import { DistanzaTemporalePipe } from "./shared/pipes/distanza-temporale.pipe";
import { LOCALE_ID } from '@angular/core';

import { AgmGetMapObjectsDirective } from "./shared/directive/agm-get-map-objects";

@NgModule({
  declarations: [
    AppComponent,
    ElencoPosizioniFlottaComponent,
    PosizioneMezzoComponent,
    MappaPosizioniFlottaComponent,
    FiltriComponent,
    DistanzaTemporalePipe,
    AgmGetMapObjectsDirective
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAX1J39E6WesXRiptR9arJPtMzE-2ddQPU'
    }),
    NgbModule.forRoot(),
    HttpModule,
    BrowserModule,
    FormsModule,
    UiSwitchModule
  ],
  providers: [
    //{ provide: PosizioneFlottaService, useClass:PosizioneFlottaServiceFake},
    { provide: PosizioneFlottaService, useClass:PosizioneFlottaService},
    { provide: LOCALE_ID, useValue: "it" }
],
  bootstrap: [AppComponent]
})
export class AppModule { }

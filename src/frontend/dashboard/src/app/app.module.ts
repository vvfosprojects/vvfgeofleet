import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ElencoPosizioniFlottaComponent } from './elenco-posizioni-flotta/elenco-posizioni-flotta.component';
import { PosizioneMezzoComponent } from './posizione-mezzo/posizione-mezzo.component';

import { GestioneFiltriService } from './service-filter/gestione-filtri.service';
import { FlottaDispatcherService } from './service-dispatcher/flotta-dispatcher.service';
import { PosizioneFlottaService } from './service-VVFGeoFleet/posizione-flotta.service';
import { PosizioneFlottaServiceFake } from './service-VVFGeoFleet/posizione-flotta.service.fake';

import { FiltriComponent } from './filtri/filtri.component';
//import { UiSwitchModule } from 'angular2-ui-switch';
import { UiSwitchModule } from 'ngx-ui-switch';
import { FormsModule } from '@angular/forms';


import { DistanzaTemporalePipe } from "./shared/pipes/distanza-temporale.pipe";
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';


import { MappaPosizioniFlottaComponent } from './mappa-posizioni-flotta/mappa-posizioni-flotta.component';
import { AgmCoreModule } from '@agm/core';
import { AgmGetMapObjectsDirective } from "./shared/directive/agm-get-map-objects";
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
//import {  } from '@types/google-maps';
import {  } from 'google-maps';


import { GmapsPosizioniFlottaComponent } from './gmaps-posizioni-flotta/gmaps-posizioni-flotta.component';

registerLocaleData(localeIt);

import { LOCALE_ID } from '@angular/core';

import { FiltroMultiSelectDdComponent } from './filtro-multi-select-dd/filtro-multi-select-dd.component';
import { MultiSelectModule } from 'primeng/multiselect';
import {AccordionModule} from 'primeng/accordion';
import {DropdownModule} from 'primeng/dropdown';
import {SliderModule} from 'primeng/slider';

import  {ButtonModule } from 'primeng/button';
import  { PanelModule} from 'primeng/panel';
import {DragDropModule} from 'primeng/dragdrop';
import {SidebarModule} from 'primeng/sidebar';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PannelloFiltriComponent } from './pannello-filtri/pannello-filtri.component';
import { PannelloOpzioniComponent } from './pannello-opzioni/pannello-opzioni.component';


@NgModule({
  declarations: [
    AppComponent,
    ElencoPosizioniFlottaComponent,
    PosizioneMezzoComponent,
    MappaPosizioniFlottaComponent,
    FiltriComponent,
    DistanzaTemporalePipe,
    AgmGetMapObjectsDirective,
    FiltroMultiSelectDdComponent,
    GmapsPosizioniFlottaComponent,
    PannelloFiltriComponent,
    PannelloOpzioniComponent
  ],
  imports: [
    
    AgmCoreModule.forRoot({
      apiKey: 'your Google apiKey'
    }), 
    AgmJsMarkerClustererModule,
    NgbModule,
    HttpModule,
    BrowserModule,
    FormsModule,
    UiSwitchModule,
    MultiSelectModule ,
    AccordionModule,
    BrowserAnimationsModule,
    DropdownModule,
    SliderModule,
    DragDropModule,
    SidebarModule    
  ],
  providers: [
    //{ provide: PosizioneFlottaService, useClass:PosizioneFlottaServiceFake},
    { provide: GestioneFiltriService, useClass:GestioneFiltriService},
    { provide: FlottaDispatcherService, useClass:FlottaDispatcherService},
    { provide: PosizioneFlottaService, useClass:PosizioneFlottaService},
    { provide: LOCALE_ID, useValue: "it-IT" }
],
  bootstrap: [AppComponent]
})
export class AppModule { }

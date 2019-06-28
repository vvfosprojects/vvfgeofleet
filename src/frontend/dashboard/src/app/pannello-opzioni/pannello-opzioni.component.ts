import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Opzioni } from '../shared/model/opzioni.model';
import { Subscription } from 'rxjs';

import { VoceFiltro } from "../filtri/voce-filtro.model";

import { PosizioneMezzo } from '../shared/model/posizione-mezzo.model';
import { Mezzo } from '../shared/model/mezzo.model';

import { GestioneOpzioniService } from '../service-opzioni/gestione-opzioni.service';
import { FlottaDispatcherService } from '../service-dispatcher/flotta-dispatcher.service';

import * as moment from 'moment';
import { isNgTemplate } from '@angular/compiler';


@Component({
  selector: 'app-pannello-opzioni',
  templateUrl: './pannello-opzioni.component.html',
  styleUrls: ['./pannello-opzioni.component.css']
})

//export class PannelloOpzioniComponent implements OnInit, OnChanges {
export class PannelloOpzioniComponent  {

  public opzioni: Opzioni;

  //@Input() elencoMezzi: PosizioneMezzo[] = [];
  //@Input() seguiMezziSelezionati: PosizioneMezzo[] = [];
  @Output() selezioneMezzi: EventEmitter<Object[]> = new EventEmitter();

  //private elencoMezzi: PosizioneMezzo[] = [];
  private elencoMezzi: Mezzo[] = [];

  private mezziSelezionati: PosizioneMezzo[] = [];

  public titoloFiltroMezziSelezionati: string = "Mezzi selezionati";
  public vociFiltroMezziSelezionati: VoceFiltro[] = [];
  
  subscription = new Subscription();
     
  constructor(
    private gestioneOpzioniService: GestioneOpzioniService,
    private flottaDispatcherService: FlottaDispatcherService
  ) { 
      this.opzioni = new Opzioni();

      this.subscription.add(
        this.gestioneOpzioniService.getOpzioni()
        .subscribe( opt => { this.opzioni.set(opt); 
          //console.log("this.opzioni",this.opzioni);
        })
      );   

      this.subscription.add(
        this.flottaDispatcherService.getMezziSelezionati()
        .subscribe( elenco => { this.mezziSelezionati = 
          JSON.parse(JSON.stringify(elenco));

        //console.log(moment().toDate(), "PannelloOpzioniComponent.getMezziSelezionati() - this.mezziSelezionati",  this.mezziSelezionati);
        
        })
      );   


      this.subscription.add(
        this.flottaDispatcherService.getNuovePosizioniFlotta()
        .subscribe( posizioni => {
            //(posizioni.length > 0)?console.log(moment().toDate(),"ElencoPosizioniFlottaComponent, getNuovePosizioniFlotta - posizioni:", posizioni):null;
            this.aggiornaMezzi(posizioni);
          })
        );   
        
    }

  nuovaSelezioneMezziSelezionati(event) {
    //console.log('event: ', event);
    this.selezioneMezzi.emit(event);
  } 


  aggiornaMezzi(posizioni: PosizioneMezzo[]) {

    this.elencoMezzi = this.elencoMezzi.concat( posizioni.map( item => { 
      var mezzo = new Mezzo( item.codiceMezzo, item.descrizionePosizione) ;
      return mezzo;}));

    this.vociFiltroMezziSelezionati = [];
    this.vociFiltroMezziSelezionati = this.elencoMezzi.map( 
      item => {
        var selezionato: boolean = this.mezziSelezionati.find( 
          itemSelezionato => item.codiceMezzo === itemSelezionato.codiceMezzo )?true:false;

        var voceFiltro = new VoceFiltro( item.codiceMezzo, item.descrizione, 0, 
          selezionato, "", "badge-info", "");
        return voceFiltro;              
      });

    // riordina l'array vociFiltroMezziSelezionati per Descrizione ascendente
    this.vociFiltroMezziSelezionati = this.vociFiltroMezziSelezionati.sort( 
      function(a,b) 
      { return a.descrizione>b.descrizione ? 1 : a.descrizione<b.descrizione ? -1 : 0;
      });
    
    
    //console.log("PannelloOpzioniComponent.aggiornaMezzi(), mezziSelezionati, vociFiltroMezziSelezionati (solo selezionati)", this.mezziSelezionati, this.vociFiltroMezziSelezionati.filter( item => item.selezionato));

  }
  //changeOptOnlyMap(e) {
  changeOptOnlyMap() {
    //console.log('changeOptOnlyMap - prima',this.opzioni);
    //if (!this.opzioni.getOnlyMap()) && e != '-') 
    if (!this.opzioni.getOnlyMap()) 
      {this.gestioneOpzioniService.setOnlyMap(true);}
    else
      {this.gestioneOpzioniService.setOnlyMap(false);}
    //console.log('changeOptOnlyMap - dopo',this.opzioni);
  }

  changeOptOnlySelected() {
    if (!this.opzioni.getOnlySelected()) 
      {this.gestioneOpzioniService.setOnlySelected(true);}
    else
      {this.gestioneOpzioniService.setOnlySelected(false);}
  }

  changeCenterOnLast() {
    if (!this.opzioni.getCenterOnLast()) 
      this.gestioneOpzioniService.setCenterOnLast(true)
    else 
      this.gestioneOpzioniService.setCenterOnLast(false)    
  }  

  changeCenterOnSelected() {
    if (!this.opzioni.getCenterOnSelected()) 
      this.gestioneOpzioniService.setCenterOnSelected(true)
    else 
      this.gestioneOpzioniService.setCenterOnSelected(false)    
  }  

  fineSelezioneGgMaxPos(e) {    
    //this.nuovaSelezioneGgMaxPos.emit(this.ggMaxPos);
    this.gestioneOpzioniService.setGgMaxPos(this.opzioni.getGgMaxPos());
  
  }


    
}
